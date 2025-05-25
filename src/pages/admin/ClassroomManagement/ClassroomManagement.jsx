import { useEffect, useState } from "react";
import "./ClassroomManagement.css";
import { ClassroomList } from "./ClassroomList";
import { ClassroomInfo } from "./ClassroomInfo";
import { toast, ToastContainer } from "react-toastify";
import { adminGetAllClassrooms, adminCreateClassroom } from "../../../services/ClassroomService";
import { CreateClassroomForm } from "./CreateClassroomForm";

export function ClassroomManagement() {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState(0);
    const [isShowCreateForm, setIsShowCreateForm] = useState(false);
    const [isClassroomCreated, setIsClassroomCreated] = useState(false);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const fetchedClassrooms = await adminGetAllClassrooms();
                setClassrooms(fetchedClassrooms.data || []);
                setIsClassroomCreated(false);
            } catch (error) {
                console.error("Error fetching classrooms:", error);
                toast.error("Failed to fetch classrooms.");
            }
        };

        fetchClassrooms();
    }, [isClassroomCreated]);

    const handleShowCreateForm = () => {
        setIsShowCreateForm(!isShowCreateForm);
    };

    const handleCreate = async (formData) => {
        try {
            await adminCreateClassroom(formData);
            setIsShowCreateForm(!isShowCreateForm)
            setIsClassroomCreated(true);
        } catch (error) {
            console.error("Error creating classroom:", error);

            const message = error.response?.data?.message || "";

            if (message.includes("Duplicate entry") && message.includes("classrooms_class_name_unique")) {
                toast.error("Class name already exists, please choose a different one.");
            } else {
                toast.error("Failed to create classroom.");
            }
        }
    };

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
                <ClassroomInfo classroom={classrooms[selectedClassroom]} handleShowCreateForm={handleShowCreateForm} />
            </div>
            {isShowCreateForm && (
                <CreateClassroomForm
                    handleShowCreateForm={handleShowCreateForm}
                    handleCreate={handleCreate}
                />
            )}
        </div>
    );
}
