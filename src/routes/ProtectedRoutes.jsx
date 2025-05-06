import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser } from '../services/UserService';
import Loading from '../components/ui/Loading/Loading'

export function ProtectedRoute({ children, allowedRoles }) {
    const [user, setUser] = useState({}); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUser();
                setUser(res);
            } catch (e) {
                setUser(null);
            } finally {
                setIsLoading(false); 
            }
        };

        fetchUser();
    }, []);

    if (isLoading) {
        return <div><Loading/></div>;
    }
    console.log(user)
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}