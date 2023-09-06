import { IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoMdNotificationsOutline } from "react-icons/io";

import React, { useEffect } from "react";
import useAuth from "../../hooks/authHook";
import axios from "axios";

function Header() {
  const { user } = useAuth();

  const [notification, setNotification] = React.useState(false)
  const [profile, setProfile] = React.useState(false)

  const [notifications, setNotifications] = React.useState([])

  useEffect(() => {

    const getNotifications = async () => {
      await axios.get("notification/" + user.id).then((res) => {
        setNotifications(res.data.notification)
      })

    }

    if (!user.id) return

    getNotifications()
  }, [])

  const { Logout } = useAuth()

  return (
    <div>
      {/* component */}
      <nav className=" bg-white w-full flex relative justify-end sm:justify-between items-center mx-auto px-8 py-4 h-16">
        {/* search bar */}
        <div className="hidden sm:block flex-shrink flex-grow-0 justify-start px-2">
          <div className="inline-block">
            <div className="inline-flex items-center max-w-full">
              <input
                className="flex items-center text-gray-400 bg-slate-50 justify-between  flex-grow-0  relative w-72 border rounded-lg  py-1"
                type="search"
                placeholder="Search"
              />

              <div className="flex items-center justify-center relative  h-8 w-24 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex-initial">
          <div className="flex justify-end items-center relative">
            <div className="block">
              <div className="relative flex flex-row justify-center">


                <div
                  className="ml-5 md:cursor-pointer py-5"
                >
                  <button
                    onClick={() => {
                      setProfile(false)
                      setNotification(!notification)
                    }}
                  >
                    <IoIosNotifications className="text-gray-400 text-xl hover:text-blue-500" />
                  </button>
                  {notification && <div className="relative" style={{ zIndex: 10 }}>
                    <div className="absolute top-[17px] right-[-5px] group-hover:block hover:block">
                      <div className="bg-white shadow-md border px-3.5 pt-3.5 w-[300px]">

                        <div className="pb-3.5">
                          {
                            notifications.length === 0 &&
                            <div className="text-sm w-full text-gray-600 text-center">
                              <p>No Notifications</p>
                            </div>
                          }
                          {
                            notifications.map((notification) => (
                              <div className="flex items-center justify-between pb-2 border-b-[1px] mt-2">
                                <div className="flex items-center">

                                  <div className="flex-shrink-0">
                                    <IoMdNotificationsOutline
                                      className="h-8 w-8 text-blue-500"
                                    />
                                  </div>

                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {notification.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {notification.body}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>



                      </div>
                    </div>
                  </div>}
                </div>

                <div
                  className="ml-5 md:cursor-pointer group py-5"
                >
                  {" "}
                  <button
                    onClick={() => {
                      setProfile(!profile)
                      setNotification(false)
                    }}
                  >
                    <CgProfile className="text-gray-400 text-xl hover:text-blue-500 " />
                  </button>

                  {profile && <div className="relative" style={{ zIndex: 1000 }}>
                    <div className="absolute top-[17px] right-[-5px] group-hover:block hover:block">

                      <div className="bg-white border shadow-md px-3.5 pt-3.5 w-[200px]">

                        <div className="pb-3.5">
                          <button
                            onClick={() => {
                              Logout()
                            }}
                            // to="/"
                            className="text-sm text-gray-600 hover:text-blue-600"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>}
                </div>

              </div>
            </div>
          </div>
        </div>
        {/* end login */}
      </nav >
    </div >
  );
}

export default Header;
