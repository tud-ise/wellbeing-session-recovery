import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";

export const ReleaseForm: FunctionalComponent<{
  setUserInformation: (a: { email: string; age: number }) => void;
}> = ({ setUserInformation }) => {
  const [{ email, age }, setFormData] = useState({
    email: "",
    age: NaN,
  });

  return (
    <form
      onSubmit={(e): void =>
        void (e.preventDefault(),
        setUserInformation({
          age,
          email,
        }))
      }
      className="mt-8 space-y-6"
    >
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            value={email}
            onChange={(e): void =>
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
            value={age}
            onChange={(e): void =>
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
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3" />
          Retrieve your user information
        </button>
      </div>
    </form>
  );
};
