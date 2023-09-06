import { FiDownload } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { FaRegFileVideo } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi"

import axios from "axios";
import { toast } from "react-hot-toast";
import useLoading from "../../hooks/useLoading";
import useAuth from "../../hooks/authHook";
import LineText from "../../components/lineText";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router-dom";

function ViewModal() {

    const { task } = useParams()
    const { setLoading } = useLoading()
    const [data, setData] = useState({
        name: "",
        description: "",
        assignTo: "",
        email: "",
        products: [],
    });

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

    const handleUpdate = async (data) => {
        setLoading(true)

        await axios.patch(`task/updatetask/${task}`, data).then((res) => {
            toast.success("Task Updated Successfully")
            getTask()
        }
        ).catch((err) => {
            console.log(err)
        }
        ).finally(() => { setLoading(false) })

    }

    useEffect(() => {

        if (!task) return

        getTask()

    }, [task]);

    const extention = (file) => {
        const ext = file?.name ? file?.name?.split('.').pop() : file?.split('.').pop()

        return ext
    }

    return (
        <div className="bg-white">
            <div className="grid md:grid-cols-3 gap-6 p-5">
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

                        <LineText
                            label="For Client"
                        />

                        <p className="text-sm text-gray-600 dark:text-white capitalize text-center ">
                            {data?.status}
                        </p>

                        {
                            data.status === 'submitted' && (
                                <div className="mb-2">
                                    <label
                                        htmlFor="message"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Review
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Write your thoughts here..."
                                        value={data.review}
                                        onChange={(e) =>
                                            setData({ ...data, review: e.target.value })
                                        }
                                    ></textarea>
                                </div>
                            )
                        }



                        {
                            data.status === 'submitted' && (
                                <button
                                    type="button"
                                    className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    onClick={() => {
                                        handleUpdate({
                                            status: 'approved-from-client',
                                            review: data.review
                                        })
                                    }}
                                >
                                    Accept
                                </button>
                            )
                        }
                        {
                            data.status === 'submitted' && (
                                <button
                                    type="button"
                                    className="w-full mt-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                    onClick={() => {
                                        handleUpdate({
                                            status: 'in-progress',
                                            review: data.review,
                                            submittedBy: ''
                                        })
                                    }}
                                >
                                    Reject
                                </button>
                            )
                        }


                    </div>
                </div>
            </div>
        </div >
    );
}

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