import { useEffect } from "react";
import {
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
} from "../components/Dropdown";
import { locales, type Locale, type MessageKey } from "./messages";
import { useLocale, useTranslate } from "./store";

const localeKey = {
  ko: "language.ko",
  jp: "language.jp",
} as const satisfies Record<Locale, MessageKey>;

function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export default function LanguageSwitch() {
  const locale = useLocale((state) => state.locale);
  const setLocale = useLocale((state) => state.setLocale);
  const translate = useTranslate();

  useEffect(() => {
    document.documentElement.lang = locale === "jp" ? "ja" : "ko";
  }, [locale]);

  return (
    <DropdownSub>
      <DropdownSubTrigger chevron="left">
        {translate("language.label")}
      </DropdownSubTrigger>
      <DropdownSubContent>
        <DropdownRadioGroup
          value={locale}
          onValueChange={(value) => {
            if (isLocale(value)) setLocale(value);
          }}
        >
          {locales.map((item) => (
            <DropdownRadioItem key={item} value={item}>
              {translate(localeKey[item])}
            </DropdownRadioItem>
          ))}
        </DropdownRadioGroup>
      </DropdownSubContent>
    </DropdownSub>
  );
}
