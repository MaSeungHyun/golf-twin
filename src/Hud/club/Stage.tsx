import { useState } from "react";
import { useReports } from "../../report/store";
import { useCourseView } from "../../Viewport/courseView";
import CourseStatus from "../_components/CourseStatus";
import HoleLayout from "../_components/HoleLayout";
import HolePager from "../_components/HolePager";
import ClubRail from "./Rail";
import MachineDesk from "./MachineDesk";
import ReportHistory from "./ReportHistory";

export default function ClubStage() {
  const single = useCourseView((state) => state.mode === "single");
  const [courseOpen, setCourseOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [machineOpen, setMachineOpen] = useState(false);
  const reportCount = useReports(
    (state) =>
      state.reports.filter((report) => report.resolvedAt == null).length,
  );

  return (
    <>
      {single ? <HoleLayout /> : null}
      <div
        className="mt-4 flex min-h-0 flex-1 px-36"
        style={{ alignItems: "safe center" }}
      >
        <div className="flex h-full min-h-0 min-w-0 flex-1 items-center justify-end">
          {historyOpen ? (
            <ReportHistory onClose={() => setHistoryOpen(false)} />
          ) : null}
          {machineOpen ? (
            <MachineDesk onClose={() => setMachineOpen(false)} />
          ) : null}
        </div>
      </div>
      <div className="pointer-events-none absolute top-1/2 right-5 z-40 -translate-y-1/2">
        <div className="pointer-events-auto flex flex-col gap-2.5">
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
        </div>
      </div>
      {single ? (
        <div className="mt-4">
          <HolePager />
        </div>
      ) : null}
      <CourseStatus open={courseOpen} onOpenChange={setCourseOpen} />
    </>
  );
}
