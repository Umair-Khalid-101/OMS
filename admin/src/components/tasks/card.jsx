import { BsThreeDotsVertical } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";
import { VscFileSubmodule } from "react-icons/vsc";

import React from 'react'
import useAuth from "../../hooks/authHook";

export default function Card({ task, deleteTask, completeTask, openEditModal, openViewModal }) {

  const { user } = useAuth()

  return (
    <div
      onClick={() => openViewModal(task._id)}
      className="bg-white p-2 rounded-md relative">
      <div className="flex flex-row justify-between pt-2 pb-1 mb-1 border-b">
        <div
          className="text-sm font-medium"
        >
          {task.name}
        </div>

        {user.role.includes('admin') &&
          <div className="group inline-block">
            <button className="outline-none focus:outline-none  px-3 py-1  rounded-sm flex items-center min-w-32">
              <span className="pr-1 font-semibold flex-1">
                {" "}
                <BsThreeDotsVertical />
              </span>
            </button>

            <ul className="bg-white z-[1000] border w-[100px] rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  openEditModal(task._id)
                }}
                className="w-full rounded-sm px-3 py-1 hover:bg-gray-100 flex flex-row text-sm items-center text-gray-700">
                Edit
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  deleteTask(task._id)
                }}
                className="w-full rounded-sm px-3 py-1 hover:bg-gray-100 flex flex-row text-sm items-center text-gray-700">
                Delete
              </button>
              {
                task.status != 'completed' &&

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    completeTask(task._id)
                  }}
                  className="w-full rounded-sm px-3 py-1 hover:bg-gray-100 flex flex-row text-sm items-center text-gray-700">
                  Complete
                </button>
              }
            </ul>
          </div>
        }



      </div>
      <div className="flex flex-col pb-2">
        <p className="text-xs font-thin text-gray-500 mr-2 mt-1">
          {task.name}
        </p>
        <p className="text-xs font-thin text-gray-500 mr-2 mt-1">
          {
            task.email
          }
        </p>
        <p className="text-xs font-thin text-gray-500 mr-2 mt-1">{task.assignTo.name}</p>
        <p className="text-xs font-thin text-gray-500 mr-2 mt-1">{task?.designer?.name}</p>
      </div>
      <div className="flex flex-row items-center justify-between border-t">
        <div className="flex flex-row text-gray-500 mt-1">
          <CiCalendarDate className="mr-1" />
          <p className="text-xs font-thin text-gray-500 mr-2">{new Date(task.createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          )}</p>
        </div>
        <div className="flex flex-row items-center justify-between text-gray-500 mt-1">
          <VscFileSubmodule className="mr-1" />
          <p className="text-xs font-thin text-gray-500 mr-2">{task?.order?.jersies?.length} Files</p>
        </div>
      </div>

      {
        <p className="text-end text-gray-500 capitalize mt-3">
          {task.status}
        </p>
      }

    </div>
  )
}
