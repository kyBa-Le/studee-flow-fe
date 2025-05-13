import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getUser } from '../services/UserService';

export function HomeRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser();
                if (!user) {
                    navigate('/login');
                    return;
                }

                switch (user.role) {
                    case 'admin':
                        navigate('/admin/teacher-management');
                        break;
                    case 'teacher':
                        navigate('/teacher/home');
                        break;
                    case 'student':
                        navigate('/student/home');
                        break;
                    default:
                        navigate('/login');
                }
            } catch (error) {
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        null
    );
}
