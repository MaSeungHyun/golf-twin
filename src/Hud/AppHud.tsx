import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { caddieSelf } from "../mock/caddie";
import { useReports } from "../report/store";
import CourseStatus from "./_components/CourseStatus";
import Header from "./_components/Header";
import HolePager from "./_components/HolePager";
import ViewRail from "./_components/ViewRail";
import ClubRail from "./club/Rail";
import MachineDesk from "./club/MachineDesk";
import ReportHistory from "./club/ReportHistory";
import GameRail from "./game/Rail";
import ReportDialog from "./game/Report";

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

export default function AppHud() {
  const location = useLocation();
  const game = location.pathname.startsWith("/game");
  const keyboardInset = useKeyboardInset();
  const bottom = `calc(1.25rem + env(safe-area-inset-bottom, 0px) + ${keyboardInset}px)`;
  const [reportOpen, setReportOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [machineOpen, setMachineOpen] = useState(false);
  const reportCount = useReports(
    (state) =>
      state.reports.filter((report) => report.resolvedAt == null).length,
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 text-white">
      <Header />
      <ViewRail />

      <div className="pointer-events-auto absolute top-1/2 right-5 flex -translate-y-1/2 flex-col gap-2.5">
        {game ? (
          <GameRail
            recordOpen={recordOpen}
            reportOpen={reportOpen}
            onToggleRecord={() => setRecordOpen((open) => !open)}
            onOpenReport={() => setReportOpen(true)}
          />
        ) : (
          <ClubRail
            courseOpen={courseOpen}
            historyOpen={historyOpen}
            machineOpen={machineOpen}
            reportCount={reportCount}
            onOpenCourse={() => {
              setCourseOpen(true);
              setHistoryOpen(false);
              setMachineOpen(false);
            }}
            onToggleHistory={() => {
              setHistoryOpen((open) => !open);
              setCourseOpen(false);
              setMachineOpen(false);
            }}
            onToggleMachines={() => {
              setMachineOpen((open) => !open);
              setHistoryOpen(false);
              setCourseOpen(false);
            }}
          />
        )}
      </div>

      {game && recordOpen ? (
        <div
          className="pointer-events-none absolute inset-x-0 z-20 flex justify-center"
          style={{ bottom }}
        >
          <CourseStatus
            dock
            open
            onOpenChange={setRecordOpen}
            group={caddieSelf.group}
          />
        </div>
      ) : null}

      {game ? (
        <ReportDialog open={reportOpen} onOpenChange={setReportOpen} />
      ) : null}

      {!game ? (
        <CourseStatus open={courseOpen} onOpenChange={setCourseOpen} />
      ) : null}

      {!game && historyOpen ? (
        <ReportHistory onClose={() => setHistoryOpen(false)} />
      ) : null}

      {!game && machineOpen ? (
        <MachineDesk onClose={() => setMachineOpen(false)} />
      ) : null}

      <HolePager bottom={bottom} />
    </div>
  );
}
