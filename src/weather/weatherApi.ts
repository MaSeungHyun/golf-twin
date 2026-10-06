import { WEATHER_LATITUDE, WEATHER_LONGITUDE } from "../constants/weather";
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
  time: string;
  hour: number;
  label: string;
  description: string;
  icon: string;
  temperature: number;
  precipitation: number;
  windSpeed: number | null;
  windDegrees: number | null;
  windCardinal: WindCardinal | null;
  current: boolean;
};

export type TodayWeather = {
  hours: WeatherHour[];
  current: WeatherHour;
};

const FORECAST_HOURS = 12;
const WEATHER_COOKIE = "golf-weather-wa";

type ApiCondition = {
  text?: string;
  icon?: string;
};

type ApiHour = {
  time?: string;
  temp_c?: number;
  condition?: ApiCondition;
  chance_of_rain?: number;
  wind_kph?: number;
  wind_degree?: number;
};

type ForecastResponse = {
  location?: { localtime?: string };
  current?: {
    temp_c?: number;
    condition?: ApiCondition;
    wind_kph?: number;
    wind_degree?: number;
  };
  forecast?: {
    forecastday?: { hour?: ApiHour[] }[];
  };
};

type StoredHour = Omit<WeatherHour, "current">;

type StoredWeather = {
  latitude: number;
  longitude: number;
  locale: Locale;
  hours: StoredHour[];
};

type CivilDate = {
  year: number;
  month: number;
  day: number;
  hours: number;
};

function languageCode(locale: Locale) {
  return locale === "jp" ? "ja" : "ko";
}

function weatherApiKey() {
  const key = import.meta.env.VITE_WEATHERAPI_KEY;
  if (!key) throw new Error("missing VITE_WEATHERAPI_KEY");
  return key;
}

function tokyoNow(): CivilDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
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

function tokyoStamp() {
  const now = tokyoNow();
  const month = String(now.month).padStart(2, "0");
  const day = String(now.day).padStart(2, "0");
  const hour = String(now.hours).padStart(2, "0");
  return `${now.year}-${month}-${day} ${hour}`;
}

function endOfCourseDay(day: CivilDate) {
  return new Date(Date.UTC(day.year, day.month - 1, day.day, 15, 0, 0));
}

function iconUrl(icon: string) {
  return icon.startsWith("//") ? `https:${icon}` : icon;
}

// API 각도는 바람이 불어오는 쪽이다. 0이 북이고 시계 방향이다.
// 아이콘 0도는 서에서 동으로 부는 방향이다.
export function windFlowRotation(fromDegrees: number) {
  return (fromDegrees + 90) % 360;
}

function cardinalFromDegrees(degrees: number): WindCardinal {
  const index = ((Math.round(degrees / 22.5) % 16) + 16) % 16;
  return windCardinals[index] ?? "NORTH";
}

function toHour(sample: ApiHour, stamp: string): WeatherHour | null {
  const time = sample.time;
  const description = sample.condition?.text;
  const icon = sample.condition?.icon;
  if (!time || description == null || !icon || sample.temp_c == null) return null;

  const hour = Number(time.slice(11, 13));
  const degrees = sample.wind_degree;

  return {
    time,
    hour,
    label: `${String(hour).padStart(2, "0")}:00`,
    description,
    icon: iconUrl(icon),
    temperature: sample.temp_c,
    precipitation: sample.chance_of_rain ?? 0,
    windSpeed: sample.wind_kph == null ? null : sample.wind_kph / 3.6,
    windDegrees: degrees ?? null,
    windCardinal: degrees == null ? null : cardinalFromDegrees(degrees),
    current: time.startsWith(stamp),
  };
}

function upcoming(hours: StoredHour[], stamp: string): TodayWeather | null {
  const start = hours.findIndex((hour) => hour.time.slice(0, 13) >= stamp);
  if (start < 0) return null;

  const marked = hours.slice(start, start + FORECAST_HOURS).map((hour) => ({
    ...hour,
    current: hour.time.startsWith(stamp),
  }));
  const current = marked.find((hour) => hour.current) ?? marked[0];
  if (!current) return null;
  return { hours: marked, current };
}

function cookieValue(name: string) {
  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

async function compress(text: string) {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function decompress(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).text();
}

async function readCachedWeather(locale: Locale) {
  const raw = cookieValue(WEATHER_COOKIE);
  if (!raw) return null;

  try {
    const stored = JSON.parse(await decompress(raw)) as StoredWeather;
    const samePlace =
      stored.latitude === WEATHER_LATITUDE &&
      stored.longitude === WEATHER_LONGITUDE &&
      stored.locale === locale;
    if (!samePlace || stored.hours.length === 0) return null;
    return upcoming(stored.hours, tokyoStamp());
  } catch {
    return null;
  }
}

async function writeWeatherCookie(hours: StoredHour[], locale: Locale) {
  const stored: StoredWeather = {
    latitude: WEATHER_LATITUDE,
    longitude: WEATHER_LONGITUDE,
    locale,
    hours,
  };
  const value = encodeURIComponent(await compress(JSON.stringify(stored)));
  document.cookie = `${WEATHER_COOKIE}=${value}; expires=${endOfCourseDay(tokyoNow()).toUTCString()}; path=/; SameSite=Lax`;
}

async function fetchForecast(locale: Locale) {
  const url = new URL("https://api.weatherapi.com/v1/forecast.json");
  url.searchParams.set("key", weatherApiKey());
  url.searchParams.set("q", `${WEATHER_LATITUDE},${WEATHER_LONGITUDE}`);
  url.searchParams.set("days", "2");
  url.searchParams.set("lang", languageCode(locale));
  url.searchParams.set("aqi", "no");
  url.searchParams.set("alerts", "no");

  const response = await fetch(url);
  if (!response.ok) throw new Error(String(response.status));
  const body = (await response.json()) as ForecastResponse;
  const samples = body.forecast?.forecastday?.flatMap((day) => day.hour ?? []) ?? [];
  const stamp = tokyoStamp();
  const hours = samples.flatMap((sample) => {
    const hour = toHour(sample, stamp);
    return hour ? [hour] : [];
  });

  const current = body.current;
  if (current?.temp_c != null && current.condition?.text && current.condition.icon) {
    const match = hours.find((hour) => hour.time.startsWith(stamp));
    if (match) {
      match.temperature = current.temp_c;
      match.description = current.condition.text;
      match.icon = iconUrl(current.condition.icon);
      match.windSpeed = current.wind_kph == null ? match.windSpeed : current.wind_kph / 3.6;
      match.windDegrees = current.wind_degree ?? match.windDegrees;
      match.windCardinal =
        match.windDegrees == null ? null : cardinalFromDegrees(match.windDegrees);
    }
  }

  const weather = upcoming(hours, stamp);
  if (!weather) throw new Error("empty");

  try {
    await writeWeatherCookie(hours, locale);
  } catch {
    // 쿠키 저장이 실패해도 이번 화면에는 받아온 날씨를 보여 준다.
  }
  return weather;
}

let pending: Promise<TodayWeather> | null = null;
let pendingLocale: Locale | null = null;

export function loadTodayWeather(locale: Locale) {
  if (!pending || pendingLocale !== locale) {
    pendingLocale = locale;
    pending = readCachedWeather(locale)
      .then((cached) => cached ?? fetchForecast(locale))
      .finally(() => {
        pending = null;
        pendingLocale = null;
      });
  }
  return pending;
}
