import { create } from "zustand";
import { messages, type Locale, type MessageKey } from "./messages";

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocale = create<LocaleState>((set) => ({
  locale: "ko",
  setLocale: (locale) => set({ locale }),
}));

export function useTranslate() {
  const locale = useLocale((state) => state.locale);

  return (key: MessageKey) => messages[locale][key];
}
