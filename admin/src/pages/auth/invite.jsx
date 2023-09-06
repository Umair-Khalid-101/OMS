import React from 'react'
import './index.scss'
import { Images } from '../../components/Images'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/authHook';

export default function Invite() {

    const { token } = useParams();
    const { Logout } = useAuth()
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) return toast.error('Please enter your name')

        setLoading(true)
        await axios.post('user/accept-editor', { token: token, name })
            .then(res => {
                toast.success('Invite accepted')
                toast.success('Redirecting to login page')
                Logout()
                navigate('/login')
            })
            .catch(err => {
                console.log(err)
            }).finally(() => { setLoading(false) })
    };


    return (
        <div className='login-background'>
            {/* google login button with icons */}
            <form onSubmit={handleSubmit} className='invite-box'>

                <div className='invite-box__header'>

                </div>

                <div className='invite-box__body'>
                    <div className='invite-box__body__title'>
                        <h1 className='invite-box__body__title__text'>Welcome to the team!</h1>
                    </div>
                    <div className='invite-box__body__subtitle'>
                        <h2 className='invite-box__body__subtitle__text'>Please accept the invite to continue</h2>
                    </div>
                </div>

                <input
                    type="name"
                    name="name"
                    placeholder="Name"
                    className="invite-box__input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {
                    !loading ?
                        <button
                            className="google-login-button justify-center items-center mt-4"
                        >
                            <span className="google-login-button__text ml-4">Accept Invite</span>
                        </button>
                        :
                        <button
                            disabled
                            className="google-login-button justify-center items-center mt-4"
                        >
                            <span className="google-login-button__text ml-4">Loading...</span>
                        </button>
                }
            </form>

        </div>
    )
}
