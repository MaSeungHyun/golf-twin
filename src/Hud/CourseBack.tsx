import Button from "../components/Button";
import { useTranslate } from "../i18n/store";
import { restoreCourse } from "../Viewport/Hole";
import { useCourseView } from "../Viewport/courseView";

export default function CourseBack() {
  const mode = useCourseView((state) => state.mode);
  const translate = useTranslate();

  if (mode !== "single") return null;

  return (
    <div className="absolute top-4 left-4 z-20">
      <Button size="sm" variant="outline" onClick={restoreCourse}>
        {translate("nav.back")}
      </Button>
    </div>
  );
}
