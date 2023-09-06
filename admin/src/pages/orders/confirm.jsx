import React, { useEffect } from 'react'
import exp from '../../assets/order.gif'
import { useNavigate } from 'react-router-dom';

export default function Confirm() {

    const navigate = useNavigate();

    useEffect(() => {

        setTimeout(() => {
            navigate('/create-new-order')
        }, 3000)

    }, [])

    return (
        <div className="w-screen h-screen bg-slate-100 flex justify-center items-center">
            <div className="flex flex-col p-5 justify-center items-center bg-white">
                <img
                    src={exp}
                    alt="order"
                    className="w-[400px] h-auto"
                />
                <p className="text-gray-500 text-sm text-center">
                    Your order has been placed successfully. We will get back to you soon.
                </p>
            </div>


        </div>
    )
}
