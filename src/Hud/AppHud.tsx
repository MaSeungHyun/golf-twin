import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Flag,
  House,
  Activity,
  Inbox,
  MapPin,
  RotateCcw,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "../components/Dropdown";
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
import { resetCamera, restoreCourse, showCourseHole } from "../Viewport/Hole";
import { useCourseView } from "../Viewport/courseView";
import Button from "../components/Button";
import Indicator from "../components/Indicator";
import { caddieSelf } from "../mock/caddie";
import { useReports } from "../report/store";
import ReportDialog from "./ReportDialog";
import ReportHistory from "./ReportHistory";
import ScoreSheet from "./ScoreSheet";
import WeatherMenu from "./WeatherMenu";
import { findHole, holeName, holes, tee, type HoleInfo } from "../mock/course";

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
  if (hole.elevation > 0)
    status.push(`${translate("hud.uphill")} ${hole.elevation}m`);
  if (hole.elevation < 0)
    status.push(`${translate("hud.downhill")} ${Math.abs(hole.elevation)}m`);

  return status.join(" · ");
}

export default function AppHud() {
  const mode = useCourseView((state) => state.mode);
  const hole = useCourseView((state) => state.hole);
  const locale = useLocale((state) => state.locale);
  const translate = useTranslate();
  const location = useLocation();
  const single = mode === "single";
  const game = location.pathname.startsWith("/game");

  const showHole = (value: string) => {
    if (value === "all") {
      restoreCourse();
      return;
    }
    showCourseHole(Number(value));
  };
  const current = findHole(hole);
  const previous = holeAt(hole, -1);
  const next = holeAt(hole, 1);
  const keyboardInset = useKeyboardInset();
  const bottom = `calc(1.25rem + env(safe-area-inset-bottom, 0px) + ${keyboardInset}px)`;
  const [reportOpen, setReportOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const reportCount = useReports((state) => state.reports.length);

  useEffect(() => {
    if (game) setHistoryOpen(false);
    else {
      setReportOpen(false);
      setScoreOpen(false);
    }
  }, [game]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 text-white">
      <div className="pointer-events-auto absolute top-5 left-5 flex items-center gap-3">
        {/* <Button
          variant="outline"
          onClick={restoreCourse}
          icon={<ArrowLeft className="size-5" />}
          className="h-12 gap-1.5 rounded-full px-4 backdrop-blur-md"
        >
          {translate("nav.back")}
        </Button> */}
        <div className="glass flex h-12 items-center rounded-full border border-white/10 p-1 backdrop-blur-md">
          <NavLink
            to="/club"
            className={({ isActive }) =>
              cn(
                "inline-flex h-10 items-center rounded-full px-4 text-md",
                isActive
                  ? "bg-[#143528] text-[#5dffb1] shadow-[inset_0_0_0_1px_rgba(93,255,177,0.45)]"
                  : "text-white/75",
              )
            }
          >
            {translate("home.club")}
          </NavLink>
          <NavLink
            to="/game"
            className={({ isActive }) =>
              cn(
                "inline-flex h-10 items-center rounded-full px-4 text-md",
                isActive
                  ? "bg-[#143528] text-[#5dffb1] shadow-[inset_0_0_0_1px_rgba(93,255,177,0.45)]"
                  : "text-white/75",
              )
            }
          >
            {translate("home.game")}
          </NavLink>
        </div>
      </div>

      <div className="pointer-events-auto absolute top-5 left-1/2 -translate-x-1/2">
        <Select value={single ? String(hole) : "all"} onValueChange={showHole}>
          <SelectTrigger className="h-12 min-w-40 rounded-full border-[#3ddc97]/35 px-4 text-md backdrop-blur-md">
            <Flag className="size-5 text-[#3ddc97]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{translate("hud.overview")}</SelectItem>
            {holes.map((item) => (
              <SelectItem key={item.number} value={String(item.number)}>
                {holeLabel(item.number)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pointer-events-auto absolute top-5 right-5 flex items-center gap-3">
        <WeatherMenu />
        <Dropdown>
          <DropdownTrigger asChild>
            <Button
              variant="outline"
              icon={<Settings className="size-5" />}
              aria-label={translate("hud.settings")}
              className="size-12 rounded-full p-0 backdrop-blur-md"
            />
          </DropdownTrigger>
          <DropdownContent align="end">
            <LanguageSwitch />
          </DropdownContent>
        </Dropdown>
      </div>

      <div className="pointer-events-auto absolute top-1/2 left-5 flex -translate-y-1/2 flex-col gap-2.5">
        <Button
          size="rail"
          variant="outline"
          active={!single}
          icon={<House className="size-6" />}
          onClick={restoreCourse}
        >
          {translate("hud.overview")}
        </Button>
        <Button
          size="rail"
          variant="outline"
          active={single}
          disabled={!single}
          icon={<Flag className="size-6" />}
        >
          {translate("hud.currentHole")}
        </Button>

        <Button
          size="rail"
          variant="outline"
          icon={<RotateCcw className="size-6" />}
          onClick={resetCamera}
        >
          {translate("hud.resetCamera")}
        </Button>
      </div>

      <div className="pointer-events-auto absolute top-1/2 right-5 flex -translate-y-1/2 flex-col gap-2.5">
        {game && single && hole !== caddieSelf.hole ? (
          <Button
            size="rail"
            variant="outline"
            icon={<MapPin className="size-6" />}
            onClick={() => showCourseHole(caddieSelf.hole)}
          >
            {translate("caddie.return")}
          </Button>
        ) : null}
        {game ? (
          <>
            <Button
              size="rail"
              variant="outline"
              active={scoreOpen}
              icon={<ClipboardList className="size-6" />}
              onClick={() => setScoreOpen((open) => !open)}
            >
              {translate("hud.scoreManage")}
            </Button>
            <Button
              size="rail"
              variant="outline"
              active={reportOpen}
              icon={<TriangleAlert className="size-6" />}
              onClick={() => setReportOpen(true)}
            >
              {translate("hud.reportSituation")}
            </Button>
          </>
        ) : (
          <>
            <Button
              size="rail"
              variant="outline"
              icon={<Activity className="size-6" />}
            >
              {translate("hud.courseStatus")}
            </Button>
            <Button
              size="rail"
              variant="outline"
              active={historyOpen}
              className="relative"
              icon={<Inbox className="size-6" />}
              onClick={() => setHistoryOpen((open) => !open)}
            >
              {translate("hud.reportHistory")}
              {reportCount > 0 ? (
                <span className="absolute top-2 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff5d6c] px-1 text-xs leading-none text-white">
                  {reportCount}
                </span>
              ) : null}
            </Button>
          </>
        )}
      </div>

      {single ? (
        <div
          className="pointer-events-none absolute left-1/2 w-96 lg:w-104 -translate-x-1/2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md"
          style={{ bottom }}
        >
          {/* <p className="text-md tracking-wide text-accent font-bold">
            {translate("hud.currentHole")}
          </p> */}
          <div className="flex items-center justify-between gap-4 font-bold">
            <p className="inline-flex items-center gap-2 text-md">
              <Flag className="size-5 text-accent" />
              {holeLabel(current.number)}
            </p>
            <p className="truncate text-md text-white/80">
              {holeName(current, locale)}
            </p>
          </div>
          <div className="mt-4">
            <TeeIndicators hole={current} />
            <div className="mt-2 flex items-center gap-6 text-sm text-white/70">
              <span>PAR {current.par}</span>
              <span>HDCP {current.handicap}</span>
            </div>
            <p className="mt-5 text-sm leading-snug text-white/50">
              {holeStatus(current, translate)}
            </p>
          </div>
        </div>
      ) : null}

      {game ? (
        <ReportDialog open={reportOpen} onOpenChange={setReportOpen} />
      ) : null}

      {game && scoreOpen ? (
        <ScoreSheet onClose={() => setScoreOpen(false)} />
      ) : null}

      {!game && historyOpen ? (
        <ReportHistory onClose={() => setHistoryOpen(false)} />
      ) : null}

      {single ? (
        <div className="pointer-events-auto absolute left-5" style={{ bottom }}>
          <Button
            size="sm"
            variant="outline"
            disabled={!previous}
            onClick={() => previous && showHole(String(previous.number))}
            icon={<ChevronLeft className="size-5" />}
            className="gap-1.5"
          >
            {translate("hud.previousHole")}
          </Button>
        </div>
      ) : null}

      {single ? (
        <div
          className="pointer-events-auto absolute right-5"
          style={{ bottom }}
        >
          <Button
            size="sm"
            variant="outline"
            disabled={!next}
            onClick={() => next && showHole(String(next.number))}
            className="gap-1.5"
          >
            {translate("hud.nextHole")}
            <ChevronRight className="size-5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function TeeIndicators({ hole }: { hole: HoleInfo }) {
  return (
    <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
      <Indicator color="blue">{tee(hole, "blue").yards}</Indicator>
      <Indicator color="white">{tee(hole, "white").yards}</Indicator>
      <Indicator color="red">{tee(hole, "red").yards}</Indicator>
    </div>
  );
}
