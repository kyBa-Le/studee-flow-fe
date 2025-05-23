import { useEffect, useState } from "react";
import "./ClassroomManagement.css";
import { ClassroomList } from "./ClassroomList";
import { ClassroomInfo } from "./ClassroomInfo";

export function ClassroomManagement() {
    const [classrooms, setClassrooms] = useState([{ id: "001" }]);

    useEffect(() => {
        // fetch logic
    }, []);

    return (
        <div className="classroom-management-container">
            <div className="add-and-search-container">
                <button id="add-button">+ Create class</button>
                <form id="search-box">
                    <input type="text" placeholder="Search ..." />
                    <div id="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </form>
            </div>

            <div className="classroom-main-content-container">
                <ClassroomList classrooms={classrooms} />
                <ClassroomInfo />
            </div>
        </div>
    );
}
