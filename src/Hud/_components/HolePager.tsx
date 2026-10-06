import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../components/Button";
import { useTranslate } from "../../i18n/store";
import { holes } from "../../mock/course";
import { showCourseHole } from "../../Viewport/Hole";
import { useCourseView } from "../../Viewport/courseView";

function holeAt(hole: number, step: number) {
  const index = holes.findIndex((item) => item.number === hole);
  return holes[index + step];
}

export default function HolePager({ bottom }: { bottom: string }) {
  const hole = useCourseView((state) => state.hole);
  const single = useCourseView((state) => state.mode === "single");
  const translate = useTranslate();

  if (!single) return null;

  const previous = holeAt(hole, -1);
  const next = holeAt(hole, 1);

  return (
    <>
      <div className="pointer-events-auto absolute left-5" style={{ bottom }}>
        <Button
          size="sm"
          variant="outline"
          disabled={!previous}
          onClick={() => previous && showCourseHole(previous.number)}
          icon={<ChevronLeft className="size-5" />}
          className="gap-1.5"
        >
          {translate("hud.previousHole")}
        </Button>
      </div>
      <div className="pointer-events-auto absolute right-5" style={{ bottom }}>
        <Button
          size="sm"
          variant="outline"
          disabled={!next}
          onClick={() => next && showCourseHole(next.number)}
          className="gap-1.5"
        >
          {translate("hud.nextHole")}
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </>
  );
}
