import { Link } from "react-router";
import Button from "../components/Button";
import { useTranslate } from "../i18n/store";

export default function HomeHud() {
  const translate = useTranslate();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-4">
      <Button asChild className="pointer-events-auto">
        <Link to="/club">{translate("home.club")}</Link>
      </Button>
      <Button asChild variant="outline" className="pointer-events-auto">
        <Link to="/game">{translate("home.game")}</Link>
      </Button>
    </div>
  );
}
