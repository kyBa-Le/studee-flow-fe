import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { TeacherHome } from "../pages/teacher/Home/TeacherHome";
import {StudentProfile} from "../pages/teacher/StudentProfile";
import { Classroom } from "../pages/teacher/Classroom/Classroom";
import { TeacherLayout } from "../components/layouts/MainLayouts/TeacherLayout";
import { SemesterGoal } from "../pages/student/SemesterGoal/SemesterGoal";
import {LearningJournalLayout} from "../pages/student/LearningJournal/LearningJournalLayout";
import Profile from "../pages/teacher/Profile/TeacherProfile";
import { NotificationTeacher } from "../pages/teacher/Notification/NotificationTeacher";



const teacherRoutes = [
    { path: '/teacher/home', element: <TeacherHome /> },
    { path: '/teacher/classroom/:classroomId', element: <Classroom /> },
    { path: '/student/:studentId/profile', element: <StudentProfile /> },
    { path: '/student/:studentId/semester-goal', element: <SemesterGoal /> },
    { path: '/student/:studentId/learning-journal', element: <LearningJournalLayout/> },
    {path: '/teacher/profile', element: <Profile/> },
    {path: '/teacher/notification', element: <NotificationTeacher/> }, 
];

export function TeacherRoutes() {
    return teacherRoutes.map(({ path, element }) => (
        <Route
            key={path}
            path={path}
            element={
                <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherLayout>
                        {element}
                    </TeacherLayout>
                </ProtectedRoute>
            }
        />
    ));
}