import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import Button from "../../components/Button";
import { useTranslate } from "../../i18n/store";
import { holes } from "../../mock/course";
import { showCourseHole } from "../../Viewport/Hole";
import { useCourseView } from "../../Viewport/courseView";

function holeAt(hole: number, step: number) {
  const index = holes.findIndex((item) => item.number === hole);
  return holes[index + step];
}

export default function HolePager({ children }: { children?: ReactNode }) {
  const hole = useCourseView((state) => state.hole);
  const single = useCourseView((state) => state.mode === "single");
  const translate = useTranslate();
  const previous = holeAt(hole, -1);
  const next = holeAt(hole, 1);

  return (
    <div className="flex items-end gap-4">
      <div className="shrink-0">
        {single ? (
          <Button
            size="sm"
            variant="outline"
            disabled={!previous}
            onClick={() => previous && showCourseHole(previous.number)}
            icon={<ChevronLeft className="size-5" />}
            className="pointer-events-auto gap-1.5"
          >
            {translate("hud.previousHole")}
          </Button>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 justify-center">{children}</div>
      <div className="shrink-0">
        {single ? (
          <Button
            size="sm"
            variant="outline"
            disabled={!next}
            onClick={() => next && showCourseHole(next.number)}
            className="pointer-events-auto gap-1.5"
          >
            {translate("hud.nextHole")}
            <ChevronRight className="size-5" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
