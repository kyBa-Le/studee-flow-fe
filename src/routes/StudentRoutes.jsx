import StudentLayout from "../components/layouts/MainLayouts/StudentLayout";
import Home from '../pages/student/Home/Home';
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { SelfStudy } from "../pages/student/LearningJournal/SelfStudy";
import { LearningJournalLayout } from "../pages/student/LearningJournal/LearningJournalLayout";

const studentRoutes = [
    {path: '/student/home', element: <Home/> },
    {path: '/student/learning-journal', element: <LearningJournalLayout><SelfStudy/></LearningJournalLayout> },
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