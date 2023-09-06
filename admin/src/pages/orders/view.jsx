import React from 'react'
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../components/modal';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CreateOrder({ open, handleClose, data }) {

    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const sendReminder = async (id) => {
        setLoading(true)
        await axios.post(`order/send-reminder/${id}`).then((res) => {
            toast.success(res.data.message)
        }).catch((err) => {
            toast.error(err.response.data.message)
        }).finally(() => {
            setLoading(false)
        })
    }


    return (
        <CustomModal
            open={open}
            handleClose={handleClose}
        >
            <div className="bg-white min-h-[90vh] w-[90vw] md:w-[50vw]">

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

                    <Container
                        label="Payment (please choose one)"
                        value={data.payment === "purchase" ? "Purchase Order" : "Credit Card"}
                    />

                    <ImagesInput
                        label={'PLEASE UPLOAD TAX EXEMPT OR PO FORM HERE'}
                        images={data.pos || []}
                    />

                    <Container
                        label="Po Number"
                        value={data.poNum || 'N/A'}
                    />

                    {
                        data.payment === "purchase" && data.pos.length === 0 && !data.poNum &&
                        <div className="md:col-span-2 flex justify-center">
                            {
                                loading ?
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white self-center py-2 px-4 rounded my-5"
                                    >
                                        <span id="button-text">
                                            {"Sending Reminder..."}
                                        </span>
                                    </button>
                                    :
                                    <button
                                        onClick={() => {
                                            sendReminder(data._id)
                                        }}
                                        className="bg-blue-500 hover:bg-blue-700 text-white self-center py-2 px-4 rounded my-5"
                                    >
                                        <span id="button-text">
                                            {"Remind User"}
                                        </span>
                                    </button>
                            }
                        </div>
                    }

                </div>
            </div>
        </CustomModal>
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


