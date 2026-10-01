import { Link } from "react-router";
import Button from "../components/Button";
import { useTranslate } from "../i18n/store";

export default function ClubHud() {
  const translate = useTranslate();

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
      <Button asChild size="sm" variant="outline">
        <Link to="/">{translate("nav.home")}</Link>
      </Button>
      <p className="text-sm text-white">{translate("club.title")}</p>
    </div>
  );
}
