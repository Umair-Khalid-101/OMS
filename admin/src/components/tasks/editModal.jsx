import { AiOutlineDelete } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { FaRegFileVideo } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi"

import CustomModal from "../modal";
import axios from "axios";
import useApi from "../../hooks/useApi";
import { toast } from "react-hot-toast";
import useLoading from "../../hooks/useLoading";

function EditModal({ open, handleClose, getList, task }) {

  const { setLoading } = useLoading()
  const { updateImages } = useApi()
  const inputRef = React.useRef(null);
  const [editors, setEditors] = useState([])
  const [data, setData] = useState({
    name: "",
    description: "",
    assignTo: "",
    email: "",
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = Validation(data, files);
    setErrors(errors);

    if (Object.keys(errors).length) return;

    const filesRef = await updateImages(files)

    if (filesRef.status == 400) return

    await axios.patch('task/updatetask/' + task, {
      ...data,
      files: filesRef.images,
    }).then((res) => {
      toast.success('Task created successfully')
      setData({
        name: "",
        description: "",
        assignTo: "",
        email: "",
      });
      setFiles([]);
      getList()
      handleClose();
    }).catch((err) => {
      console.log(err)
    }).finally(() => { setLoading(false) })

  };

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

  useEffect(() => {

    if (!task) return

    const getTask = async () => {
      await axios.get(`task/gettask/${task}`).then((res) => {
        const { name, description, assignTo, email } = res.data.task
        setData({ name, description, assignTo, email })
        setFiles(res.data.task.files)
      }
      ).catch((err) => {
        console.log(err)
      }
      ).finally(() => { setLoading(false) })

    }

    getTask()

  }, [task, open]);

  return (
    <div>

      {open && (
        <CustomModal open={open} handleClose={handleClose}>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white w-full mt-3 ">

                <div className="mb-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter task name"
                    value={data.name}
                    onChange={(e) =>
                      setData({ ...data, name: e.target.value })
                    }
                  />
                  {
                    errors.name && (
                      <p className="text-red-500 text-xs italic">{errors.name}</p>
                    )
                  }
                </div>

                <div className="mb-2">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter email"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                  {
                    errors.email && (
                      <p className="text-red-500 text-xs italic">{errors.email}</p>
                    )
                  }
                </div>

                <div className="mb-2">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                    value={data.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  ></textarea>
                  {
                    errors.description && (
                      <p className="text-red-500 text-xs italic">{errors.description}</p>
                    )
                  }
                </div>

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
                    value={data.assignTo._id}
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


                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"

                >
                  File
                </label>
                <button
                  type="button"
                  onClick={() => inputRef.current.click()}
                  className="flex w-full justify-center px-6 pt-5 pb-5 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">

                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:text-white"
                      >
                        <span>Upload files</span>
                      </label>

                    </div>
                  </div>
                </button>
                {
                  errors.file && (
                    <p className="text-red-500 text-xs italic">{errors.file}</p>
                  )
                }
                <input
                  id="file"
                  ref={inputRef}
                  multiple
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setFiles((prev) => [...prev, ...e.target.files]);
                  }}
                />
                {
                  files && (
                    <div className="bg-white w-full mt-2">
                      {
                        files.map((file, index) => {
                          const ext = file.name ? file?.name?.split('.').pop() : file?.split('.').pop()
                          return (
                            <div className="bg-gray-100 rounded-lg mb-1" key={index}>
                              <div className="flex items-center justify-center border px-2 py-1">
                                <div className="flex justify-between items-center w-full">
                                  {
                                    ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', '3gp', 'webm'].includes(ext) &&
                                    <FaRegFileVideo
                                      className="w-6 h-6"
                                    />
                                  }
                                  {
                                    ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext) &&
                                    <HiOutlineDocument
                                      className="w-6 h-6"
                                    />
                                  }
                                  {
                                    ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext) &&
                                    <img
                                      src={typeof file === 'string' ? import.meta.env.VITE_SERVER_URL + file : URL.createObjectURL(file)}
                                      className="object-cover w-10 h-10"
                                      alt="img"
                                    />
                                  }
                                  {
                                    !['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', '3gp', 'webm', 'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext) &&
                                    <HiOutlineDocument
                                      className="w-6 h-6"
                                    />
                                  }
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFiles((prev) => {
                                        const newFiles = [...prev];
                                        newFiles.splice(index, 1);
                                        return newFiles;
                                      });
                                    }}
                                    className="w-6 h-6 text-red-500 rounded-full"
                                  >
                                    <AiOutlineDelete />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                }

                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Update Task
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

  if (!data.name) errors.name = "Name is required";
  if (!data.email) errors.email = "Email is required"
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email is invalid";
  if (!data.description) errors.description = "Description is required";
  if (!data.assignTo) errors.assignTo = "Assign To is required";
  if (!files.length) errors.file = "File is required";

  return errors;
};

export default EditModal;