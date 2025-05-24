import { useEffect, useState } from "react";
import "./ClassroomManagement.css";
import { ClassroomList } from "./ClassroomList";
import { ClassroomInfo } from "./ClassroomInfo";
import { adminGetAllClassrooms } from "../../../services/ClassroomService";
import { CreateClassroomForm } from "./CreateClassroomForm";

export function ClassroomManagement() {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState(0);
    const [isShowCreateForm, setIsShowCreateForm] = useState(false);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const fetchedClassrooms = await adminGetAllClassrooms();
                setClassrooms(fetchedClassrooms.data);
            } catch (error) {
                console.error("Error fetching classrooms:", error);
            }
        };

        fetchClassrooms();
    }, []);

    const handleShowCreateForm = () => {
        setIsShowCreateForm(!isShowCreateForm);
    };

    const handleCreate = (formData) => {
        // PostData
    }

    return (
        <div className="classroom-management-container">
            <div className="add-and-search-container">
                <button id="add-button" onClick={handleShowCreateForm}>
                    + Create class
                </button>
                <form id="search-box">
                    <input type="text" placeholder="Search ..." />
                    <div id="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </form>
            </div>

            <div className="classroom-main-content-container">
                <ClassroomList
                    setSelectedClassroom={setSelectedClassroom}
                    classrooms={classrooms}
                />
                <ClassroomInfo classroom={classrooms[selectedClassroom]} />
            </div>
            {isShowCreateForm && <CreateClassroomForm handleShowCreateForm={handleShowCreateForm} handleCreate={handleCreate} />}
        </div>
    );
}
