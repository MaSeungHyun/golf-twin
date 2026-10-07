import { Flag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import { useTranslate } from "../../../i18n/store";
import { holes } from "../../../mock/course";
import { restoreCourse, showCourseHole } from "../../../Viewport/Hole";
import { useCourseView } from "../../../Viewport/courseView";
import { holeLabel } from "../HoleInformation";

export default function HoleSelect() {
  const mode = useCourseView((state) => state.mode);
  const hole = useCourseView((state) => state.hole);
  const translate = useTranslate();
  const single = mode === "single";

  const showHole = (value: string) => {
    if (value === "all") {
      restoreCourse();
      return;
    }
    showCourseHole(Number(value));
  };

  return (
    <div className="pointer-events-auto shrink-0">
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
  );
}
