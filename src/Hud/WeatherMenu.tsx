import { Sun, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Panel from "../components/Panel";
import type { MessageKey } from "../i18n/messages";
import { useLocale, useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import {
  loadTodayWeather,
  type TodayWeather,
  type WindCardinal,
} from "../weather/googleWeather";

const windKey = {
  NORTH: "hud.wind.NORTH",
  NORTH_NORTHEAST: "hud.wind.NORTH_NORTHEAST",
  NORTHEAST: "hud.wind.NORTHEAST",
  EAST_NORTHEAST: "hud.wind.EAST_NORTHEAST",
  EAST: "hud.wind.EAST",
  EAST_SOUTHEAST: "hud.wind.EAST_SOUTHEAST",
  SOUTHEAST: "hud.wind.SOUTHEAST",
  SOUTH_SOUTHEAST: "hud.wind.SOUTH_SOUTHEAST",
  SOUTH: "hud.wind.SOUTH",
  SOUTH_SOUTHWEST: "hud.wind.SOUTH_SOUTHWEST",
  SOUTHWEST: "hud.wind.SOUTHWEST",
  WEST_SOUTHWEST: "hud.wind.WEST_SOUTHWEST",
  WEST: "hud.wind.WEST",
  WEST_NORTHWEST: "hud.wind.WEST_NORTHWEST",
  NORTHWEST: "hud.wind.NORTHWEST",
  NORTH_NORTHWEST: "hud.wind.NORTH_NORTHWEST",
} as const satisfies Record<WindCardinal, MessageKey>;

export default function WeatherMenu() {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState<TodayWeather | null>(null);
  const [failed, setFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    loadTodayWeather(useLocale.getState().locale).then(
      (next) => {
        if (!cancelled) setWeather(next);
      },
      () => {
        if (!cancelled) setFailed(true);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", onKey);
    const list = rootRef.current?.querySelector<HTMLElement>(
      "[data-weather-list]",
    );
    const row = list?.querySelector<HTMLElement>("[data-current='true']");
    if (list && row) {
      const rowTop =
        row.getBoundingClientRect().top -
        list.getBoundingClientRect().top +
        list.scrollTop;
      list.scrollTop = rowTop - list.clientHeight / 2 + row.clientHeight / 2;
    }

    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, weather]);

  const current = weather?.current;
  const label = current
    ? `${current.description} / ${Math.round(current.temperature)}°C`
    : translate(failed ? "hud.weather.error" : "hud.weather");
  const wind =
    current?.windSpeed != null
      ? `${Math.round(current.windSpeed)} km/h${
          current.windCardinal
            ? ` · ${translate(windKey[current.windCardinal])}`
            : ""
        }`
      : null;

  return (
    <div className="flex items-center gap-3">
      <div ref={rootRef} className="relative">
        <Button
          variant="outline"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          icon={
            current ? (
              <img src={current.icon} alt="" className="size-5" />
            ) : (
              <Sun className="size-5 text-amber-300" />
            )
          }
          className="h-12 gap-2 rounded-full px-5 backdrop-blur-md"
        >
          {label}
        </Button>
        {open ? (
          <Panel className="absolute top-full right-0 z-30 mt-2 flex max-h-80 w-72 flex-col p-2">
            <p className="shrink-0 px-2 py-1.5 text-md font-bold tracking-wide text-accent">
              {translate("hud.weather.today")} ·{" "}
              {translate("hud.weather.place")}
            </p>
            {failed ? (
              <p className="px-2 py-3 text-md text-white/70">
                {translate("hud.weather.error")}
              </p>
            ) : (
              <div
                data-weather-list
                className="scroll-thumb min-h-0 overflow-y-auto mt-2"
              >
                {weather?.hours.map((hour) => (
                  <div
                    key={hour.label}
                    data-current={hour.current ? "true" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-2 py-1.5 text-md",
                      hour.current && "bg-[#143528] text-[#5dffb1]",
                    )}
                  >
                    <span className="w-12 shrink-0 tabular-nums text-white/60">
                      {hour.label}
                    </span>
                    <img src={hour.icon} alt="" className="size-5 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">
                      {hour.description}
                    </span>
                    {hour.precipitation > 0 ? (
                      <span className="shrink-0 text-sm text-sky-200">
                        {hour.precipitation}%
                      </span>
                    ) : null}
                    <span className="w-10 shrink-0 text-right tabular-nums">
                      {Math.round(hour.temperature)}°
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        ) : null}
      </div>
      {wind ? (
        <Button
          variant="outline"
          icon={<Wind className="size-5" />}
          className="h-12 gap-2 rounded-full px-5 backdrop-blur-md"
        >
          {wind}
        </Button>
      ) : null}
    </div>
  );
}
