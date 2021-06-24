/* eslint-disable @typescript-eslint/camelcase */
import * as _ from "lodash";
import "tailwindcss/tailwind.css";

import { FunctionalComponent, h } from "preact";
import { useEffect, useMemo, useReducer, useState } from "preact/hooks";
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
      key: bf
        .decode(
          new Uint8Array(
            vault.key_bf.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
          )
        )
        .toString(),
      age: parseInt(
        bf
          .decode(
            new Uint8Array(
              vault.age_bf.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
            )
          )
          .toString(),
        10
      ),
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

const Correct: FunctionalComponent = () => (
  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
    Correct
  </span>
);

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

  useEffect(
    () =>
      void console.debug({
        user_information,
        age,
        key,
        vault,
        showResultBox,
        resultBoxProps,
      }),
    [age, key, showResultBox, user_information, vault, resultBoxProps]
  );

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 pt-5 sm:pt-10 md:pt-20">
      <header className="flex-none text-white relative z-10 flex flex-col items-start lg:pt-10 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="order-1 text-3xl sm:text-5xl sm:leading-none font-extrabold tracking-tight text-white mb-4">
          Session Recovery Tool
        </h1>
        <p className="text-sm font-semibold tracking-wide uppercase mb-4">
          Wellbeing with Data Analytics
        </p>
        <p className="order-2 leading-relaxed mb-8">
          This tool can be used to retrieve the session token using the e-mail
          address of the participants. If you correctly entered the Rescuetime
          API Key, it will also be shown. For those that did not enter the API
          Key correctly yet wish to add it so that their data can be correlated
          correctly, please send a mail to XY.
        </p>
      </header>

      <div className="lg:pt-5 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg px-4 py-6 sm:px-6 lg:px-8">
          <div className="">
            <h2 className="flex flex-row items-center text-xl leading-6 font-medium text-gray-900">
              Provide Credentials
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
            scale: resultBoxProps.scale.to((v) => v),
            visibility: resultBoxProps.visibility.to((v) => v),
          }}
          className="lg:pt-5 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="bg-white rounded-lg shadow-lg">
            <div className=" px-4 py-6 sm:px-6 lg:px-8">
              <h3 className="flex flex-row items-center text-lg leading-6 font-medium text-gray-900">
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
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {vault?.session}
                  </dd>
                </div>
                <div className="bg-white rounded-lg px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    RescueTime API Key
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {key}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </AnimatedDIV>
      )}
    </div>
  );
};

export default App;
