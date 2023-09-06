import { BsDot } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import {
    MdOutlineDateRange,
    MdOutlineAttachment,
} from "react-icons/md";
import { VscFileSubmodule } from "react-icons/vsc";
import { BsThreeDotsVertical } from "react-icons/bs";

import React from "react";
import useAuth from "../../hooks/authHook";

function ListView({ list, deleteTask,
    completeTask,
    openEditModal,
    openViewModal
}) {

    const { products, createdAt, date } = list.order

    const { user } = useAuth()

    return (
        <tr className="bg-white z-[100]"
            onClick={() => {
                openViewModal(list._id)
            }}
        >
            <td>
                <p className="capitalize text-gray-400 font-thin pl-2 " style={{ fontSize: "10px" }}>
                    {new Date(createdAt).toDateString(
                        "en-US",
                        { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                    )}
                </p>
            </td>
            <td>
                <p className="capitalize text-gray-400 font-thin pl-2 " style={{ fontSize: "10px" }}>
                    {new Date(date).toDateString(
                        "en-US",
                        { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                    )}
                </p>
            </td>
            {/* <td className="px-6 py-4">
                {" "}
                <div className="flex flex-row ">
                    <img src={profile} className="w-10 h-10" />
                    <div className="ml-2">
                        <h1 className=" text-xs font-medium text-gray-900  ">
                            {name}
                        </h1>
                        <p
                            className=" text-gray-400 font-thin "
                            style={{ fontSize: "10px" }}
                        >
                            {email}
                        </p>
                    </div>
                </div>
            </td> */}
            <td className="px-6 py-4 flex flex-col items-start ">
                {
                    products.map((item, index) => {
                        return (
                            <p
                                className=" text-gray-800 font-thin bg-green-200 p-1 mb-1 rounded "
                                style={{ fontSize: "12px" }}
                            >
                                {item}
                            </p>
                        )
                    }
                    )
                }
            </td>
            <td className="px-6 py-4 ">
                <span className="bg-green-100 rounded-lg px-2 py-1 capitalize text-gray-800 ">
                    {list.status}
                </span>
            </td>
            <td className="z-[100]">
                {user.role.includes('admin') &&
                    <div className="group inline-block z-[1000]">
                        <button className="outline-none focus:outline-none  px-3 py-1  rounded-sm flex items-center min-w-32">
                            <span className="pr-1 font-semibold flex-1">
                                {" "}
                                <BsThreeDotsVertical />
                            </span>
                        </button>

                        <ul className="bg-white z-[10000] border w-[100px] rounded-sm transform scale-0 group-hover:scale-100 absolute right-0 transition duration-150 ease-in-out origin-top min-w-32">
                            <button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    deleteTask(list._id)
                                }}
                                className="w-full rounded-sm px-3 py-1 hover:bg-gray-100 flex flex-row text-sm items-center text-gray-700">
                                Delete
                            </button>
                            {
                                list.status != 'completed' &&

                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        completeTask(list._id)
                                    }}
                                    className="w-full rounded-sm px-3 py-1 hover:bg-gray-100 flex flex-row text-sm items-center text-gray-700">
                                    Complete
                                </button>
                            }
                        </ul>
                    </div>
                }
            </td>

        </tr>
    );
}


const convertToDate = (date) => {

    const d = new Date(date);

    return d.toLocaleDateString("en-US", {
        day: "numeric",
        year: "numeric",
        month: "short",
    });

};

export default ListView;