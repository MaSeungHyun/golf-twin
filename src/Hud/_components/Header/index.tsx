import { NavLink } from "react-router";
import { useTranslate } from "../../../i18n/store";
import { cn } from "../../../lib/style";
import HoleSelect from "./HoleSelect";
import LanguageSwitch from "./LanguageSwitch";
import Weather from "./Weather";

export default function Header() {
  const translate = useTranslate();

  return (
    <div className="flex items-start gap-4">
      <div className="flex min-w-0 flex-1 flex-col items-start">
        <div className="glass pointer-events-auto flex h-12 items-center rounded-full border border-white/10 p-1 backdrop-blur-md">
          <NavLink
            to="/club"
            className={({ isActive }) =>
              cn(
                "inline-flex h-10 items-center rounded-full px-4 text-md",
                isActive
                  ? "bg-[#143528] text-accent shadow-[inset_0_0_0_1px_rgba(93,255,177,0.45)]"
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
      </div>

      <HoleSelect />

      <div className="pointer-events-auto flex min-w-0 flex-1 items-start justify-end gap-3">
        <Weather />
        <LanguageSwitch />
      </div>
    </div>
  );
}
