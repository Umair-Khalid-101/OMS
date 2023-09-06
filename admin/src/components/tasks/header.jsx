import React from "react";
import { BsFilesAlt } from "react-icons/bs";
import { CiCircleList } from "react-icons/ci";
import { Link } from "react-router-dom";

function TaskHeader({ view, setView }) {

    const selectedClass = "text-blue-500 text-sm border-r flex flex-row items-center  bg-gray-100 rounded-md mr-2 px-2 py-1"
    const unselectedClass = "text-gray-600 hover:text-blue-500 text-sm  border-gray-200 border-r flex flex-row items-center  hover:bg-gray-100 rounded-md mr-2 px-2 py-1"

    return (
        <div className="bg-white m-5 p-3 rounded-md">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-gray-800 font-medium text-sm">Tasks</h1>
                <div className="border border-gray-200 p-2 rounded-md flex flex-row">
                    <button
                        onClick={() => setView("board")}
                        className={
                            view == "board" ? selectedClass : unselectedClass
                        }
                    >
                        <BsFilesAlt className="mr-1" /> Board
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={
                            view == "list" ? selectedClass : unselectedClass
                        }
                    >
                        <CiCircleList className="mr-1" /> List
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskHeader;