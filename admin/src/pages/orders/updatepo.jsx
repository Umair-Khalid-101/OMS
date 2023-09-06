import React, { useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { BsFillCloudArrowUpFill } from 'react-icons/bs';
import useApi from '../../hooks/useApi';

export default function CreateOrder() {

    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const { uploadImage } = useApi()

    const { id } = useParams()

    const [data, setData] = React.useState({
        jersies: [],
        logo: [],
        pos: [],
        products: [],
    })
    const [newData, setNewData] = React.useState({
        poNum: ''
    })
    const [po, setPo] = React.useState([])

    const fetchOrder = async () => {
        setLoading(true)
        await axios.get(`order/${id}`).then((res) => {
            setData(res.data.order)
        }).catch((err) => {
            toast.error(err.response.data.message)
        })
            .finally(() => { setLoading(false) })
    }

    useEffect(() => {
        if (!id) return
        fetchOrder()
    }, [id])

    const updateOrder = async () => {

        if (po.length === 0 && !newData.poNum) {
            toast.error('Please upload PO form')
            return
        }

        let pos = []

        setLoading(true)

        for (let i = 0; i < po.length; i++) {
            const imgRes = await uploadImage("image", po[i]);
            pos.push({
                file: imgRes.image,
                name: po[i].name
            });
        }

        console.log(pos)

        await axios.patch(`order/${id}`, {
            pos,
            paymentStatus: 'submitted',
            poNum: newData.poNum
        }).then((res) => {
            toast.success("Order Updated Successfully")
            fetchOrder()
        }).catch((err) => {
            toast.error(err.response.data.message)
        }).finally(() => {
            setLoading(false)
        })

    }


    return (
        <div className='min-h-screen w-screen flex justify-center items-center bg-slate-100 py-5'>
            <div className="bg-white min-h-[90vh] w-[90vw] md:w-[50vw] p-5">

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
                        label=" shipping to home or school (choose one)"
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

                    <ImagesPreview
                        label="Picture of Jersey (front or back, whichever one you want displayed)"
                        images={data.jersies || []}
                    />

                    <Container
                        label="Name Plate Info for ALL Jerseys Being Ordered (Applies only to Hall of Fame, All Pro, and Junior All Pro Packages)"
                        value={data.namePlate || 'N/A'}
                    />

                    <ImagesPreview
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

                    <Container
                        label="Payment (please choose one)"
                        value={data.payment === "purchase" ? "Purchase Order" : "Credit Card"}
                    />

                    {
                        data.payment === 'purchase' && (data.pos.length > 0 || data.poNum) ?

                            <ImagesPreview
                                label={'PLEASE UPLOAD TAX EXEMPT OR PO FORM HERE'}
                                images={data.pos || []}
                            />
                            :
                            <ImagesInput
                                label={'PLEASE UPLOAD TAX EXEMPT OR PO FORM HERE'}
                                images={po}
                                setImages={setPo}
                            />
                    }

                    {
                        data.paymentStatus !== 'pending' && data.poNum ?
                            <Container
                                label="PO Number"
                                value={data.poNum}
                            />
                            :
                            <TextInput
                                label="Po Number"
                                value={newData.poNum}
                                onChange={(e) => setNewData({ ...newData, poNum: e.target.value })}
                            />
                    }

                    {
                        data.payment === "purchase" && data.pos.length === 0 && !data.poNum &&
                        <div className="md:col-span-2 flex justify-center">

                            {
                                loading ?
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white self-center py-2 px-4 rounded my-5"
                                    >
                                        <span id="button-text">
                                            {"Updating..."}
                                        </span>
                                    </button>
                                    :
                                    <button
                                        onClick={() => {
                                            updateOrder(data._id)
                                        }}
                                        className="bg-blue-500 hover:bg-blue-700 text-white self-center py-2 px-4 rounded my-5"
                                    >
                                        <span id="button-text">
                                            {"Upload PO Form"}
                                        </span>
                                    </button>
                            }
                        </div>
                    }

                </div>
            </div>
        </div>

    )
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

function ImagesPreview({ label, containerClass, images }) {

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

function ImagesInput({ label, name, error, containerClass, images, setImages, required }) {
    const inpRef = React.useRef(null);
    return (
        <div className={containerClass + " md:col-span-2 mb-5"}>
            <label htmlFor={name} class="text-[#2C3345] text-[16px] font-medium mb-[14px]">{label} {required && <span className='text-red-500'>*</span>}</label>
            <button
                type='button'
                onClick={() => inpRef.current.click()}
                className={`flex w-full flex-col items-center justify-center h-[20vh] bg-slate-100 rounded border border-dashed ${error ? " border-red-500" : " border-gray-800"}  `}>
                <BsFillCloudArrowUpFill className="text-4xl text-gray-400" />
                <p
                    className="text-gray-400 text-sm"
                >Browse Files</p>
            </button>

            <input
                ref={inpRef}
                class={`hidden`}
                type="file"
                accept='image/*'
                multiple
                onChange={(e) => {
                    const files = e.target.files;
                    const filesArr = Array.from(files);
                    setImages([...images, ...filesArr]);
                }}
            />
            {
                error && (
                    <p className="text-red-500 text-sm ">
                        {error}
                    </p>
                )
            }
            <div>
                {
                    images.map((image, index) => {
                        return (

                            <div className="flex items-center justify-between my-2 bg-slate-50 rounded p-2">
                                {
                                    <img
                                        src={image.file ? image.file : URL.createObjectURL(image)}
                                        alt="image"
                                        className="w-[50px] h-auto"
                                    />
                                }
                                <p className="text-gray-500 text-sm">{image.name}</p>
                                <button
                                    type='button'
                                    onClick={() => {
                                        const newImages = [...images];
                                        newImages.splice(index, 1);
                                        setImages(newImages);
                                    }}
                                    className="text-red-500 text-sm"
                                >Remove</button>
                            </div>
                        )
                    }
                    )
                }
            </div>

        </div>
    )
}

function TextInput({ label, name, placeholder, value, onChange, type = "text", className = "", ariaLabel, error, required, containerClassName }) {

    return (
        <div
            className={"px-[10px] py-[12px] my-[12px] mx-[4px] " + containerClassName}
        >
            {label && <label htmlFor={name} class="text-[#2C3345] text-[16px] font-medium mb-[14px]">{label} {required && <span className='text-red-500'>*</span>}</label>}
            <input
                id={name}
                class={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${error ? "border-red-500 " : "border-gray-300 "} ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                type={type}
            />
            {
                ariaLabel && (
                    <p className="text-gray-500 text-sm ">
                        {ariaLabel}
                    </p>
                )
            }
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
