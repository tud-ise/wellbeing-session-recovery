import { h, FunctionalComponent } from "preact";
import useTranslation from "../hooks/useTranslation";
import useWindow from "../hooks/useWindow";
import { IndexSignature, Possible } from "../hooks/utils";
import { WindowControls } from "./WindowControls";

export default function DataExplorer<T>({
  csv,
  session,
  data,
  columns,
  controls,
}: {
  csv: string;
  session: Possible<string>;
  data: Array<IndexSignature<unknown>>;
  columns: Array<string>;
  controls: ReturnType<typeof useWindow>[2];
}) {
  const { t } = useTranslation();
  return (
    <section className="bg-white rounded-lg shadow-lg pb-2">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h3 className="flex flex-col sm:flex-row items-start sm:items-center text-lg leading-6 font-medium text-gray-900">
          {t("data_explorer.step_name")}
          <a
            className="ml-auto flex justify-between px-4 sm:px-6 lg:px-8 text-sm"
            href={`data:text/csv;charset=utf-8,${csv}`}
            download={`wellbeing_data_all.csv`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download file (.csv)
          </a>
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {t("data_explorer.description")}
        </p>
      </div>
      <div className="min-w-full overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {columns.map((k) => (
                <th
                  key={k}
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {session &&
              data.map((d) => (
                <tr key={d}>
                  {columns.map((k) => (
                    <td
                      key={k}
                      className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p className="text-gray-900 whitespace-no-wrap">
                        {d[k] as string}
                      </p>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <WindowControls {...controls} />
    </section>
  );
}
