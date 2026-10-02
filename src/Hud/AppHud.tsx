import {
  ArrowLeft,
  Ellipsis,
  Flag,
  House,
  MapPin,
  Pencil,
  RotateCcw,
  Settings,
  Sun,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import LanguageSwitch from "../i18n/LanguageSwitch";
import type { MessageKey } from "../i18n/messages";
import { useLocale, useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import { restoreCourse, showCourseHole } from "../Viewport/Hole";
import { useCourseView } from "../Viewport/courseView";
import Button from "../components/Button";
import {
  findHole,
  holeName,
  holes,
  regularTee,
  type HoleInfo,
} from "../mock/course";

function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const covered = window.innerHeight - viewport.offsetTop - viewport.height;
      setInset(covered > 120 ? covered : 0);
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}

function holeLabel(hole: number) {
  return `HOLE ${String(hole).padStart(2, "0")}`;
}

function holeAt(hole: number, step: number) {
  const index = holes.findIndex((item) => item.number === hole);
  return holes[index + step];
}

const doglegKey = {
  straight: "hud.dogleg.straight",
  left: "hud.dogleg.left",
  right: "hud.dogleg.right",
} as const satisfies Record<HoleInfo["dogleg"], MessageKey>;

function holeStatus(hole: HoleInfo, translate: (key: MessageKey) => string) {
  const status = [translate(doglegKey[hole.dogleg])];

  if (hole.water) status.push(translate("hud.water"));
  if (hole.bunkers) status.push(`${translate("hud.bunker")} ${hole.bunkers}`);
  if (hole.elevation > 0) status.push(`${translate("hud.uphill")} ${hole.elevation}m`);
  if (hole.elevation < 0) status.push(`${translate("hud.downhill")} ${Math.abs(hole.elevation)}m`);

  return status.join(" · ");
}

export default function AppHud() {
  const mode = useCourseView((state) => state.mode);
  const hole = useCourseView((state) => state.hole);
  const locale = useLocale((state) => state.locale);
  const translate = useTranslate();
  const single = mode === "single";

  const showHole = (next: number) => showCourseHole(next);
  const current = findHole(hole);
  const tee = regularTee(current);
  const next = holeAt(hole, 1);
  const keyboardInset = useKeyboardInset();
  const bottom = `calc(1.25rem + env(safe-area-inset-bottom, 0px) + ${keyboardInset}px)`;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 text-white">
      <div className="pointer-events-auto absolute top-5 left-5 flex items-center gap-3">
        <Button
          variant="outline"
          onClick={restoreCourse}
          icon={<ArrowLeft className="size-4" />}
          className="h-11 gap-1.5 rounded-full px-4 backdrop-blur-md"
        >
          {translate("nav.back")}
        </Button>
        <div className="flex h-11 items-center rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur-md">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "inline-flex h-9 items-center rounded-full px-4 text-sm",
                isActive
                  ? "bg-[#143528] text-[#5dffb1] shadow-[inset_0_0_0_1px_rgba(93,255,177,0.45)]"
                  : "text-white/75",
              )
            }
          >
            {translate("nav.home")}
          </NavLink>
          <NavLink
            to="/club"
            className={({ isActive }) =>
              cn(
                "inline-flex h-9 items-center rounded-full px-4 text-sm",
                isActive
                  ? "bg-[#143528] text-[#5dffb1] shadow-[inset_0_0_0_1px_rgba(93,255,177,0.45)]"
                  : "text-white/75",
              )
            }
          >
            {translate("home.club")}
          </NavLink>
        </div>
      </div>

      <div className="pointer-events-auto absolute top-5 left-1/2 -translate-x-1/2">
        <Select
          value={String(hole)}
          onValueChange={(value) => showHole(Number(value))}
        >
          <SelectTrigger className="h-11 min-w-40 rounded-full border-[#3ddc97]/35 bg-white/10 px-4 text-sm backdrop-blur-md">
            <Flag className="size-4 text-[#3ddc97]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {holes.map((item) => (
              <SelectItem key={item.number} value={String(item.number)}>
                {holeLabel(item.number)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pointer-events-auto absolute top-5 right-5 flex items-center gap-3">
        <div className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-sm backdrop-blur-md">
          <Sun className="size-4 text-amber-300" />
          {translate("hud.weather")}
        </div>
        <LanguageSwitch className="w-28" />
        <Button
          variant="outline"
          icon={<Settings className="size-4" />}
          aria-label="settings"
          className="size-11 rounded-full p-0 backdrop-blur-md"
        />
      </div>

      <div className="pointer-events-auto absolute top-1/2 left-5 flex -translate-y-1/2 flex-col gap-2.5">
        <Button
          size="rail"
          variant="outline"
          active={!single}
          icon={<House className="size-5" />}
          onClick={restoreCourse}
        >
          {translate("hud.overview")}
        </Button>
        <Button
          size="rail"
          variant="outline"
          active={single}
          disabled={!single}
          icon={<Flag className="size-5" />}
        >
          {translate("hud.currentHole")}
        </Button>

        <Button
          size="rail"
          variant="outline"
          icon={<RotateCcw className="size-5" />}
        >
          {translate("hud.resetCamera")}
        </Button>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 w-96 -translate-x-1/2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md"
        style={{ bottom }}
      >
        <p className="text-[11px] tracking-wide text-[#5dffb1]">
          {translate(next ? "hud.nextHole" : "hud.lastHole")}
        </p>
        {next ? (
          <>
            <div className="mt-1 flex items-baseline justify-between gap-4">
              <p className="text-sm">{holeLabel(next.number)}</p>
              <p className="truncate text-sm text-white/80">{holeName(next, locale)}</p>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/70">
              <span>PAR {next.par}</span>
              <span>HDCP {next.handicap}</span>
              <span>{regularTee(next).yards} yd</span>
            </div>
            <p className="mt-1 text-xs leading-snug text-white/50">{holeStatus(next, translate)}</p>
          </>
        ) : null}
      </div>

      <div className="pointer-events-auto absolute right-5 flex flex-col items-end gap-3" style={{ bottom }}>
        <div className="w-60 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2">
              <Flag className="size-4 text-[#3ddc97]" />
              {holeLabel(current.number)}
            </span>
            <span className="text-white/80">{tee.yards} yd</span>
          </div>
          <p className="mt-2 truncate text-sm text-white/60">{holeName(current, locale)}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-white/70">
            <span>PAR {current.par}</span>
            <span>HDCP {current.handicap}</span>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs text-white/80"
            >
              {translate("hud.more")}
            </Button>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <CircleButton
            icon={<MapPin className="size-5" />}
            label={translate("hud.poi")}
          />
          <CircleButton
            icon={<Pencil className="size-5" />}
            label={translate("hud.measure")}
          />
          <CircleButton icon={<Ellipsis className="size-5" />} />
        </div>
      </div>
    </div>
  );
}

function CircleButton({ icon, label }: { icon: ReactNode; label?: string }) {
  return (
    <Button
      variant="ghost"
      className="h-auto flex-col gap-1.5 rounded-none px-0 text-[11px] text-white/75 hover:bg-transparent"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-md">
        {icon}
      </span>
      {label}
    </Button>
  );
}
