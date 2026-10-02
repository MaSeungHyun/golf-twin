import { Link } from "react-router";
import Button from "../components/Button";
import { useTranslate } from "../i18n/store";
import { cn } from "../lib/style";
import { useCourseView } from "../Viewport/courseView";

export default function ClubHud() {
  const translate = useTranslate();
  const single = useCourseView((state) => state.mode === "single");

  return (
    <div
      className={cn(
        "absolute left-4 z-10 flex items-center gap-3",
        single ? "top-16" : "top-4",
      )}
    >
      <Button asChild size="sm" variant="outline">
        <Link to="/">{translate("nav.home")}</Link>
      </Button>
      <p className="text-sm text-white">{translate("club.title")}</p>
    </div>
  );
}
