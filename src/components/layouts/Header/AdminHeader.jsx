import { Link } from "react-router-dom";
import "./AdminHeader.css"; 
import Logo from "../../../assests/images/Logo.png";


export function AdminHeader({title}) {
    return (
        <div id="admin-header">
            <div id="logo-place">
                <Link to='/student/home' className='header-logo'>
                    <img src={Logo} alt="Logo" />
                    <div>StudeeFlow</div>
                </Link>
            </div>
            <div>
                <div className="text-center fw-bold">{title}</div>
            </div>
        </div>
    );
}