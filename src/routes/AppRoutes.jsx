import { HomeRedirect } from "./HomeRedirect";
import { TeacherRoutes } from "./TeacherRoutes";
import { StudentRoutes } from "./StudentRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { GuestRoutes } from "./GuestRoutes";
import NotFound from "../pages/NotFound/NotFound";

import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

export function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeRedirect />} />
                {AdminRoutes()}
                {TeacherRoutes()}
                {StudentRoutes()}
                {GuestRoutes()}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
