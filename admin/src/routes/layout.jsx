import { Link, Outlet, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { BiTask } from "react-icons/bi";
import { MdOutlineDashboard } from "react-icons/md";
import { FiSettings } from "react-icons/fi";

import React, { useState } from "react";

import Header from "../components/header/index";
import useLoading from "../hooks/useLoading";
import "./index.css";
import useAuth from "../hooks/authHook";

export default function Layout() {
  const [open, setOpen] = useState(false);

  const { user } = useAuth()
  const { loading } = useLoading();
  const { pathname } = useLocation();

  const sc = "rounded-md text-xs flex items-center gap-x-4 cursor-pointer bg-gray-50 text-blue-500 py-4 p-2"
  const uc = "rounded-md text-gray-500  text-xs flex items-center gap-x-4 cursor-pointer hover:bg-gray-50 hover:text-blue-500 py-4 p-2"

  return (
    <div>
      <div
        className={`h-screen bg-white p-3 ${open ? "w-56" : "w-[60px]"} fixed top-0 sidebar z-[999999]`}
      >
        {
          loading && <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-[999999] flex justify-center items-center">
            <div className="bg-white p-5 rounded-md">
              <div className="flex flex-row justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mr-3"></div>
                <h1 className="text-lg font-medium">Loading...</h1>
              </div>
            </div>
          </div>
        }

        <div className="flex flex-row justify-center">
          <svg
            width="67"
            height="67"
            viewBox="0 0 67 67"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={` text-4xl block float-left cursor-pointer rounded transition duration-500 ${!open && "rotate-[360deg]"
              }`}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <path
              d="M22.138 15.2984L30.8759 24.0363C32.3276 25.488 34.7005 25.488 36.1522 24.0363L44.8901 15.2984C47.2351 12.9534 45.588 8.90552 42.238 8.90552H24.7622C21.4401 8.90552 19.7651 12.9534 22.138 15.2984Z"
              fill="#208FF5"
            />
            <path
              d="M22.138 51.7017L30.8759 42.9637C32.3276 41.5121 34.7005 41.5121 36.1522 42.9637L44.8901 51.7017C47.2351 54.0467 45.588 58.0946 42.238 58.0946H24.7622C21.4401 58.0946 19.7651 54.0467 22.138 51.7017Z"
              fill="#208FF5"
            />
            <path
              d="M6.03002 31.9088L12.423 21.8588C13.428 20.2676 15.6614 20.0163 17.0014 21.3563L27.0514 31.4063C28.1959 32.5509 28.1959 34.4213 27.0514 35.5659L17.0014 45.6159C15.6614 46.9559 13.456 46.7047 12.423 45.1134L6.03002 35.0634C5.44377 34.1142 5.44377 32.8859 6.03002 31.9088Z"
              fill="#208FF5"
            />
            <path
              d="M60.9701 31.9088L54.5771 21.8588C53.5721 20.2676 51.3387 20.0163 49.9987 21.3563L39.9488 31.4063C38.8042 32.5509 38.8042 34.4213 39.9488 35.5659L49.9987 45.6159C51.3387 46.9559 53.5442 46.7047 54.5771 45.1134L60.9701 35.0634C61.5563 34.1142 61.5563 32.8859 60.9701 31.9088Z"
              fill="#208FF5"
            />
          </svg>
        </div>

        <ul className="pt-2">
          {/* Tasks */}
          <Link
            to="/"
            className={
              (["/tasks", "/orders", "/submission", "/payment", "/"].includes(pathname)) ? sc : uc
            }
          >
            <span className="text-xl block">
              <BiTask />
            </span>
            <span
              className={` text-sm font-md flex-1 hidden-link ${!open && "hidden"
                }`}
            >
              Tasks
            </span>
          </Link>

          {/* Orders */}
          <Link
            to="/orders"
            className={
              pathname == "/orders" ? sc : uc
            }
          >
            <span className="text-xl block">
              <MdOutlineDashboard />
            </span>
            <span
              className={` text-sm font-md hidden-link ${!open && "hidden"
                }`}
            >
              Orders
            </span>
          </Link>

          {/* Account Manager */}

          {
            user.role.includes('admin') &&
            <Link
              to="/account-manager"
              className={
                pathname == "/account-manager" ? sc : uc
              }
            >
              <span className="text-lg block">
                <CgProfile />
              </span>
              <span
                className={` text-sm font-md flex-1  hidden-link ${!open && "hidden"
                  }`}
              >
                Account Manager
              </span>
            </Link>
          }

          {
            user.role.includes('manager') &&
            <Link
              to="/designer"
              className={
                pathname == "/designer" ? sc : uc
              }
            >
              <span className="text-lg block">
                <CgProfile />
              </span>
              <span
                className={` text-sm font-md flex-1  hidden-link ${!open && "hidden"
                  }`}
              >
                Designer
              </span>
            </Link>
          }

          {/* Settings */}
          <Link
            to="/settings"
            className={
              pathname == "/settings" ? sc : uc
            }
          >
            <span className="text-xl block">
              <FiSettings />
            </span>
            <span
              className={` text-sm font-md flex-1  hidden-link ${!open && "hidden"
                }`}
            >
              Settings
            </span>
          </Link>
        </ul>
      </div>

      <div className={`${open ? "ml-56" : "ml-[60px]"}`}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
