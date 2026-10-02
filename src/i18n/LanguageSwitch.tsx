import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Select";
import { locales, type Locale, type MessageKey } from "./messages";
import { cn } from "../lib/style";
import { useLocale, useTranslate } from "./store";

const localeKey = {
  ko: "language.ko",
  jp: "language.jp",
} as const satisfies Record<Locale, MessageKey>;

function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export default function LanguageSwitch({ className }: { className?: string }) {
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
      <SelectTrigger
        className={cn(
          "h-11 rounded-full border-white/10 bg-white/10 px-4 text-white/90 backdrop-blur-md",
          className,
        )}
      >
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
