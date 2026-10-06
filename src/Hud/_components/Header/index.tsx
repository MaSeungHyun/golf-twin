import { Flag, Settings } from "lucide-react";
import { NavLink } from "react-router";
import Button from "../../../components/Button";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "../../../components/Dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import LanguageSwitch from "../../../i18n/LanguageSwitch";
import { useTranslate } from "../../../i18n/store";
import { cn } from "../../../lib/style";
import { holes } from "../../../mock/course";
import { restoreCourse, showCourseHole } from "../../../Viewport/Hole";
import { useCourseView } from "../../../Viewport/courseView";
import HoleInformation, { holeLabel } from "../HoleInformation";
import Weather from "./Weather";

export default function Header() {
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
    <>
      <div className="absolute top-5 left-5 flex flex-col items-start gap-4">
        <div className="glass pointer-events-auto flex h-12 items-center rounded-full border border-white/10 p-1 backdrop-blur-md">
          <NavLink
            to="/club"
            className={({ isActive }) =>
              cn(
                "inline-flex h-10 items-center rounded-full px-4 text-md",
                isActive
                  ? "bg-[#143528] text-[#5dffb1] shadow-[inset_0_0_0_1px_rgba(93,255,177,0.45)]"
                  : "text-white/75",
              )
            }
          >
            {translate("home.club")}
          </NavLink>
          <NavLink
            to="/game"
            className={({ isActive }) =>
              cn(
                "inline-flex h-10 items-center rounded-full px-4 text-md",
                isActive
                  ? "bg-[#143528] text-[#5dffb1] shadow-[inset_0_0_0_1px_rgba(93,255,177,0.45)]"
                  : "text-white/75",
              )
            }
          >
            {translate("home.game")}
          </NavLink>
        </div>
        <HoleInformation />
      </div>

      <div className="pointer-events-auto absolute top-5 left-1/2 -translate-x-1/2">
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

      <div className="pointer-events-auto absolute top-5 right-5 flex items-center gap-3">
        <Weather />
        <Dropdown>
          <DropdownTrigger asChild>
            <Button
              variant="outline"
              icon={<Settings className="size-5" />}
              aria-label={translate("hud.settings")}
              className="size-12 rounded-full p-0 backdrop-blur-md"
            />
          </DropdownTrigger>
          <DropdownContent align="end">
            <LanguageSwitch />
          </DropdownContent>
        </Dropdown>
      </div>
    </>
  );
}
