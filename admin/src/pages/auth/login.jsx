import React from 'react'
import './index.scss'
import useAuth from '../../hooks/authHook';
import useLoading from '../../hooks/useLoading';
import axios from "axios";
import toast from 'react-hot-toast';

export default function Login() {

    const { Login } = useAuth();
    const { loading, setLoading } = useLoading();

    const [data, setData] = React.useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        await axios.post("auth/login", data)
            .then((res) => {

                // if (res.data.user.role !== 'admin' && res.data.user.role !== 'manager' && res.data.user.role !== 'designer') {
                //     toast.error("You are not authorized to login here");
                //     return
                // }

                const acceptedRoles = ['admin', 'manager', 'designer', 'printing', 'shipping'];
                const userRoles = res.data.user.role;

                if (!userRoles.some(role => acceptedRoles.includes(role))) {
                    toast.error("You are not authorized to login here");
                    return;
                }

                Login(res.data.user, res.data.token);
            })
            .catch((err) => { console.log(err) })
            .finally(() => { setLoading(false) })

    };


    return (
        <div className='login-background'>
            {
                loading && <div className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.1)] flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            }
            <div className='invite-box'>

                <div className='invite-box__header'>

                </div>

                <div className='invite-box__body'>
                    <div className='invite-box__body__title text-center'>
                        {/* Login  */}
                        <h1 className='invite-box__body__title__text'>Login</h1>

                        <input
                            type="text"
                            placeholder="Email"
                            className="invite-box__body__title__text__input"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="invite-box__body__title__text__input"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />

                        <button
                            onClick={handleSubmit}
                            className="google-login-button justify-center items-center mt-4 w-full hover:border border-black  mb-5"
                        >
                            <span className="google-login-button__text ml-4">Login</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
