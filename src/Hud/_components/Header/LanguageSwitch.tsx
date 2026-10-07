import { Settings } from "lucide-react";
import Button from "../../../components/Button";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "../../../components/Dropdown";
import LocaleSwitch from "../../../i18n/LanguageSwitch";
import { useTranslate } from "../../../i18n/store";

export default function LanguageSwitch() {
  const translate = useTranslate();

  return (
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
        <LocaleSwitch />
      </DropdownContent>
    </Dropdown>
  );
}
