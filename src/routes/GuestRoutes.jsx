import  Login  from "../pages/guest/Login/Login";
import { Route } from "react-router-dom";

export function GuestRoutes() {
    return (
        <Route path="/login" element={<Login />} />
    );
}