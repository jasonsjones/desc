import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const authCtx = useAuthContext();
    const isAdmin = authCtx.contextUser && authCtx.contextUser.roles.includes('admin');
    return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
