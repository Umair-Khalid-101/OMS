import { FiDownload } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { FaRegFileVideo } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi"

import CustomModal from "../modal";
import axios from "axios";
import { toast } from "react-hot-toast";
import useLoading from "../../hooks/useLoading";
import useAuth from "../../hooks/authHook";
import LineText from "../lineText";
import useApi from "../../hooks/useApi";

function ViewModal({ open, handleClose, getList, task }) {

    const { setLoading } = useLoading()
    const { uploadImage } = useApi()
    const { user } = useAuth()
    const [editors, setEditors] = useState([])
    const [printers, setPrinters] = useState([])
    const [delivery, setDelivery] = useState([])
    const [data, setData] = useState({
        name: "",
        description: "",
        assignTo: "",
        email: "",
        products: [],
    });
    const inputRef = React.useRef();
    const [design, setDesign] = useState()
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (body) => {

        if (data.status == 'active' && !body.designer) {
            toast.error('Please select a designer')
            return
        }

        setLoading(true);
        await axios.patch('task/updatetask/' + task, body).then((res) => {
            toast.success('Task updated successfully')
            getList()
            getTask()
            // handleClose();
        }).catch((err) => {
            console.log(err)
        }).finally(() => { setLoading(false) })

    };

    const submitToClient = async () => {

        if (!design && !data.design) {
            toast.error('Please upload design')
            return
        }

        const imgRes = design ? await uploadImage('image', design) : { status: 200, image: data.design }

        if (imgRes.status !== 200) {
            toast.error('Error uploading design')
            return
        }

        setLoading(true);
        await axios.patch('task/submit-to-client/' + task, { managerReview: data.managerReview, design: imgRes.image }).then((res) => {
            toast.success('Task Submitted successfully')
            getList()
            getTask()
            // handleClose();
        }).catch((err) => {
            console.log(err)
        }).finally(() => { setLoading(false) })

    }

    const submitToAdmin = async () => {

        if (!design && !data.design) {
            toast.error('Please upload design')
            return
        }

        const imgRes = design ? await uploadImage('image', design) : { status: 200, image: data.design }

        if (imgRes.status !== 200) {
            toast.error('Error uploading design')
            return
        }

        setLoading(true);
        await axios.patch('task/submit-to-admin/' + task, { adminReview: data.adminReview, design: imgRes.image }).then((res) => {
            toast.success('Task Submitted successfully')
            getList()
            getTask()
            // handleClose();
        }).catch((err) => {
            console.log(err)
        }).finally(() => { setLoading(false) })

    }

    const submitToManager = async () => {

        if (!design) {
            toast.error('Please upload design')
            return
        }

        const imgRes = await uploadImage('image', design)

        if (imgRes.status !== 200) {
            toast.error('Error uploading design')
            return
        }

        const body = {
            status: 'submitted-to-manager',
            submittedBy: user.role.includes('designer') ? 'designer' : 'manager',
            design: imgRes.image,
        }

        setLoading(true);
        await axios.patch('task/submit-to-manager/' + task, body).then((res) => {
            toast.success('Task Submitted successfully')
            getList()
            getTask()
            // handleClose();
        }
        ).catch((err) => {
            console.log(err)
        }
        ).finally(() => { setLoading(false) })
    }

    const assignToDesigner = async () => {

        if (!data.designer) {
            toast.error('Please select a designer')
            return
        }

        setLoading(true);
        await axios.patch('task/assign-designer/' + task, { designer: data.designer }).then((res) => {
            toast.success('Task Submitted successfully')
            getList()
            getTask()
            // handleClose();
        }
        ).catch((err) => {
            console.log(err)
        }).finally(() => { setLoading(false) })
    }

    const assignToPrinter = async () => {
        if (!data.printer) {
            toast.error('Please select a printer')
            return
        }

        setLoading(true);
        await axios.patch('task/assign-printer/' + task, { printer: data.printer }).then((res) => {
            toast.success('Task Submitted successfully')
            getList()
            getTask()
            // handleClose();
        }
        ).catch((err) => {
            console.log(err)
        }).finally(() => { setLoading(false) })
    }

    const assignToShipping = async () => {
        if (!data.shipping) {
            toast.error('Please select a shipping resource')
            return
        }

        setLoading(true);
        await axios.patch('task/assign-delivery/' + task, { delivery: data.shipping }).then((res) => {
            toast.success('Task Submitted successfully')
            getList()
            getTask()
        }
        ).catch((err) => {
            console.log(err)
        }).finally(() => { setLoading(false) })
    }

    const getEditors = async () => {

        if (!user.role.includes('manager')) return

        await axios.get("user/get-designer?host=" + user.id).then((res) => {
            setEditors(res.data.users);
        }).catch((err) => {
            console.log(err);
        })

    }

    const getPrinters = async () => {

        if (!user.role.includes('manager')) return

        await axios.get("user/users?role=printing").then((res) => {
            setPrinters(res.data.users);
        }).catch((err) => {
            console.log(err);
        })

    }

    const getShipping = async () => {

        if (!user.role.includes('manager')) return

        await axios.get("user/users?role=shipping").then((res) => {
            setDelivery(res.data.users);
        }).catch((err) => {
            console.log(err);
        })

    }

    const getTask = async () => {
        await axios.get(`task/gettask/${task}`).then((res) => {
            const task = res.data.task
            setData({
                ...task.order,
                ...task,
            })
        }
        ).catch((err) => {
            console.log(err)
        }
        ).finally(() => { setLoading(false) })

    }

    const taskPrinted = async () => {

        setLoading(true);
        await axios.patch('task/task-printed/' + task).then((res) => {
            toast.success('Task Submitted successfully')
            getList()
            getTask()
        }
        ).catch((err) => {
            console.log(err)
        }).finally(() => { setLoading(false) })
    }

    const taskShipped = async () => {

        setLoading(true);
        await axios.patch('task/task-delivered/' + task).then((res) => {
            toast.success('Task Submitted successfully')
            getList()
            getTask()
        }
        ).catch((err) => {
            console.log(err)
        }).finally(() => { setLoading(false) })
    }


    useEffect(() => {
        getEditors()
        getPrinters()
        getShipping()
    }, []);

    useEffect(() => {

        if (!task) return

        getTask()

    }, [task, open]);

    const extention = (file) => {
        const ext = file?.name ? file?.name?.split('.').pop() : file?.split('.').pop()

        return ext
    }

    return (
        <div>

            {open && (
                <CustomModal open={open} handleClose={handleClose}>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                            <div className="bg-white w-full mt-3 ">

                                <div className='grid md:grid-cols-2'>
                                    <Container
                                        label="Let us know if you are a new customer"
                                        value={data.customer || "N/A"}
                                    />
                                    <Container
                                        label="How did you hear about us? (Optional)"
                                        value={data.aboutUs || "N/A"}
                                        onChange={(e) => setData({ ...data, aboutUs: e.target.value })}
                                    />
                                    <Container
                                        label="Is this a re-order using a previous years jersey?"
                                        value={data.reOrder || "N/A"}
                                    />

                                    <Container
                                        label="Shipping to home or school (choose one)"
                                        value={data.shipping || "N/A"}
                                    />

                                    <Container
                                        label="Sport"
                                        value={data.sport || "N/A"}
                                    />

                                    <Container
                                        label="Name"
                                        value={data.firstname + " " + data.lastname}
                                    />

                                    <Container
                                        label="Phone Number"
                                        value={data.phone}
                                    />

                                    <Container
                                        label="School Name"
                                        value={data.school || "N/A"}
                                    />

                                    <Container
                                        label="Email"
                                        value={data.email}
                                    />

                                    <Container
                                        label="Shipping Address"
                                        value={data.shippingAddress}
                                    />

                                    <Container
                                        value={data.address2 || "N/A"}
                                        label={`Street Address Line 2`}
                                    />
                                    <Container
                                        value={data.city || "N/A"}
                                        label={`City`}
                                    />
                                    <Container
                                        value={data.state || "N/A"}
                                        label={`State/Province`}
                                    />
                                    <Container
                                        value={data.zip || "N/A"}
                                        label={`Zip/Postal Code`}
                                    />
                                    <div className="md:col-span-2 ">
                                        <div className="grid md:grid-cols-2 gap-2">

                                        </div>
                                    </div>

                                    <Container
                                        label={'Select Which Package You are interested in ordering?'}
                                    >
                                        {
                                            data.products.map((item, index) => {
                                                return (
                                                    <p className="text-gray-500 text-sm">{item}</p>
                                                )
                                            }
                                            )
                                        }
                                    </Container>

                                    <Container
                                        label="How Many Framed Jersey Prints are Being Ordered?"
                                        value={data.framed || "N/A"}
                                    />

                                    <Container
                                        label="Do you want the front or back of the jersey re-created for your order?"
                                        value={data.jersey}
                                    />

                                    <Container
                                        label="If getting the back of jersey re-created, do you want to add the players last name?"
                                        value={data.jerseyBack}
                                    />

                                    <Container
                                        label="Please list ALL Players last names and numbers, no need to fill out multiple forms"
                                        value={data.players}
                                    />

                                    <ImagesInput
                                        label="Picture of Jersey (front or back, whichever one you want displayed)"
                                        images={data.jersies || []}
                                    />

                                    <Container
                                        label="Name Plate Info for ALL Jerseys Being Ordered (Applies only to Hall of Fame, All Pro, and Junior All Pro Packages)"
                                        value={data.namePlate || 'N/A'}
                                    />

                                    <ImagesInput
                                        label={'School Logo'}
                                        images={data.logo || []}
                                    />

                                    <Container
                                        label="Font Name Used On Jersey (If Known)"
                                        value={data.font || 'N/A'}
                                    />

                                    <Container
                                        label="Official School Colors"
                                        value={data.colors || 'N/A'}
                                    />

                                    <Container
                                        label="Date Needed By"
                                        value={data.date || 'N/A'}
                                    />

                                </div>

                                <div className="mb-2">
                                    <label
                                        htmlFor="assignTo"
                                        className="block text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Assign To
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-white">
                                        {data.assignTo.name}
                                    </p>
                                </div>

                                {data?.designer?.name && <div className="mb-2">
                                    <label
                                        htmlFor="assignTo"
                                        className="block text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Designer
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-white">
                                        {data?.designer?.name}
                                    </p>
                                </div>}

                                {data?.note && <div className="mb-2">
                                    <label
                                        htmlFor="assignTo"
                                        className="block text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Note
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-white">
                                        {data?.note}
                                    </p>
                                </div>}

                                {data?.managerReview && <div className="mb-2">
                                    <label
                                        htmlFor="managerReview"
                                        className="block text-sm font-medium text-red-900 dark:text-white"
                                    >
                                        Manager Review
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-white">
                                        {data?.managerReview}
                                    </p>
                                </div>}

                                {data?.adminReview && <div className="mb-2">
                                    <label
                                        htmlFor="managerReview"
                                        className="block text-sm font-medium text-red-900 dark:text-white"
                                    >
                                        Admin Review
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-white">
                                        {data?.adminReview}
                                    </p>
                                </div>}

                                {data?.review && <div className="mb-2">
                                    <label
                                        htmlFor="managerReview"
                                        className="block text-sm font-medium text-red-900 dark:text-white"
                                    >
                                        Client Review
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-white">
                                        {data?.review}
                                    </p>
                                </div>}

                                {
                                    data.design && (
                                        <>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Design
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => window.open(typeof data.design === 'string' ? import.meta.env.VITE_SERVER_URL + data.design : URL.createObjectURL(data.design))}
                                                className="w-full bg-gray-100 rounded-lg mb-1 my-2">
                                                <div className="flex items-center justify-center border px-2 py-1">
                                                    <div className="flex justify-between items-center w-full">
                                                        {
                                                            ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', '3gp', 'webm'].includes(extention(data.design)) &&
                                                            <FaRegFileVideo
                                                                className="w-6 h-6"
                                                            />
                                                        }
                                                        {
                                                            ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extention(data.design)) &&
                                                            <HiOutlineDocument
                                                                className="w-6 h-6"
                                                            />
                                                        }
                                                        {
                                                            ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extention(data.design)) &&
                                                            <img
                                                                src={typeof data.design === 'string' ? import.meta.env.VITE_SERVER_URL + data.design : URL.createObjectURL(data.design)}
                                                                className="object-cover w-10 h-10"
                                                                alt="img"
                                                            />
                                                        }
                                                        {
                                                            !['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', '3gp', 'webm', 'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extention(data.design)) &&
                                                            <HiOutlineDocument
                                                                className="w-6 h-6"
                                                            />
                                                        }

                                                        <FiDownload
                                                            className="w-6 h-6 text-blue-600 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </button>
                                        </>
                                    )
                                }

                                {/************************************* Assignment Work here **************************************/}

                                {(user.role.includes("admin") || user.role.includes("manager")) && (<>
                                    <LineText
                                        label={user.role == "admin" ? "For Admin" : "For Account Manager"}
                                    />

                                    {/* Designer Assigned only for manager */}
                                    <>
                                        {
                                            data.status === 'active' && user.role.includes("manager") && (
                                                <div className="mb-2">
                                                    <label
                                                        htmlFor="assignTo"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Designer
                                                    </label>
                                                    <select
                                                        id="assignTo"
                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        onChange={(e) =>
                                                            setData({ ...data, designer: e.target.value })
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        {
                                                            editors.map((editor) => (
                                                                <option value={editor._id} key={editor._id} >{editor.email}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {
                                                        errors.assignTo && (
                                                            <p className="text-red-500 text-xs italic">{errors.assignTo}</p>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                        {
                                            data.status === 'active' && user.role.includes("manager") && (
                                                <button
                                                    type="button"
                                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2"
                                                    onClick={() => {
                                                        assignToDesigner()
                                                    }}
                                                >
                                                    Assign
                                                </button>
                                            )
                                        }
                                    </>

                                    {/* Note for manager and admin */}
                                    <>
                                        {
                                            (data.status !== 'submitted') && (
                                                <div className="mb-2">
                                                    <label
                                                        htmlFor="message"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Note
                                                    </label>
                                                    <textarea
                                                        id="message"
                                                        rows="4"
                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Write your thoughts here..."
                                                        value={data.note}
                                                        onChange={(e) =>
                                                            setData({ ...data, note: e.target.value })
                                                        }
                                                    ></textarea>
                                                </div>
                                            )
                                        }
                                        {
                                            data.status !== 'submitted' && (
                                                <button
                                                    type="button"
                                                    className="w-full mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    onClick={() => {
                                                        handleSubmit({
                                                            note: data.note
                                                        })
                                                    }}
                                                >
                                                    Write a Note
                                                </button>
                                            )
                                        }
                                    </>

                                    {/* Review for Manager */}
                                    <>
                                        {
                                            data.status === 'submitted-to-manager' && user.role.includes("admin") && (
                                                <div className="mb-2">
                                                    <label
                                                        htmlFor="message"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Manager Review
                                                    </label>
                                                    <textarea
                                                        id="message"
                                                        rows="4"
                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Write your thoughts here..."
                                                        value={data.managerReview}
                                                        onChange={(e) =>
                                                            setData({ ...data, managerReview: e.target.value })
                                                        }
                                                    ></textarea>
                                                </div>
                                            )}
                                        {
                                            data.status == 'submitted-to-manager' && user.role.includes("manager") && (
                                                <button
                                                    type="button"
                                                    className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                    onClick={() => {
                                                        submitToAdmin()
                                                    }}
                                                >
                                                    Accept
                                                </button>
                                            )
                                        }
                                        {
                                            data.status == 'submitted-to-manager' && user.role.includes("manager") && (
                                                <button
                                                    type="button"
                                                    className="w-full mt-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                    onClick={() => {
                                                        handleSubmit({
                                                            status: 'in-progress',
                                                            managerReview: data.managerReview
                                                        })
                                                    }}
                                                >
                                                    Reject
                                                </button>
                                            )
                                        }
                                    </>

                                    {/* Review for Admin */}
                                    <>
                                        {
                                            data.status === 'submitted-to-admin' && user.role.includes("admin") && (
                                                <div className="mb-2">
                                                    <label
                                                        htmlFor="message"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Admin Review
                                                    </label>
                                                    <textarea
                                                        id="message"
                                                        rows="4"
                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Write your thoughts here..."
                                                        value={data.adminReview}
                                                        onChange={(e) =>
                                                            setData({ ...data, adminReview: e.target.value })
                                                        }
                                                    ></textarea>
                                                </div>
                                            )}
                                        {
                                            data.status == 'submitted-to-admin' && user.role.includes("admin") && (
                                                <button
                                                    type="button"
                                                    className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                    onClick={() => {
                                                        handleSubmit({
                                                            status: 'approved-from-admin',
                                                            adminReview: data.adminReview
                                                        })
                                                    }}
                                                >
                                                    Accept
                                                </button>
                                            )
                                        }
                                        {
                                            data.status == 'submitted-to-admin' && user.role.includes("admin") && (
                                                <button
                                                    type="button"
                                                    className="w-full mt-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                    onClick={() => {
                                                        handleSubmit({
                                                            status: 'in-progress',
                                                            adminReview: data.adminReview
                                                        })
                                                    }}
                                                >
                                                    Reject
                                                </button>
                                            )
                                        }
                                    </>
                                </>
                                )}

                                {
                                    user.role.some(role => ['designer', 'admin', 'manager'].includes(role)) && ['active', 'in-progress', 'approved-from-admin'].includes(data.status) && (
                                        <>
                                            <label
                                                htmlFor="file"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"

                                            >
                                                Design
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => inputRef.current.click()}
                                                className="flex w-full mb-2 justify-center px-6 pt-5 pb-5 border-2 border-gray-300 border-dashed rounded-md">
                                                <div className="space-y-1 text-center">
                                                    <div className="flex text-sm text-gray-600">

                                                        <label
                                                            htmlFor="file-upload"
                                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:text-white"
                                                        >
                                                            <span>Upload file</span>
                                                        </label>

                                                    </div>
                                                </div>
                                            </button>
                                            {
                                                errors.design && (
                                                    <p className="text-red-500 text-xs italic">{errors.design}</p>
                                                )
                                            }
                                            <input
                                                id="file"
                                                ref={inputRef}
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    setDesign(e.target.files[0])
                                                }}
                                            />

                                            {
                                                design && (
                                                    <button
                                                        type="button"
                                                        onClick={() => window.open(typeof design === 'string' ? import.meta.env.VITE_SERVER_URL + design : URL.createObjectURL(design))}
                                                        className="w-full bg-gray-100 rounded-lg mb-1 my-2">
                                                        <div className="flex items-center justify-center border px-2 py-1">
                                                            <div className="flex justify-between items-center w-full">
                                                                {
                                                                    ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', '3gp', 'webm'].includes(extention(design)) &&
                                                                    <FaRegFileVideo
                                                                        className="w-6 h-6"
                                                                    />
                                                                }
                                                                {
                                                                    ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extention(design)) &&
                                                                    <HiOutlineDocument
                                                                        className="w-6 h-6"
                                                                    />
                                                                }
                                                                {
                                                                    ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extention(design)) &&
                                                                    <img
                                                                        src={typeof design === 'string' ? import.meta.env.VITE_SERVER_URL + design : URL.createObjectURL(design)}
                                                                        className="object-cover w-10 h-10"
                                                                        alt="img"
                                                                    />
                                                                }
                                                                {
                                                                    !['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', '3gp', 'webm', 'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extention(design)) &&
                                                                    <HiOutlineDocument
                                                                        className="w-6 h-6"
                                                                    />
                                                                }

                                                                <FiDownload
                                                                    className="w-6 h-6 text-blue-600 cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            }

                                            {
                                                data.status == 'approved-from-admin' ? (
                                                    <button
                                                        type="button"
                                                        className="mt-2 w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                        onClick={() => {
                                                            submitToClient()
                                                        }}
                                                    >
                                                        Submit to Client
                                                    </button>
                                                )
                                                    : (
                                                        <button
                                                            type="button"
                                                            className="w-full text-white mt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            onClick={
                                                                () => {
                                                                    console.log(user.role)
                                                                    if (user.role.includes("designer")) {
                                                                        submitToManager()
                                                                    } else if (user.role.includes("manager")) {
                                                                        submitToAdmin()
                                                                    } else if (user.role.includes("admin")) {
                                                                        submitToClient()
                                                                    }
                                                                }
                                                            }
                                                        >
                                                            Submit
                                                        </button>
                                                    )
                                            }

                                        </>
                                    )
                                }

                                {
                                    user.role.includes("manager") &&
                                    <>
                                        {
                                            data.status == 'approved-from-client' && (
                                                <>

                                                    <div className="mb-2">
                                                        <label
                                                            htmlFor="assignTo"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Printing Resource
                                                        </label>
                                                        <select
                                                            id="assignTo"
                                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            onChange={(e) =>
                                                                setData({ ...data, printer: e.target.value })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {
                                                                printers.map((editor) => (
                                                                    <option value={editor._id} key={editor._id} >{editor.email}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        {
                                                            errors.assignTo && (
                                                                <p className="text-red-500 text-xs italic">{errors.assignTo}</p>
                                                            )
                                                        }
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2"
                                                        onClick={() => {
                                                            assignToPrinter()
                                                        }}
                                                    >
                                                        Assign
                                                    </button>

                                                </>
                                            )
                                        }
                                        {
                                            data.status == 'printed' && (
                                                <>

                                                    <div className="mb-2">
                                                        <label
                                                            htmlFor="assignTo"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Delivery Resource
                                                        </label>
                                                        <select
                                                            id="assignTo"
                                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            onChange={(e) =>
                                                                setData({ ...data, shipping: e.target.value })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {
                                                                delivery.map((editor) => (
                                                                    <option value={editor._id} key={editor._id} >{editor.email}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        {
                                                            errors.delievery && (
                                                                <p className="text-red-500 text-xs italic">{errors.assignTo}</p>
                                                            )
                                                        }
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2"
                                                        onClick={() => {
                                                            assignToShipping()
                                                        }}
                                                    >
                                                        Assign
                                                    </button>

                                                </>
                                            )
                                        }
                                    </>
                                }

                                {
                                    user.role.includes("printing") && data.status === "ready-to-print" &&
                                    <>
                                        <button
                                            type="button"
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2"
                                            onClick={() => {
                                                taskPrinted()
                                            }}
                                        >
                                            Printed
                                        </button>

                                    </>

                                }

                                {
                                    user.role.includes("shipping") && data.status === "ready-to-deliver" &&
                                    <>
                                        <button
                                            type="button"
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2"
                                            onClick={() => {
                                                taskShipped()
                                            }
                                            }
                                        >
                                            Delivered
                                        </button>

                                    </>

                                }

                                <p className="text-green-500 text-sm mt-2 text-center">
                                    Task <span className=" capitalize ">{data.status && data.status.replace('-', " ")}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </CustomModal>
            )
            }
        </div >
    );
}

const getText = (status) => {
    switch (status) {
        case 'pending':
            return 'Assign'
        case 'submitted':
            return 'Accept'
        case 'active':
            return 'Write a Note'
        default:
            return 'Submit'
    }
}

const Validation = (data, files) => {
    let errors = {};

    if (!data.name) errors.name = "Name is required";
    if (!data.email) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email is invalid";
    if (!data.description) errors.description = "Description is required";
    if (!data.assignTo) errors.assignTo = "Assign To is required";
    if (!files.length) errors.file = "File is required";

    return errors;
};

function Container({ children, label, container, value }) {
    return (
        <div
            className={container ? container : "py-[4px] my-[4px] md:col-span-2"}
        >
            <label class="text-[#2C3345] text-[16px] font-medium mb-[14px]">{label}</label>
            <p className="text-gray-500 text-sm ">
                {value}
            </p>
            {children}

        </div>
    )
}

function ImagesInput({ label, containerClass, images }) {

    return (
        <div className={containerClass + " md:col-span-2 mb-5"}>
            <label class="text-[#2C3345] text-[16px] font-medium mb-[14px]">{label}</label>
            <div>
                {images.length === 0 &&
                    <p className="text-gray-500 text-sm ">N/A</p>
                }
                {
                    images.map((image, index) => {
                        return (
                            <div className="flex items-center justify-between my-2 bg-slate-50 rounded p-2">
                                <img
                                    src={image.file ? import.meta.env.VITE_SERVER_URL + image.file : URL.createObjectURL(image)}
                                    alt="image"
                                    className="w-[50px] h-auto"
                                />
                                <p className="text-gray-500 text-sm">{image.name}</p>
                                <a
                                    href={import.meta.env.VITE_SERVER_URL + image.file}
                                    download
                                    target='_blank'
                                    rel="noreferrer"
                                    type='button'
                                    className="text-green-500 text-sm"
                                >
                                    Download
                                </a>
                            </div>
                        )
                    }
                    )
                }
            </div>

        </div>
    )
}


export default ViewModal;