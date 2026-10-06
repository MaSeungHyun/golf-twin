import { House, RotateCcw } from "lucide-react";
import Button from "../../components/Button";
import { useLocale, useTranslate } from "../../i18n/store";
import { resetCamera, restoreCourse } from "../../Viewport/Hole";
import { useCourseView } from "../../Viewport/courseView";

export default function ViewRail() {
  const single = useCourseView((state) => state.mode === "single");
  const locale = useLocale((state) => state.locale);
  const translate = useTranslate();

  return (
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
        icon={<RotateCcw className="size-6" />}
        onClick={resetCamera}
      >
        <span
          className={
            locale === "jp" ? "whitespace-nowrap text-[11px]" : undefined
          }
        >
          {translate("hud.resetCamera")}
        </span>
      </Button>
    </div>
  );
}
