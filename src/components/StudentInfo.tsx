import { h, FunctionalComponent } from "preact";
import useTranslation from "../hooks/useTranslation";
import { Possible } from "../hooks/utils";

export const StudentInfo: FunctionalComponent<{
  email: Possible<string>;
  session: Possible<string>;
  keyDecoded: Possible<string>;
}> = ({ email, session, keyDecoded }) => {
  const { t } = useTranslation();
  return (
    <section className="bg-white rounded-lg shadow-lg">
      <div className=" px-4 py-6 sm:px-6 lg:px-8">
        <h3 className="flex flex-col sm:flex-row items-start sm:items-center text-lg leading-6 font-medium text-gray-900">
          {t("student_info.step_name")}
          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
            {email}
          </span>
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {t("student_info.description")}
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Session</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-all">
              {session}
            </dd>
          </div>
          <div className="bg-white rounded-lg px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              RescueTime API Key
              {!keyDecoded && (
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  {t("student_info.not_found_indicator")}
                </span>
              )}
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-all">
              {keyDecoded ? (
                keyDecoded
              ) : (
                <span className="leading-relaxed break-normal">
                  {t("student_info.not_found_help_text")}
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};
