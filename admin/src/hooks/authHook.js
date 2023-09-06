import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const useAuth = () => {
    const { Login, Logout, token, user, profile, getProfile, getProfile2 } =
        useContext(AuthContext);

    return { Login, Logout, token, user, isLoggedIn: !!token, profile, getProfile, getProfile2, };
};

export default useAuth;