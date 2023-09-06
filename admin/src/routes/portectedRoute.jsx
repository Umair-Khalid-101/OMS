import { Navigate } from 'react-router-dom';

import useAuth from '../hooks/authHook';

const ProtectedRoute = ({ component }) => {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return component;
    }

    return <Navigate to="/login" />;
};

export default ProtectedRoute;