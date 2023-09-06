import axios from "axios";

import React, { useState } from "react";

import { TextInput } from "../../components/Inputs";
import useLoading from "../../hooks/useLoading";
import { toast } from "react-hot-toast";

export default function ResetPassword() {
    const [data, setData] = useState({
        oldpassword: "",
        newpassword: "",
        confirmnewpassword: "",
    });
    const { setLoading } = useLoading();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validate(data);
        setErrors(errors);

        if (Object.keys(errors).length !== 0) return;

        setLoading(true);
        await axios.patch('auth/update-password', data)
            .then(res => {
                toast.success('Password updated successfully')
                setData({
                    oldpassword: "",
                    newpassword: "",
                    confirmnewpassword: "",
                })
            }).catch(err => { console.log(err) })
            .finally(() => { setLoading(false) })

    };

    return (
        <div className="flex flex-col flex-auto w-ful h-screen">
            <div className="h-full">
                <div className="col-span-4 flex justify-center items-center">
                    <div className="min-w-[90%] md:min-w-[450px] px-8">
                        <form onSubmit={handleSubmit}>
                            {
                                errors.api && <div className="text-red-500 text-center">{errors.api}</div>
                            }
                            <div className="border mt-5 border-gray-400 block py-2 px-4 bg-white mx-1 md:mx-2 rounded-md">
                                <TextInput
                                    name="oldpassword"
                                    placeholder="Enter Your old Password"
                                    label="Old Password"
                                    type="password"
                                    value={data.oldpassword}
                                    onChange={(e) =>
                                        setData({ ...data, oldpassword: e.target.value })
                                    }
                                    error={errors.oldpassword}
                                />
                                <TextInput
                                    name="newpassword"
                                    placeholder="Enter Your New Password"
                                    label="New Password"
                                    type="password"
                                    value={data.newpassword}
                                    onChange={(e) =>
                                        setData({ ...data, newpassword: e.target.value })
                                    }
                                    error={errors.newpassword}
                                />
                                <TextInput
                                    name="confirmnewpassword"
                                    placeholder="Enter Your New Password"
                                    label="Confirm Password"
                                    type="password"
                                    value={data.confirmnewpassword}
                                    onChange={(e) =>
                                        setData({ ...data, confirmnewpassword: e.target.value })
                                    }
                                    error={errors.confirmnewpassword}
                                />
                                <button className="block bg-blue-500 hover:bg-blue-600 mt-5 text-white w-full py-2 px-8 rounded">
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
function validate(data) {
    const errors = {};

    if (!data.oldpassword) {
        errors.oldpassword = "Old password is required";
    }

    if (!data.newpassword) {
        errors.newpassword = "New password is required";
    } else if (data.newpassword.length < 6) {
        errors.newpassword = "Password must be at least 6 characters";
    }
    if (!data.confirmnewpassword) {
        errors.confirmnewpassword = "Confirm password is required";
    } else if (data.newpassword != data.confirmnewpassword) {
        errors.confirmnewpassword = "Confirm password not match";
    }

    return errors;
}