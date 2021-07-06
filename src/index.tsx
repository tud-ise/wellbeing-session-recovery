/* eslint-disable @typescript-eslint/camelcase */
import * as _ from "lodash";
import "tailwindcss/tailwind.css";

import { FunctionalComponent, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { animated } from "@react-spring/web";
import csv from "csvtojson";

import values from "./values";
import useRemoteJSON, { useRemoteText } from "./hooks/useRemoteJSON";
import {
  decodeMD5Blowfish,
  useMD5BlowfishDecoder,
} from "./hooks/useBlowfishDecoder";
import useSHA256Lookup from "./hooks/useHashLookup";
import { IndexSignature, Possible } from "./hooks/utils";
import useSpringTrigger from "./hooks/useSpringTrigger";
import useWindow from "./hooks/useWindow";
import useTranslation, { TranslationProvider } from "./hooks/useTranslation";
import { AppHeader } from "./components/AppHeader";
import { ReleaseForm } from "./components/ReleaseForm";
import { StudentInfo } from "./components/StudentInfo";
import DataExplorer from "./components/DataExplorer";
import useAsyncMemo from "./hooks/useAsyncMemo";

const AnimatedDIV = animated.div as unknown as FunctionalComponent<
  h.JSX.HTMLAttributes<HTMLDivElement>
>;

const App: FunctionalComponent = () => {
  const { t } = useTranslation();
  const [{ email, age }, setUserInformation] = useState({
    email: null as Possible<string>,
    age: null as Possible<number>,
  });

  const { age_bf, key_bf, session } = useSHA256Lookup(email, values) || {
    age_bf: null,
    key_bf: null,
    session: "",
  };
  const keyDecoded = useMD5BlowfishDecoder(key_bf, email);
  const ageDecoded = parseInt(useMD5BlowfishDecoder(age_bf, email) || "", 10);
  const csvDecoded = useMD5BlowfishDecoder(
    useRemoteText<Possible<string>>(
      session ? `/assets/${session}.csv` : null,
      null,
      [session]
    ),
    email
  );
  const [data, columns, controls] = useWindow(
    useAsyncMemo<Array<IndexSignature<unknown>>>(
      async () => {
        if (!csvDecoded) {
          return [];
        }

        return await csv().fromString(csvDecoded);
      },
      [],
      [csvDecoded]
    )
  );

  const [animationProps, showResults] = useSpringTrigger(
    () =>
      [email, age, ageDecoded, age_bf, key_bf, session].indexOf(null) == -1 &&
      ageDecoded == age,
    (showResultBox) => ({
      visibility: showResultBox ? "visible" : "hidden",
      scale: showResultBox ? 1 : 0.8,
    }),
    [ageDecoded, age, email, age_bf, key_bf, session]
  );

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 pt-5 sm:pt-10 md:pt-20">
      <AppHeader />

      <div className="lg:pt-5 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg px-4 py-6 sm:px-6 lg:px-8">
          <div className="">
            <h2 className="flex flex-row items-center text-xl leading-6 font-medium text-gray-900">
              {t("credentials.step_name")}
              {showResults && (
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {t("credentials.success_indicator")}
                </span>
              )}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {t("credentials.description")}
            </p>
          </div>
          <ReleaseForm setUserInformation={setUserInformation} />
        </div>
      </div>

      {showResults && (
        <AnimatedDIV
          style={animationProps}
          className="lg:pt-5 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8"
        >
          <StudentInfo
            email={email}
            session={session}
            keyDecoded={keyDecoded}
          />
        </AnimatedDIV>
      )}

      {showResults && (
        <AnimatedDIV
          style={animationProps}
          className="lg:pt-5 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8"
        >
          <DataExplorer
            csv={csvDecoded}
            session={session}
            data={data}
            columns={columns}
            controls={controls}
          />
        </AnimatedDIV>
      )}

      <footer className="flex-none text-white relative mt-16 flex flex-col items-start lg:pt-10 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm self-center font-semibold tracking-wide uppercase mb-4">
          Made with ❤️ by <a href="https://github.com/jakoblorz">Jakob</a> and{" "}
          <a href="https://github.com/gregoralbrecht">Gregor</a>
        </p>
      </footer>
    </div>
  );
};

// eslint-disable-next-line react/display-name
export default function (): JSX.Element {
  return (
    <TranslationProvider>
      <App />
    </TranslationProvider>
  );
}
