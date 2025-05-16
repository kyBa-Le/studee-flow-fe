import StudentLayout from "../components/layouts/MainLayouts/StudentLayout";
import Home from '../pages/student/Home/Home';
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { SelfStudy } from "../pages/student/LearningJournal/SelfStudy";
import { LearningJournalLayout } from "../pages/student/LearningJournal/LearningJournalLayout";
import { SemesterGoal } from "../pages/student/SemesterGoal/SemesterGoal";

const studentRoutes = [
    {path: '/student/home', element: <Home/> },
    {path: '/student/learning-journal', element: <LearningJournalLayout></LearningJournalLayout> },
     {path: '/student/semester-goal', element: <SemesterGoal/> },
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