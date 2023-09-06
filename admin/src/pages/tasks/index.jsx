import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsCalendarDate, BsFillFileBarGraphFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { HiCurrencyDollar } from "react-icons/hi";
import { MdHomeRepairService } from "react-icons/md";


import React, { useEffect, useState } from "react";

import AddModal from "../../components/tasks/addModal";
import useLoading from "../../hooks/useLoading";
import useAuth from "../../hooks/authHook";
import Card from "../../components/tasks/card";
import useApi from "../../hooks/useApi";
import EditModal from "../../components/tasks/editModal";
import ViewModal from "../../components/tasks/viewModal";
import TaskHeader from "../../components/tasks/header";
import ListView from "../../components/tasks/list";

function Tasks() {
    const { user } = useAuth()
    const { uploadImages } = useApi()
    const { setLoading } = useLoading()
    const [lists, setLists] = useState([])
    const [view, setView] = useState('list')
    const [addModal, setAddModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [task, setTask] = useState()

    const getList = async () => {

        let q = ''

        if (user.role.includes("manager")) q = `?manager=${user.id}`
        else if (user.role.includes("printing")) q = `?printer=${user.id}`
        else if (user.role.includes("shipping")) q = `?delivery=${user.id}`
        else if (user.role.includes("designer")) q = `?designer=${user.id}`
        else if (user.role.includes("admin")) q = ''
        else return

        setLoading(true)
        await axios.get(`task/gettasks${q}`).then((res) => {
            console.log(res.data.tasks)
            setLists(res.data.tasks)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    }

    const deleteTask = async (id) => {
        setLoading(true)
        await axios.delete(`task/deletetask/${id}`)
            .then((res) => {
                toast.success("Task Deleted Successfully")
                getList()
            })
            .catch((err) => { console.log(err) })
            .finally(() => { setLoading(false) })
    }

    const completeTask = async (id) => {
        setLoading(true)
        await axios.patch(`task/updatetask/${id}`, {
            status: 'completed'
        })
            .then((res) => {
                toast.success("Task Completed Successfully")
                getList()
            }
            )
            .catch((err) => { console.log(err) })
            .finally(() => { setLoading(false) })

    }

    const openEditModal = async (id) => {
        // setLoading(true)
        setTask(id)
        setEditModal(true)
    }

    const openViewModal = async (id) => {
        // setLoading(true)
        setTask(id)
        setViewModal(true)
    }

    useEffect(() => {
        getList()
    }, [])

    return (
        <div>
            <TaskHeader
                view={view}
                setView={setView}
            />
            {
                view === 'list' ?
                    <div className="m-1 md:m-5 ">
                        <div className="m-1 md:m-5">
                            <div className="relative overflow-x-auto min-h-screen">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 ">
                                                <div className="flex flex-row">
                                                    <BsCalendarDate className="mr-2 mt-0.5 bg-gray-50 text-gray-700" />{" "}
                                                    Date
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 ">
                                                <div className="flex flex-row">
                                                    <BsCalendarDate className="mr-2 mt-0.5 bg-gray-50 text-gray-700" />{" "}
                                                    Due Date
                                                </div>
                                            </th>
                                            {/* <th scope="col" className="px-6 py-3 ">
                                                <div className="flex flex-row">
                                                    <FaUserCircle className="mr-2 mt-0.5 bg-gray-50 text-gray-700" />{" "}
                                                    Name
                                                </div>
                                            </th> */}
                                            <th scope="col" className="px-6 py-3">
                                                <div className="flex flex-row">
                                                    <MdHomeRepairService className="mr-2 mt-0.5 " />
                                                    Service
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                <div className="flex flex-row">
                                                    <BsFillFileBarGraphFill className="mr-2 mt-0.5 " />
                                                    Status
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    {
                                        lists.map((list) => {
                                            return (
                                                <ListView
                                                    list={list}
                                                    deleteTask={deleteTask}
                                                    completeTask={completeTask}
                                                    openEditModal={openEditModal}
                                                    openViewModal={openViewModal}
                                                />
                                            )
                                        }
                                        )
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="m-1 md:m-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                        {
                            lists.map((tsk) => {
                                return (
                                    <Card
                                        task={tsk}
                                        deleteTask={deleteTask}
                                        completeTask={completeTask}
                                        openEditModal={openEditModal}
                                        openViewModal={openViewModal}
                                    />
                                )
                            })
                        }

                        {/* <div>
                            {
                                user.role === 'admin' &&
                                <button
                                    onClick={() => setAddModal(true)}
                                    className="bg-white flex flex-row justify-center text-blue-500 rounded-lg border border-dashed border-blue-500 px-2 py-2 text-sm w-full"
                                    type="button"
                                >
                                    <AiOutlinePlusCircle className="mr-2 mt-1" />
                                    <h1>Add Task</h1>
                                </button>
                            }
                        </div> */}
                    </div>
            }
            <AddModal
                open={addModal}
                handleClose={() => setAddModal(false)}
                getList={getList}
            />
            {/* <EditModal
                open={editModal}
                handleClose={() => setEditModal(false)}
                getList={getList}
                task={task}
            /> */}
            <ViewModal
                open={viewModal}
                handleClose={() => setViewModal(false)}
                getList={getList}
                task={task}
            />
        </div>
    );
}

export default Tasks;
