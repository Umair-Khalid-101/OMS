import { AiOutlineDelete } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { FaRegFileVideo } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi"

import CustomModal from "../../components/modal";
import axios from "axios";
import useApi from "../../hooks/useApi";
import { toast } from "react-hot-toast";

function AssignTo({ open, handleClose, fetchOrders, ...props }) {

    const { email, firstname, lastname } = props.data

    const { uploadImages } = useApi()
    const inputRef = React.useRef(null);
    const [editors, setEditors] = useState([])
    const [data, setData] = useState({
        name: `${firstname} ${lastname}`,
        description: "",
        assignTo: "",
        email: email,
    });
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});

    const getEditors = async () => {
        await axios.get("user/get-manager").then((res) => {
            setEditors(res.data.users);
        }).catch((err) => {
            console.log(err);
        })

    }

    useEffect(() => {
        getEditors()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = Validation(data, files);
        setErrors(errors);

        if (Object.keys(errors).length) return;

        const filesRef = await uploadImages('images', files)

        if (filesRef.status == 400) return

        await axios.post('task/createtask', {
            ...data,
            files: filesRef.images,
            order: props.data._id
        }).then((res) => {
            toast.success('Task created successfully')
            setData({
                name: "",
                description: "",
                assignTo: "",
                email: "",
            });
            setFiles([]);
            fetchOrders()
            handleClose();
        }).catch((err) => {
            console.log(err)
        }).finally(() => { setLoading(false) })

    };

    return (
        <div>

            {open && (
                <CustomModal open={open} handleClose={handleClose}>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                            <form onSubmit={handleSubmit} className="bg-white w-full mt-3 ">

                                <div className="mb-2">
                                    <label
                                        htmlFor="assignTo"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Assign To
                                    </label>
                                    <select
                                        id="assignTo"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        // value={data.assignTo}
                                        onChange={(e) =>
                                            setData({ ...data, assignTo: e.target.value })
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

                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Create Task
                                </button>
                            </form>
                        </div>
                    </div>
                </CustomModal>
            )
            }
        </div >
    );
}

const Validation = (data, files) => {
    let errors = {};

    if (!data.assignTo) errors.assignTo = "Assign To is required";

    return errors;
};

export default AssignTo;