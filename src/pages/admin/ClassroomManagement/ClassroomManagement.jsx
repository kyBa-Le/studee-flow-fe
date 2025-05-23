import { use, useEffect, useState } from "react";
import "./ClassroomManagement.css";
import { ClassroomList } from "./ClassroomList";
import { ClassroomInfo } from "./ClassroomInfo";
import { adminGetAllClassrooms } from "../../../services/ClassroomService";

export function ClassroomManagement() {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState(0);

    useEffect(() => {
        const fetchClassrooms = async () => {
            console.log("run");
            try {
                const fetchedClassrooms = await adminGetAllClassrooms();
                console.log("Fetched classrooms:", fetchedClassrooms);
                setClassrooms(fetchedClassrooms.data);
            } catch (error) {
                console.error("Error fetching classrooms:", error);
            }

        }

        fetchClassrooms();
    }, []);

    useEffect(
        () => {
            console.log(selectedClassroom);
        },
        [selectedClassroom]
    )

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
            <ClassroomList setSelectedClassroom={setSelectedClassroom} classrooms={classrooms} />
            <ClassroomInfo classroom={classrooms[selectedClassroom]} />
        </div>
    </div>
);
}
