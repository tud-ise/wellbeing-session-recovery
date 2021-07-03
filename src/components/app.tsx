/* eslint-disable @typescript-eslint/camelcase */
import * as _ from "lodash";
import "tailwindcss/tailwind.css";

import { FunctionalComponent, h } from "preact";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "preact/hooks";
import { animated, useSpring } from "@react-spring/web";

import sha256 from "crypto-js/sha256";
import md5 from "crypto-js/md5";
import Blowfish from "egoroof-blowfish";

import values from "./values";

type Action<T extends string> = {
  action: T;
};

type Content<T> = {
  content: T;
};

type StudentMonadState = {
  user_information: {
    email: string | null;
    age: number | null;
  };

  key: string | null;
  age: number | null;

  vault: typeof values[string] | null;
};

type StudentMonadAction =
  | (Action<"age"> & Content<number | null>)
  | (Action<"email"> & Content<string | null>);

function applyStudentMonadAction(
  state: StudentMonadState,
  { action, content }: StudentMonadAction
): StudentMonadState {
  if (action == "email" && content != null) {
    const vault = values[sha256(content as string).toString()];
    const bf = new Blowfish(
      md5(content as string).toString(),
      Blowfish.MODE.ECB,
      Blowfish.PADDING.NULL
    );

    return {
      ...state,
      user_information: {
        ...state.user_information,
        email: content as string,
      },
      vault,
      key: vault.key_bf
        ? bf
            .decode(
              new Uint8Array(
                vault.key_bf.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
              )
            )
            .toString()
        : null,
      age: vault.age_bf
        ? parseInt(
            bf
              .decode(
                new Uint8Array(
                  vault.age_bf
                    .match(/.{1,2}/g)!
                    .map((byte) => parseInt(byte, 16))
                )
              )
              .toString(),
            10
          )
        : null,
    };
  } else if (action == "email") {
    return {
      user_information: {
        ...state.user_information,
        email: null,
      },
      vault: null,
      age: null,
      key: null,
    };
  }

  switch (action) {
    case "age":
      return {
        ...state,
        user_information: {
          ...state.user_information,
          age: content as number,
        },
      };
    default:
      return state;
  }
}

function useStudentMonad(
  initialState: StudentMonadState
): [
  StudentMonadState,
  (action: StudentMonadAction[] | StudentMonadAction) => void
] {
  const [{ user_information, age, key, vault }, dispatch] = useReducer<
    StudentMonadState,
    StudentMonadAction[] | StudentMonadAction
  >(
    (state, action) =>
      (action instanceof Array ? action : [action]).reduce(
        applyStudentMonadAction,
        { ...state }
      ),
    initialState
  );

  return [
    {
      user_information,
      age,
      key,
      vault,
    },
    dispatch,
  ];
}

const AnimatedDIV = animated.div as unknown as FunctionalComponent<
  h.JSX.HTMLAttributes<HTMLDivElement>
>;

const App: FunctionalComponent = () => {
  const [{ user_information, age, key, vault }, dispatch] = useStudentMonad({
    user_information: {
      email: null,
      age: null,
    },
    age: null,
    key: null,
    vault: null,
  });
  const showResultBox = useMemo(
    () =>
      [user_information.email, user_information.age, age, vault].indexOf(
        null
      ) == -1 && age == user_information.age,
    [age, user_information.age, user_information.email, vault]
  );

  const [{ email: formEmail, age: formAge }, setFormData] = useState({
    email: "",
    age: NaN,
  });

  const resultBoxProps: any = useSpring<h.JSX.CSSProperties>({
    visibility: showResultBox ? "visible" : "hidden",
    scale: showResultBox ? 1 : 0.8,
  });

  const [resultData, setResultData] = useState<{ [x: string]: string }>({});
  const loadResultData = useCallback(
    async () =>
      setResultData(await (await fetch("/assets/all_data_1.json")).json()),
    []
  );
  useEffect(() => void loadResultData(), [loadResultData]);

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 pt-5 sm:pt-10 md:pt-20">
      <header className="flex-none text-white relative z-10 flex flex-col items-start lg:pt-10 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="order-1 text-5xl sm:text-5xl sm:leading-none font-extrabold tracking-tight text-white mb-4">
          Personal Data Recovery Tool
        </h1>
        <p className="text-sm font-semibold tracking-wide uppercase mb-4">
          Wellbeing with Data Analytics
        </p>
        <p className="order-2 leading-relaxed mb-8">
          This tool can be used to retrieve the session token using the e-mail
          address of the participants. If you correctly entered the RescueTime
          API Key, it will also be shown. For those that did not enter the API
          Key correctly yet wish to add it, so that their data can be correlated
          correctly, please send a mail to Gregor. If you have any questions,
          feel free to mail / ask us or post a question in the forum.
        </p>
      </header>

      <div className="lg:pt-5 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg px-4 py-6 sm:px-6 lg:px-8">
          <div className="">
            <h2 className="flex flex-row items-center text-xl leading-6 font-medium text-gray-900">
              Provide Credentials
              {showResultBox && (
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Correct
                </span>
              )}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              We don't want to expose all data to all our students for privacy
              reasons. Please enter your E-Mail Address and your age (the age
              you provided us with during the initial questionnaire).
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  value={formEmail}
                  onChange={(e) =>
                    void (e.preventDefault(),
                    setFormData((s) => ({
                      ...s,
                      email: e.currentTarget.value,
                    })))
                  }
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="age" className="sr-only">
                  Age
                </label>
                <input
                  value={formAge}
                  onChange={(e) =>
                    void (e.preventDefault(),
                    setFormData((s) => ({
                      ...s,
                      age: parseInt(e.currentTarget.value, 10),
                    })))
                  }
                  id="age"
                  name="age"
                  type="number"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Age"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() =>
                  dispatch([
                    {
                      action: "email",
                      content: formEmail,
                    },
                    {
                      action: "age",
                      content: formAge,
                    },
                  ])
                }
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3" />
                Retrieve your user information
              </button>
            </div>
          </div>
        </div>
      </div>

      {showResultBox && (
        <AnimatedDIV
          style={{
            scale: resultBoxProps.scale.to((v: any) => v),
            visibility: resultBoxProps.visibility.to((v: any) => v),
          }}
          className="lg:pt-5 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="bg-white rounded-lg shadow-lg">
            <div className=" px-4 py-6 sm:px-6 lg:px-8">
              <h3 className="flex flex-col sm:flex-row items-start sm:items-center text-lg leading-6 font-medium text-gray-900">
                Student Information for
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
                  {user_information.email}
                </span>
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Data you entered during the initial questionnaire
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Session</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-all">
                    {vault?.session}
                  </dd>
                </div>
                <div className="bg-white rounded-lg px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    RescueTime API Key
                    {!key && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Not Found
                      </span>
                    )}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-all">
                    {key ? (
                      key
                    ) : (
                      <span className="leading-relaxed break-normal">
                        Feel free to send a mail to Gregor if you want your API
                        Key to be included in the study
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </AnimatedDIV>
      )}

      {Object.keys(resultData).length > 0 && (
        <AnimatedDIV
          style={{}}
          className="lg:pt-5 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  {Object.keys(resultData[Object.keys(resultData)[0]][0]).map(
                    (k) => (
                      <th
                        key={k}
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {k}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="w-full h-full rounded-full"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                          Vera Carpenter
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">Admin</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      Jan 21, 2020
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                      />
                      <span className="relative">Activo</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="w-full h-full rounded-full"
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                          Blake Bowman
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">Editor</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      Jan 01, 2020
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                      />
                      <span className="relative">Activo</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="w-full h-full rounded-full"
                          src="https://images.unsplash.com/photo-1540845511934-7721dd7adec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                          Dana Moore
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">Editor</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      Jan 10, 2020
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"
                      />
                      <span className="relative">Suspended</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-5 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="w-full h-full rounded-full"
                          src="https://images.unsplash.com/photo-1522609925277-66fea332c575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&h=160&w=160&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                          Alonzo Cox
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">Admin</p>
                  </td>
                  <td className="px-5 py-5 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      Jan 18, 2020
                    </p>
                  </td>
                  <td className="px-5 py-5 bg-white text-sm">
                    <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                      />
                      <span className="relative">Inactive</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

export default App;
