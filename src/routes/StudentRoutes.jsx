import StudentLayout from "../components/layouts/MainLayouts/StudentLayout";
import Home from '../pages/student/Home/Home';
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";

const studentRoutes = [
    {path: '/student/home', element: <Home/> },
]
export function StudentRoutes() {
    return studentRoutes.map(({ path, element }) => (
        <Route
            key={path}
            path={path}
            element={
                <ProtectedRoute allowedRoles={['student']}>
                    <StudentLayout>
                        {element}
                    </StudentLayout>
                </ProtectedRoute>
            }
        />
    ));
}