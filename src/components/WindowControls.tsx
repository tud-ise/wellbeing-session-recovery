import { FunctionalComponent, h } from "preact";
import useWindow from "../hooks/useWindow";

function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(" ");
}

export const WindowControls: FunctionalComponent<
  ReturnType<typeof useWindow>[2]
> = ({ backward, forward, offset, size, values: rows }) => {
  return (
    <div className="bg-white px-4 py-3 pt-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={(e) => void (e.preventDefault, backward())}
          disabled={offset == 0}
          className={classNames(
            "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
            offset == 0 ? "opacity-50" : ""
          )}
        >
          Previous
        </button>
        <button
          onClick={(e) => void (e.preventDefault, forward())}
          disabled={offset + size >= rows.length}
          className={classNames(
            "ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
            offset + size >= rows.length ? "opacity-50" : ""
          )}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{offset + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(offset + size, rows.length)}
            </span>{" "}
            of <span className="font-medium">{rows.length}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={(e) => void (e.preventDefault, backward())}
              disabled={offset == 0}
              className={classNames(
                "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50",
                offset == 0 ? "opacity-50" : ""
              )}
            >
              <span className="sr-only">Previous</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={(e) => void (e.preventDefault, forward())}
              disabled={offset + size >= rows.length}
              className={classNames(
                "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50",
                offset + size >= rows.length ? "opacity-50" : ""
              )}
            >
              <span className="sr-only">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
