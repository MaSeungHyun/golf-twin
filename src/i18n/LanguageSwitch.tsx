import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Select";
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
    <Select
      value={locale}
      onValueChange={(value) => {
        if (isLocale(value)) setLocale(value);
      }}
    >
      <SelectTrigger className="absolute top-4 right-4 z-10 w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((item) => (
          <SelectItem key={item} value={item}>
            {translate(localeKey[item])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
