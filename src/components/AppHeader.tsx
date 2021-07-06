import { FunctionalComponent, h } from "preact";
import useTranslation from "../hooks/useTranslation";

export const AppHeader: FunctionalComponent = () => {
  const { t } = useTranslation();
  return (
    <header className="flex-none text-white relative z-10 flex flex-col items-start lg:pt-10 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="order-1 text-5xl sm:text-5xl sm:leading-none font-extrabold tracking-tight text-white mb-4">
        {t("app.title")}
      </h1>
      <p className="text-sm font-semibold tracking-wide uppercase mb-4">
        {t("app.subtitle")}
      </p>
      <p className="order-2 leading-relaxed mb-8">{t("app.description")}</p>
    </header>
  );
};
