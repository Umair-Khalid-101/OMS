import { Navigate } from 'react-router-dom';

import useAuth from '../hooks/authHook';

const AuthRoute = ({ component }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return component;
    }

    return <Navigate to="/" />;
};

export default AuthRoute;