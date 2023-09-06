import React, { useEffect } from 'react'
import { productsData } from './data';
import { BsFillCloudArrowUpFill } from 'react-icons/bs';
import orders from '../../assets/orders.png'
import useApi from '../../hooks/useApi';
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const apikey = import.meta.env.UPS_API_KEY

export default function CreateOrder() {

    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [pay, setPay] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [data, setData] = React.useState({
        customer: "",
        aboutUs: "",
        reOrder: "",
        shipping: "",
        sport: "",
        firstname: "",
        lastname: "",
        phone: "",
        school: "",
        email: "",
        shippingAddress: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        products: [],
        framed: "1",
        face: "",
        jerseyBack: "",
        players: "",
        namePlate: "",
        font: "",
        colors: "",
        date: "",
        payment: "",
        poNum: "",
    });
    console.log("Data:",data);
    const [jersy, setJersy] = React.useState([]);
    const [po, setPo] = React.useState([]);
    const [logo, setLogo] = React.useState([]);
    const [price, setPrice] = React.useState(0);
    const [clientSecret, setClientSecret] = React.useState(null);
    const [shippingCost,setShippingCost] = React.useState(null)

    const { uploadImage } = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = getValidation(data, jersy);

        setErrors(errors);
        console.log(errors);
        if (Object.keys(errors).length > 0) return

        let newJersy = [];

        setLoading(true);

        for (let i = 0; i < jersy.length; i++) {
            const imgRes = await uploadImage("image", jersy[i]);
            newJersy.push({
                file: imgRes.image,
                name: jersy[i].name
            });
        }

        let newPo = [];

        for (let i = 0; i < po.length; i++) {
            const imgRes = await uploadImage("image", po[i]);
            newPo.push({
                file: imgRes.image,
                name: po[i].name
            });
        }

        let newLogo = [];

        for (let i = 0; i < logo.length; i++) {
            const imgRes = await uploadImage("image", logo[i]);
            newLogo.push({
                file: imgRes.image,
                name: logo[i].name
            });
        }

        const finalData = {
            ...data,
            jersies: newJersy,
            pos: newPo,
            logo: newLogo,
            total: ((price * (data.framed || 1)) + 25).toFixed(2)
        }

        console.log(finalData);

        await axios.post("order", finalData).then((res) => {

            if (res?.data?.paymentInfo?.clientSecret) {
                setPay(true)
                setClientSecret(res?.data?.paymentInfo?.clientSecret || null);
            } else {
                navigate("/confirm-order")
                toast.success("Order Created Successfully")
            }

        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })

    }

    useEffect(() => {
        setPay(false)
    }, [data.payment])

    // CALCULATE SHIPMENT COST
    const body = {
        // shipment details
        from_address: { 
            address_line_1: 'San Fernando Valley',
            city: 'San Fernando Valley',
            state_province_code: 'CA',
            postal_code: '91340',
            country_code: 'US'
          },
        to_address: {
            address_line_1: data?.shippingAddress,
            city: data?.city,
            state_province_code: 'AL',
            postal_code: data?.zip,
            country_code: 'US'
        },
        packages: [
            {
              packaging_type: {
                code: '02' // Customer packaging
              },
              dimensions: {
                length: 10,
                width: 5,
                height: 4,
                unit: 'IN' // IN for inches
              },
              package_weight: {
                weight: 2, 
                unit: 'KGS' // KGS for kilograms 
              }
            }
          ],
      };

    const getShipmentCost = () =>{
        fetch('https://wwwcie.ups.com/rest/Rate', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'AccessLicenseNumber': apikey,
        },
        body: JSON.stringify(body)
})
.then(res => res.json())
.then(data => {
  console.log(data.rates[0].totalCharges.monetaryValue)
});
    }

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col justify-center items-center pb-10">
            {
                loading &&
                <div className="fixed top-0 left-0 w-full z-[9999] h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <BsFillCloudArrowUpFill className="text-white text-6xl animate-spin" />
                </div>
            }
            <div className="flex justify-center items-center my-10">
                <img
                    src="https://files.jotform.com/jufs/PrintJersey/form_files/FULL%20COLOR%20PMJ%20LOGO.622cda31aef917.37629269.png?md5=EPOFZkYmwTjbEorf5QhuMw&expires=1691148285"
                    alt="logo"
                    className="w-[200px] md:w-[300px] h-auto"
                />
            </div>
            <div className='bg-white w-[90vw] md:w-[50vw] p-2 md:p-5 border-b'>
                <div className='color-[#2C3345]  font-semibold text-center p-[14px] mt-[1.25em] mb-[.75em]'>
                    <p className='mb-[4px] text-[1.25em]'>
                        IMORTANT NOTICE! PLEASE READ!
                    </p>
                    <p
                        className='text-[.875em] font-medium'
                    >
                        DUE TO THE POPULARITY OF PRINT MY JERSEY AND THE LARGE AMOUNT OF ORDERS RECEIVED THIS MONTH THERE IS A TEMPORARY 4-5 WEEK TURN AROUND TIME FOR ALL NEW ORDERS. THANKS FOR UNDERSTANDING!!!
                    </p>
                </div>
                <hr />

                <div className='color-[#2C3345]  font-semibold text-center p-[14px] mt-[1.25em] mb-[.75em]'>
                    <p className='mb-[4px] text-[2em]'>
                        Print My Jersey Order Form
                    </p>
                    <p
                        className='text-[.875em] font-medium'
                    >
                        Please fill out the form below. Please list ALL players info on this form.No need to fill out multiple forms. Once received we will respond with any questions and an estimate. Next you will receive a digital preview of your framed jersey print. After approval we will send you an invoice that can be processed online. Once we receive payment or a PO#, we will ship your order.
                    </p>
                </div>
            </div>
            <div className="bg-white min-h-[90vh] w-[90vw] md:w-[50vw] p-2 md:p-5">

                <div className='color-[#2C3345]  font-semibold text-center p-[14px] mt-[1.25em] mb-[.75em]'>
                    <p className='mb-[4px] text-[2em]'>
                        Art Fee
                    </p>
                    <p
                        className='text-[.875em] font-medium'
                    >
                        $25 art fee will be added to each order to help cover the cost of recreating the jersey and updating re-ordered jerseys.
                    </p>
                </div>

                <hr />

                <img
                    src={orders}
                    alt="orders"
                    className="w-full h-auto"
                />


                <form onSubmit={handleSubmit} className='grid md:grid-cols-2'>
                    <Container
                        label="Let us know if you are a new customer"
                    >
                        <RadioOption
                            label="New Customer"
                            name="customer"
                            id="new-customer"
                            value="new"
                            onChange={(e) => setData({ ...data, customer: e.target.value })}
                        />
                        <RadioOption
                            label="Existing Customer"
                            name="customer"
                            id="existing-customer"
                            value="existing"
                            onChange={(e) => setData({ ...data, customer: e.target.value })}
                        />
                    </Container>

                    <TextInput
                        label="How did you hear about us? (Optional)"
                        value={data.aboutUs}
                        onChange={(e) => setData({ ...data, aboutUs: e.target.value })}
                    />


                    <Container
                        label="Is this a re-order using a previous years jersey?"
                    >
                        <RadioOption
                            label="Yes, this is a reorder using same jersey as last year"
                            name="reOrder"
                            id="reorder-yes"
                            value="yes"
                            onChange={(e) => setData({ ...data, reOrder: e.target.value })}
                        />
                        <RadioOption
                            label="no this is a new jersey"
                            name="reOrder"
                            id="reorder-no"
                            value="no"
                            onChange={(e) => setData({ ...data, reOrder: e.target.value })}
                        />
                    </Container>

                    <Container
                        label=" shipping to home or school (choose one)"
                    >
                        <RadioOption
                            label="Home"
                            name="shipping"
                            id="shipping-home"
                            value="home"
                            onChange={(e) => setData({ ...data, shipping: e.target.value })}
                        />
                        <RadioOption
                            label="School"
                            name="shipping"
                            id="shipping-school"
                            value="school"
                            onChange={(e) => setData({ ...data, shipping: e.target.value })}
                        />
                        <RadioOption
                            label="Other"
                            name="shipping"
                            id="shipping-other"
                            value="other"
                            onChange={(e) => setData({ ...data, shipping: e.target.value })}
                        />
                    </Container>

                    <TextInput
                        label="Sport"
                        value={data.sport}
                        onChange={(e) => setData({ ...data, sport: e.target.value })}
                        ariaLabel={`example "basketball"`}
                    />

                    <Container
                        label="Name"
                        required
                        error={errors.name}
                    >
                        <div className="md:col-span-2">
                            <div className="grid md:grid-cols-2 gap-2">
                                <Input
                                    label="First Name"
                                    value={data.firstname}
                                    onChange={(e) => setData({ ...data, firstname: e.target.value })}
                                    ariaLabel={`First Name`}
                                    error={errors.name}
                                />
                                <Input
                                    label="Last Name"
                                    value={data.lastname}
                                    onChange={(e) => setData({ ...data, lastname: e.target.value })}
                                    ariaLabel={`Last Name`}
                                    error={errors.name}
                                />
                            </div>
                        </div>
                    </Container>

                    <TextInput
                        label="Phone Number"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: inputNumber(e.target.value) })}
                        placeholder={`(xxx) xxx-xxxx`}
                        ariaLabel={`Please enter a valid phone number.`}
                        required
                        error={errors.phone}
                    />

                    <div />

                    <TextInput
                        label="School Name"
                        value={data.school}
                        onChange={(e) => setData({ ...data, school: e.target.value })}
                        required
                        error={errors.school}
                    />

                    <div />

                    <TextInput
                        label="Email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        required
                        ariaLabel={'example@example.com'}
                        error={errors.email}
                    />

                    <Container
                        container="md:col-span-2 px-[10px] mx-[4px]"
                        label="Shipping Address"
                        required
                        error={errors.shippingAddress}
                    >
                        <div className="md:col-span-2 ">
                            <div className="grid md:grid-cols-2 gap-2">
                                <Input
                                    label="Shipping Address"
                                    value={data.shippingAddress}
                                    onChange={(e) => setData({ ...data, shippingAddress: e.target.value })}
                                    required
                                    ariaLabel={`Street Address`}
                                    containerClass="md:col-span-2"
                                    error={errors.shippingAddress}
                                />
                                <Input
                                    value={data.address2}
                                    onChange={(e) => setData({ ...data, address2: e.target.value })}
                                    ariaLabel={`Street Address Line 2`}
                                    containerClass="md:col-span-2"
                                />
                                <Input
                                    value={data.city}
                                    onChange={(e) => setData({ ...data, city: e.target.value })}
                                    ariaLabel={`City`}
                                    error={errors.shippingAddress}
                                />
                                <Input
                                    value={data.state}
                                    onChange={(e) => setData({ ...data, state: e.target.value })}
                                    ariaLabel={`State/Province`}
                                    error={errors.shippingAddress}
                                />
                                <Input
                                    value={data.zip}
                                    onChange={(e) => setData({ ...data, zip: e.target.value })}
                                    ariaLabel={`Zip/Postal Code`}
                                    containerClass={`md:col-span-2`}
                                    error={errors.shippingAddress}
                                />
                            </div>
                        </div>
                    </Container>

                    <Container
                        label={'Select Which Package You are interested in ordering?'}
                        error={errors.products}
                        ariaLabel={'An amount of $25 will be added to each order for art fee'}
                    >
                        <div className="md:col-span-2 ">
                            <div className="grid md:grid-cols-2 gap-2">
                                {
                                    productsData.map((product) => {
                                        return (
                                            <CheckBox
                                                label={product.name}
                                                name={product.name}
                                                id={product.name}
                                                value={product.name}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData({ ...data, products: [...data.products, product.name] })
                                                        // setPrice((prev) => prev + product.price)
                                                        setPrice(product.price)
                                                    } else {
                                                        const newProducts = data.products.filter((item) => item !== product.name);
                                                        setData({ ...data, products: newProducts })
                                                        // setPrice((prev) => prev - product.price)
                                                        setPrice(0)
                                                    }
                                                }
                                                }
                                                disabled={data.products.length && !data.products.includes(product.name)}
                                            />
                                        )
                                    }
                                    )
                                }
                            </div>
                        </div>
                    </Container>


                    <TextInput
                        label="How Many Framed Jersey Prints are Being Ordered?"
                        value={data.framed}
                        type="number"
                        onChange={(e) => setData({ ...data, framed: parseInt(e.target.value) })}
                        placeholder={'e.g. 23'}
                        error={errors.framed}
                    />

                    <Container
                        label="Do you want the front or back of the jersey re-created for your order?"
                        error={errors.face}
                        required
                    >
                        <RadioOption
                            label="Front"
                            name="face"
                            id="face-front"
                            value="front"
                            onChange={(e) => setData({ ...data, face: e.target.value })}
                        />

                        <RadioOption
                            label="Back"
                            name="face"
                            id="face-back"
                            value="back"
                            onChange={(e) => setData({ ...data, face: e.target.value })}
                        />

                    </Container>

                    <Container
                        label="If getting the back of jersey re-created, do you want to add the players last name?"
                    >
                        <RadioOption
                            label="Yes"
                            name="jerseyBack"
                            id="jerseyBack-yes"
                            value="yes"
                            onChange={(e) => setData({ ...data, jerseyBack: e.target.value })}
                        />

                        <RadioOption
                            label="No"
                            name="jerseyBack"
                            id="jerseyBack-no"
                            value="no"
                            onChange={(e) => setData({ ...data, jerseyBack: e.target.value })}
                        />

                    </Container>

                    <TextArea
                        label="Please list ALL Players last names and numbers, no need to fill out multiple forms"
                        value={data.players}
                        onChange={(e) => setData({ ...data, players: e.target.value })}
                        placeholder={'Type Here...'}
                        containerClass="md:col-span-2"
                        required
                        error={errors.players}
                    />

                    <ImagesInput
                        label="Picture of Jersey (front or back, whichever one you want displayed)"
                        images={jersy}
                        setImages={setJersy}
                        required
                        error={errors.jersy}
                    />

                    <TextArea
                        label="Name Plate Info for ALL Jerseys Being Ordered (Applies only to Hall of Fame, All Pro, and Junior All Pro Packages)"
                        value={data.namePlate}
                        onChange={(e) => setData({ ...data, namePlate: e.target.value })}
                        placeholder={'Type Here...'}
                        containerClass="md:col-span-2"
                        ariaLabel={"Example: School Name, Sport, Player Name,and Years Played"}
                    />

                    <ImagesInput
                        label={'School Logo'}
                        images={logo}
                        setImages={setLogo}
                    />

                    <TextInput
                        label="Font Name Used On Jersey (If Known)"
                        value={data.font}
                        onChange={(e) => setData({ ...data, font: e.target.value })}
                    />

                    <div />

                    <TextInput
                        label="Official School Colors"
                        value={data.colors}
                        onChange={(e) => setData({ ...data, colors: e.target.value })}
                        required
                        error={errors.colors}
                    />
                    <div />
                    <TextInput
                        label="Date Needed By"
                        value={data.date}
                        onChange={(e) => setData({ ...data, date: e.target.value })}
                        type='date'
                        ariaLabel={'Date'}
                        required
                        error={errors.date}
                    />

                    <Container
                        label="Payment (please choose one)"
                        error={errors.payment}
                    >
                        <RadioOption
                            label="Credit Card"
                            name="payment"
                            id="payment-credit"
                            value="credit"
                            onChange={(e) => setData({ ...data, payment: e.target.value })}
                        />

                        <RadioOption
                            label="Purchase Order"
                            name="payment"
                            id="payment-purchase"
                            value="purchase"
                            onChange={(e) => setData({ ...data, payment: e.target.value })}
                        />
                    </Container>

                    <ImagesInput
                        label={'PLEASE UPLOAD TAX EXEMPT OR PO FORM HERE'}
                        images={po}
                        setImages={setPo}
                    />

                    <TextInput
                        label="Po Number"
                        value={data.poNum}
                        onChange={(e) => setData({ ...data, poNum: e.target.value })}
                    />

<div className="md:col-span-2 flex justify-center items-center ">
                        {
                            clientSecret && data.payment === "credit" ?
                                <button
                                    type='button'
                                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-5"
                                >
                                    Pay Now
                                </button>
                                :
                                <>
                                <div className='flex flex-col'>
                                {/* <button 
                                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-5"
                                    onClick={getShipmentCost}
                                >
                                    Get Shipment Cost
                                </button> */}
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-5"
                                >
                                    Submit
                                </button>
                                
                                </div>
                                </>
                        }
                    </div>

                    {
                        price > 0 && data.framed > 0 &&
                        <div className="md:col-span-2 flex flex-col justify-center items-center ">
                            <p className="text-gray-500 text-[16px] font-medium mb-[14px]">${price}  x{(data.framed || 1)} = ${price * (data.framed || 1)}</p>
                            <p className="text-gray-500 text-[16px] font-medium mb-[14px]">+ $25 Art Fee</p>
                            <p className="text-gray-500 text-[16px] font-medium mb-[14px]">+ $30 Shipping Fee</p>
                            <p className="text-[#2C3345] text-[16px] font-medium mb-[14px]">Total: ${((price * (data.framed || 1)) + 25 + 30).toFixed(2)}</p>
                        </div>
                    }

                    {clientSecret && (
                        <Elements
                            options={{
                                clientSecret,
                                theme: 'stripe',
                            }}
                            stripe={stripePromise}
                        >
                            <CheckoutForm
                                data={data}
                                clientSecret={clientSecret}
                                pay={pay}
                                handleClose={() => { setPay(false) }}
                                setLoading={setLoading}
                            />
                        </Elements>
                    )
                    }

                </form>
            </div>
        </div >
    )
}

const getValidation = (data, jersy) => {

    const errors = {};

    if (!data.firstname) errors.name = "Name is required";
    else if (!data.lastname) errors.name = "Name is required";

    if (!data.phone) errors.phone = "Phone Number is required";
    else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(data.phone)) errors.phone = "Phone Number must be of format (xxx) xxx-xxxx";

    if (!data.school) errors.school = "School Name is required";

    if (!data.email) errors.email = "Email is required";

    if (!data.shippingAddress) errors.shippingAddress = "Shipping Address is required";
    if (!data.city) errors.shippingAddress = "Shipping Address is required";
    if (!data.state) errors.shippingAddress = "Shipping Address is required";
    if (!data.zip) errors.shippingAddress = "Shipping Address is required";

    if (data.products.length === 0) errors.products = "Please select atleast one product";

    if (!data.face) errors.face = "Please select atleast one option";

    if (!data.players) errors.players = "Please enter atleast one player";

    if (jersy.length === 0) errors.jersy = "Please upload atleast one image";

    if (!data.colors) errors.colors = "Please enter school colors";

    if (!data.date) errors.date = "Please enter date";

    if (!data.payment) errors.payment = "Please select atleast one option";

    if (data.framed && data.framed < 1) errors.framed = "Please enter valid number";

    return errors;

}

function Container({ children, name, label, required, container, error, ariaLabel }) {
    return (
        <div
            className={container ? container : "px-[10px] py-[12px] my-[12px] mx-[4px] md:col-span-2"}
        >
            <label htmlFor={name} class="text-[#2C3345] text-[16px] font-medium mb-[14px]">{label} {required && <span className='text-red-500'>*</span>}</label>
            {children}

            {ariaLabel && <p className="text-gray-500 text-sm ">
                {ariaLabel}
            </p>}

            {error && <p className="text-red-500 text-sm ">
                {error}
            </p>}


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

function RadioOption({ label, name, id, value, onChange, className = "mb-3" }) {
    return (
        <div class={"flex items-center " + className}>
            <input
                id={id}
                name={name}
                type="radio"
                value={value}
                onChange={onChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label for={id} class="ml-2 text-sm text-gray-900 dark:text-gray-300 color-[#2C3345] text-[.9375em] ">{label}</label>
        </div>
    )
}

function Input({ name, placeholder, value, onChange, className = "", error, type = "text", ariaLabel, containerClass }) {
    return (
        <div className={containerClass}>
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
        </div>
    )
}

const inputNumber = (value) => {
    const numericValue = value.replace(/\D/g, ''); // Remove non-digit characters

    if (numericValue.length <= 3) {
        return numericValue;
    } else if (numericValue.length <= 6) {
        return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
    } else {
        return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
    }
}

function CheckBox({ label, name, id, value, onChange, className = "mb-3", disabled }) {
    return (
        <div class={"flex items-center " + className}>
            <input
                id={id}
                name={name}
                type="checkbox"
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label for={id} class="ml-2 text-sm text-gray-900 dark:text-gray-300 color-[#2C3345] text-[.9375em] ">{label}</label>
        </div>
    )
}

function TextArea({ label, name, placeholder, value, onChange, className = "", error, type = "text", ariaLabel, containerClass, required }) {
    return (
        <div className={containerClass + " mb-10"}>
            <label htmlFor={name} class="text-[#2C3345] text-[16px] font-medium mb-[14px]">{label} {required && <span className='text-red-500'>*</span>}</label>
            <textarea
                id={name}
                class={`bg-gray-50 border text-gray-900 min-h-[100px] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${error ? "border-red-500 " : "border-gray-300 "} ${className}`}
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


