import { AiTwotoneSetting } from "react-icons/ai";
import React, { useState } from "react";
import Profile from "../../assets/images/Ellipse 1631.png";

function Card({ data, removeUser, changeAccess }) {
    const [isOpen, setisOpen] = useState(false);
    const [access, setAccess] = useState(data.access || []);

    const toggle = () => {
        setisOpen(!isOpen);
    };

    const handleChange = (e) => {
        const newData = [...access];

        if (access.indexOf(e.target.value) === -1) {
            newData.push(e.target.value);
        } else {
            newData.splice(newData.indexOf(e.target.value), 1);
        }

        setAccess(newData);
    };

    return (
        <div>
            <div className="bg-white shadow p-3 rounded-md h-[220px]">
                <div className="flex flex-row justify-between">
                    <div>
                        <img src={data.avatar ? import.meta.env.VITE_SERVER_URL + data.avatar : Profile} className="w-20 h-20 rounded-full" />
                        <h1 className=" my-2  font-medium text-xl">{data.firstname} {data.lastname}</h1>
                        <p className="text-sm font-thin mb-2 text-blue-500">{data.control}</p>
                        <p className="text-xs font-thin mb-2 text-gray-500">
                            {data.email}
                        </p>
                    </div>
                    <div>
                        <AiTwotoneSetting
                            className="text-gray-500 text-lg cursor-pointer"
                            onClick={toggle}
                        />
                        {isOpen && (
                            <ul className="bg-white absolute  mt-2 py-2 w-36 shadow rounded ">
                                <li
                                    className="text-gray-600 text-xs font-thin px-3 py-1 cursor-pointer hover:bg-gray-100 focus:bg-blue-500 focus:text-white"
                                    tabIndex={0} // Make the <li> element focusable
                                >
                                    <div className="flex flex-row">
                                        <input type="checkbox"
                                            className="mr-2 small-checkbox"
                                            onChange={handleChange}
                                            value="full"
                                            checked={access.includes("task") && access.includes("order") && access.includes("submission")}
                                        />
                                        Full Control
                                    </div>
                                </li>

                                <li
                                    className="text-gray-600 text-xs font-thin px-3 py-1 cursor-pointer hover:bg-gray-100 focus:bg-blue-500 focus:text-white"
                                    tabIndex={1}
                                >
                                    <div className="flex flex-row">
                                        <input type="checkbox" className="mr-2 small-checkbox"
                                            onChange={handleChange}
                                            value="task"
                                            checked={access.includes("task")}
                                        />
                                        Task
                                    </div>
                                </li>
                                <li
                                    className="text-gray-600 text-xs font-thin px-3 py-1 cursor-pointer hover:bg-gray-100 focus:bg-blue-500 focus:text-white"
                                    tabIndex={2}
                                >
                                    <div className="flex flex-row">
                                        <input type="checkbox" className="mr-2 small-checkbox"
                                            onChange={handleChange}
                                            value="order"
                                            checked={access.includes("order")}
                                        />
                                        Order
                                    </div>
                                </li>
                                <li
                                    className="text-gray-600 text-xs font-thin px-3 py-1 cursor-pointer hover:bg-gray-100 focus:bg-blue-500 focus:text-white"
                                    tabIndex={3}
                                >
                                    <div className="flex flex-row">
                                        <input type="checkbox" className="mr-2 small-checkbox"
                                            onChange={handleChange}
                                            value="submission"
                                            checked={access.includes("submission")}
                                        />
                                        Submissions
                                    </div>
                                </li>
                                <li
                                    className="text-gray-600 text-xs font-thin px-3 py-1 cursor-pointer hover:bg-gray-100 focus:bg-blue-500 focus:text-white"
                                    tabIndex={4}
                                >
                                    <div className="flex flex-row">
                                        <button
                                            onClick={() => {
                                                changeAccess(data._id, access)
                                                toggle()
                                            }}
                                            className="bg-blue-500 text-white w-full py-2 rounded-md my-2">
                                            Save
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => removeUser(data._id)
                    }
                    className="bg-blue-500 text-white w-full py-2 rounded-md my-2">
                    Remove
                </button>
            </div>
        </div>
    );
}

export default Card;
