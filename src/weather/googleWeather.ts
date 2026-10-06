import {
  GOOGLE_MAPS_API_KEY,
  WEATHER_LATITUDE,
  WEATHER_LONGITUDE,
} from "../constants/weather";
import type { Locale } from "../i18n/messages";

export const windCardinals = [
  "NORTH",
  "NORTH_NORTHEAST",
  "NORTHEAST",
  "EAST_NORTHEAST",
  "EAST",
  "EAST_SOUTHEAST",
  "SOUTHEAST",
  "SOUTH_SOUTHEAST",
  "SOUTH",
  "SOUTH_SOUTHWEST",
  "SOUTHWEST",
  "WEST_SOUTHWEST",
  "WEST",
  "WEST_NORTHWEST",
  "NORTHWEST",
  "NORTH_NORTHWEST",
] as const;

export type WindCardinal = (typeof windCardinals)[number];

export type WeatherHour = {
  hour: number;
  label: string;
  description: string;
  icon: string;
  temperature: number;
  precipitation: number;
  windSpeed: number | null;
  windCardinal: WindCardinal | null;
  current: boolean;
};

export type TodayWeather = {
  hours: WeatherHour[];
  current: WeatherHour;
};

type CivilDate = {
  year: number;
  month: number;
  day: number;
  hours: number;
};

type ApiHour = {
  displayDateTime?: CivilDate;
  weatherCondition?: {
    iconBaseUri?: string;
    description?: { text?: string };
  };
  temperature?: { degrees?: number };
  precipitation?: { probability?: { percent?: number } };
  wind?: {
    direction?: { cardinal?: string; degrees?: number };
    speed?: { value?: number };
  };
};

type HourResponse = {
  forecastHours?: ApiHour[];
  historyHours?: ApiHour[];
};

function languageCode(locale: Locale) {
  return locale === "jp" ? "ja" : "ko";
}

function lookupUrl(resource: "forecast" | "history", language: string) {
  const url = new URL(`https://weather.googleapis.com/v1/${resource}/hours:lookup`);
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY);
  url.searchParams.set("location.latitude", String(WEATHER_LATITUDE));
  url.searchParams.set("location.longitude", String(WEATHER_LONGITUDE));
  url.searchParams.set("hours", "24");
  url.searchParams.set("pageSize", "24");
  url.searchParams.set("unitsSystem", "METRIC");
  url.searchParams.set("languageCode", language);
  return url;
}

async function lookup(resource: "forecast" | "history", language: string) {
  const response = await fetch(lookupUrl(resource, language));
  if (!response.ok) throw new Error(String(response.status));
  return (await response.json()) as HourResponse;
}

const COURSE_TIME_ZONE = "Asia/Tokyo";

function courseNow(): CivilDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: COURSE_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hours: value("hour"),
  };
}

function sameDay(day: CivilDate, hour: ApiHour) {
  const date = hour.displayDateTime;
  return date?.year === day.year && date.month === day.month && date.day === day.day;
}

function windCardinal(value: string | undefined): WindCardinal | null {
  return windCardinals.find((cardinal) => cardinal === value) ?? null;
}

function toHour(hour: ApiHour, currentHour: number): WeatherHour | null {
  const date = hour.displayDateTime;
  const description = hour.weatherCondition?.description?.text;
  const icon = hour.weatherCondition?.iconBaseUri;
  const temperature = hour.temperature?.degrees;
  if (date?.hours == null || !description || !icon || temperature == null) return null;

  return {
    hour: date.hours,
    label: `${String(date.hours).padStart(2, "0")}:00`,
    description,
    icon: `${icon}_dark.svg`,
    temperature,
    precipitation: hour.precipitation?.probability?.percent ?? 0,
    windSpeed: hour.wind?.speed?.value ?? null,
    windCardinal: windCardinal(hour.wind?.direction?.cardinal),
    current: date.hours === currentHour,
  };
}

export async function loadTodayWeather(locale: Locale): Promise<TodayWeather> {
  const language = languageCode(locale);
  const [forecast, history] = await Promise.all([
    lookup("forecast", language),
    lookup("history", language).catch(() => ({ historyHours: [] }) satisfies HourResponse),
  ]);

  const upcoming = forecast.forecastHours ?? [];
  if (upcoming.length === 0) throw new Error("empty");

  const now = courseNow();
  const unique = new Map<number, WeatherHour>();
  for (const hour of [...(history.historyHours ?? []), ...upcoming]) {
    if (!sameDay(now, hour)) continue;
    const next = toHour(hour, now.hours);
    if (!next) continue;
    const existing = unique.get(next.hour);
    if (!existing || next.current) unique.set(next.hour, next);
  }

  const hours = [...unique.values()].sort((a, b) => a.hour - b.hour);

  const current = hours.find((hour) => hour.current) ?? hours[0];
  if (!current || hours.length === 0) throw new Error("empty");

  return { hours, current };
}
