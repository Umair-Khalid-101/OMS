import React, { useEffect, useMemo, useRef, useState } from 'react'
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import CreatableSelect from 'react-select/creatable';
import { AiTwotoneEdit } from 'react-icons/ai';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { FiTrash2 } from 'react-icons/fi';
import JoditEditor from 'jodit-react';

export function TextInput({ label, name, placeholder, value, onChange, type = "text", className = "", containerClass = "mb-3", error }) {

    return (
        <div
            className={containerClass}
        >
            <label htmlFor="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <input
                id={name}
                class={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${error ? "border-red-500 " : "border-gray-300 "} ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                type={type}
            />
            {
                error && (
                    <p className="text-red-500 text-sm ">
                        {error}
                    </p>
                )
            }
        </div>
    )
}

export const DescriptionIput = ({ label, name, placeholder, value, onChange, type = "text", className = "", containerClass = "", error }) => {

    const editor = useRef(null);

    return (
        <div
            className={containerClass}
        >
            <label htmlFor="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <div className={error ? 'border border-red-500 rounded' : ""}>
                <JoditEditor
                    ref={editor}
                    value={value}
                    onBlur={onChange}
                    className='border-red-500'
                    style={{
                        borderColor: 'red',
                        borderWidth: 1,
                    }}
                />
            </div>
            {
                error && (
                    <p className="text-red-500 text-sm ">
                        {error}
                    </p>
                )
            }
        </div>
    )
}

export const TextArea = ({ label, name, placeholder, value, onChange, type = "text", className = "", containerClass = "", error }) => {
    return (
        <div
            className={containerClass}
        >
            <label htmlFor="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <textarea
                id={name}
                class={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${error ? "border-red-500" : "border-gray-300"}  ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                type={type}
            />
            {
                error && (
                    <p className="text-red-500 text-sm ">
                        {error}
                    </p>
                )
            }
        </div>
    )
}

export const CrtSelect = ({ label, name, placeholder, value, onChange, className, containerClass, error }) => {
    return (
        <div
            className={containerClass}
        >
            <label htmlFor="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <CreatableSelect
                isClearable
                options={[]}
                isMulti
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                styles={{
                    control: (base) => ({
                        ...base,
                        border: error ? "1px solid #e53e3e" : "1px solid #d2d6dc",
                    })
                }}
            />
            {
                error && (
                    <p className="text-red-500 text-sm ">
                        {error}
                    </p>
                )
            }
        </div>
    )
};

export const CoverImageInput = ({ label, containerClass, image, setImage, error, link }) => {

    const inputRef = React.useRef(null);
    const [preview, setPreview] = React.useState(null);


    const handleUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
        // const fileIsValid = validateFile(file);
        // setIsValid(fileIsValid);
        // if (fileIsValid) {
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        // }


    }

    return (
        <div
            className={containerClass}
        >
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <label htmlFor="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <div className={`bg-gray-200 rounded  border border-dashed h-[150px] relative w-[100% ${error ? "border-red-500" : "border-gray-700"}`}>
                {
                    image ? (
                        <>
                            <button
                                type="button"
                                onClick={() => inputRef.current.click()}
                                className="text-white text-2xl absolute top-0 right-0 mr-5 mt-5"
                            >
                                <AiTwotoneEdit />
                            </button>
                            <img src={preview} className="h-[150px] w-[100%] object-contain" />
                        </>
                    ) : (
                        <div className="h-[150px] w-[100%]">
                            {
                                link ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => inputRef.current.click()}
                                            className="text-white text-2xl absolute top-0 right-0 mr-5 mt-5"
                                        >
                                            <AiTwotoneEdit />
                                        </button>
                                        <img src={link} className="h-[150px] w-[100%] object-contain" />
                                    </>
                                ) : (
                                    <div className='flex flex-col justify-center items-center'>
                                        <button
                                            type="button"
                                            onClick={() => inputRef.current.click()}
                                            className="text-white text-2xl float-right mr-5 mt-5"
                                        >
                                            <HiOutlinePhotograph
                                                className='text-6xl text-gray-600'
                                            />
                                        </button>
                                        <p className="text-gray-600 text-md">
                                            Upload Image
                                        </p>
                                    </div>
                                )}
                        </div>
                    )
                }
            </div>
            {
                error && (
                    <p className="text-red-500 text-sm ">
                        {error}
                    </p>
                )
            }
        </div >
    )
}

export const ImageInputArray = ({ label, containerClass, images = [], setImages, len = 0, links = [] }) => {

    const inputRef = React.useRef(null);
    const [length, setLength] = React.useState(len - links.length);

    const handleUpload = (e) => {

        const files = Array.from(e.target.files);

        if (len) {
            // if images length is greater than length then trim
            if (files.length > length) {
                const newFiles = files.slice(0, length);
                setImages((prevImages) => prevImages.concat(newFiles))
                setLength(0);

            } else {
                setImages((prevImages) => prevImages.concat(files))
                setLength((prev) => prev - files.length);
            }

        } else {
            setImages(files);
        }

    }

    const deleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((image, i) => i !== index));
        setLength((prev) => prev + 1);
    }

    return (
        <div
            className={containerClass}
        >
            <input ref={inputRef} type="file" accept="image/*" isMulti multiple className="hidden" onChange={handleUpload} />
            <label htmlFor="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <div className="bg-gray-200 rounded border-gray-700 border border-dashed min-h-[150px] relative w-[100%]">
                <div className="flex flex-wrap justify-evenly items-center min-h-[150px] w-[100%]">
                    {
                        images.length > 0 && (
                            <>
                                {
                                    images.map((image) => {
                                        return (
                                            <div className="h-[100px] w-[auto] object-cover relative">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteImage(images.indexOf(image))}
                                                    className="text-white text-2xl absolute top-[-10px] right-[-10px] bg-red-500 rounded p-1"
                                                >
                                                    <FiTrash2 className='text-[20px]' />
                                                </button>
                                                <img src={typeof image == 'string' ? import.meta.env.VITE_SERVER_URL + image : URL.createObjectURL(image)} className="h-[100px] w-[auto] object-cover" />
                                            </div>
                                        )
                                    }
                                    )
                                }
                            </>
                        )
                    }
                    {
                        len ? (
                            (length > 0 && Array.from(Array(length).keys()).map((i) => {
                                return (
                                    <button
                                        type="button"
                                        onClick={() => inputRef.current.click()}
                                        class="flex flex-col justify-center items-center">
                                        <HiOutlinePhotograph
                                            className='text-6xl text-gray-600'
                                        />
                                        <p className="text-gray-600 text-md">
                                            Upload Image
                                        </p>
                                    </button>
                                )
                            })
                            )
                        ) : (
                            <button
                                type="button"
                                onClick={() => inputRef.current.click()}
                                class="flex flex-col justify-center items-center">
                                <HiOutlinePhotograph
                                    className='text-6xl text-gray-600'
                                />
                                <p className="text-gray-600 text-md">
                                    Upload Image
                                </p>
                            </button>
                        )
                    }
                </div>

            </div>
        </div >
    )
}
