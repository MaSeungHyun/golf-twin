import { MapPin, Rows3, TriangleAlert } from "lucide-react";
import Button from "../../components/Button";
import { useTranslate } from "../../i18n/store";
import { caddieSelf } from "../../mock/caddie";
import { showCourseHole } from "../../Viewport/Hole";
import { useCourseView } from "../../Viewport/courseView";

export default function GameRail({
  recordOpen,
  reportOpen,
  onToggleRecord,
  onOpenReport,
}: {
  recordOpen: boolean;
  reportOpen: boolean;
  onToggleRecord: () => void;
  onOpenReport: () => void;
}) {
  const hole = useCourseView((state) => state.hole);
  const single = useCourseView((state) => state.mode === "single");
  const translate = useTranslate();

  return (
    <>
      {single && hole !== caddieSelf.hole ? (
        <Button
          size="rail"
          variant="outline"
          icon={<MapPin className="size-6" />}
          onClick={() => showCourseHole(caddieSelf.hole)}
        >
          {translate("caddie.return")}
        </Button>
      ) : null}
      <Button
        size="rail"
        variant="outline"
        active={recordOpen}
        icon={<Rows3 className="size-6" />}
        onClick={onToggleRecord}
      >
        {translate("hud.scoreManage")}
      </Button>
      <Button
        size="rail"
        variant="outline"
        active={reportOpen}
        icon={<TriangleAlert className="size-6" />}
        onClick={onOpenReport}
      >
        {translate("hud.reportSituation")}
      </Button>
    </>
  );
}
