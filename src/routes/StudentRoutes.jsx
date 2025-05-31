import StudentLayout from "../components/layouts/MainLayouts/StudentLayout";
import Home from '../pages/student/Home/Home';
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { SelfStudy } from "../pages/student/LearningJournal/SelfStudy";
import { Notification } from "../pages/student/Notification/Notification";
import { LearningJournalLayout } from "../pages/student/LearningJournal/LearningJournalLayout";
import { SemesterGoal } from "../pages/student/SemesterGoal/SemesterGoal";
import Profile from "../pages/student/Profile/Profile";

const studentRoutes = [
    {path: '/student/home', element: <Home/> },
    {path: '/student/learning-journal', element: <LearningJournalLayout></LearningJournalLayout> },
     {path: '/student/semester-goal', element: <SemesterGoal/> },
    {path: '/student/profile', element: <Profile/> },
    {path: '/student/notification', element: <Notification/> },
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