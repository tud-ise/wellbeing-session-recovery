import { h, FunctionalComponent } from "preact";
import useTranslation from "../hooks/useTranslation";
import useWindow from "../hooks/useWindow";
import { IndexSignature, Possible } from "../hooks/utils";
import { WindowControls } from "./WindowControls";

export default function DataExplorer<T>({
  session,
  data,
  columns,
  controls,
}: {
  session: Possible<string>;
  data: Array<IndexSignature<unknown>>;
  columns: Array<string>;
  controls: ReturnType<typeof useWindow>[2];
}) {
  const { t } = useTranslation();
  return (
    <section className="bg-white rounded-lg shadow-lg">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h3 className="flex flex-col sm:flex-row items-start sm:items-center text-lg leading-6 font-medium text-gray-900">
          {t("data_explorer.step_name")}
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
