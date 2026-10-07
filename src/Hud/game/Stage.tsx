import { useState } from "react";
import { caddieSelf } from "../../mock/caddie";
import { useCourseView } from "../../Viewport/courseView";
import CourseStatus from "../_components/CourseStatus";
import HoleLayout from "../_components/HoleLayout";
import HolePager from "../_components/HolePager";
import GameRail from "./Rail";
import ReportDialog from "./Report";

export default function GameStage() {
  const single = useCourseView((state) => state.mode === "single");
  const [reportOpen, setReportOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);

  return (
    <>
      {single || recordOpen ? (
        <HoleLayout
          score={
            recordOpen ? (
              <CourseStatus
                dock
                open
                onOpenChange={setRecordOpen}
                group={caddieSelf.group}
              />
            ) : null
          }
        />
      ) : null}
      <div
        className="mt-4 min-h-0 flex-1"
        style={{ alignItems: "safe center" }}
      />
      <div className="pointer-events-none absolute top-1/2 right-5 z-40 -translate-y-1/2">
        <div className="pointer-events-auto flex flex-col gap-2.5">
          <GameRail
            recordOpen={recordOpen}
            reportOpen={reportOpen}
            onToggleRecord={() => setRecordOpen((open) => !open)}
            onOpenReport={() => setReportOpen(true)}
          />
        </div>
      </div>
      {single || recordOpen ? (
        <div className="mt-4">
          <HolePager />
        </div>
      ) : null}
      <ReportDialog open={reportOpen} onOpenChange={setReportOpen} />
    </>
  );
}
