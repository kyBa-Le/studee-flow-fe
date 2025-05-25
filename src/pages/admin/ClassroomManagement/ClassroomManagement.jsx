import { useEffect, useState } from "react";
import "./ClassroomManagement.css";
import { ClassroomList } from "./ClassroomList";
import { ClassroomInfo } from "./ClassroomInfo";
import { toast } from "react-toastify";
import { adminGetAllClassrooms, adminCreateClassroom, adminUpdateClassroom, getClassroomByClassroomId } from "../../../services/ClassroomService";
import { CreateClassroomForm } from "./CreateClassroomForm";
import { getAllSemestersByClassroomId } from "../../../services/SemesterService";

export function ClassroomManagement() {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState(0);
    const [isShowCreateForm, setIsShowCreateForm] = useState(false);
    const [isClassroomCreated, setIsClassroomCreated] = useState(false);
    const [isClassroomUpdate, setIsClassroomUpdate] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const fetchedClassrooms = await adminGetAllClassrooms();
                const data = fetchedClassrooms.data || [];
                setClassrooms(data);
                
                if (isClassroomCreated && data.length > 0) {
                    setSelectedClassroom(data.length - 1);
                }
                
                setIsClassroomCreated(false);
                setIsClassroomUpdate(false);
            } catch (error) {
                console.error("Error fetching classrooms:", error);
                toast.error("Failed to fetch classrooms.");
            }
        };

        fetchClassrooms();
    }, [isClassroomCreated, isClassroomUpdate]);

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

    const handleUpdate = async (id, formData) => {
        try {
            await adminUpdateClassroom(id, formData);
            setIsShowCreateForm(!isShowCreateForm);
            setIsClassroomUpdate(true);
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

    const handleShowEditData = async (id) => {
        try {
            const [classroomRes, semestersRes] = await Promise.all([
                getClassroomByClassroomId(id),
                getAllSemestersByClassroomId(id)
            ]);
            
            if (!classroomRes || !semestersRes) {
                toast.error("Failed to load classroom info");
                return;
            }

            setEditData({
                id,
                class_name: classroomRes.data.class_name,
                semesters: semestersRes.data.map((sem) => ({
                    semester_name: sem.name || sem.semester_name,
                    start_date: sem.started_at || sem.start_date,
                    end_date: sem.ended_at || sem.end_date,
                }))
            });

            setIsShowCreateForm(true);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching classroom edit data");
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
                <ClassroomInfo classroom={classrooms[selectedClassroom]} handleShowCreateForm={handleShowCreateForm} handleShowEditData={handleShowEditData} />
            </div>
            {isShowCreateForm && (
                <CreateClassroomForm
                    handleShowCreateForm={handleShowCreateForm}
                    handleCreate={handleCreate}
                    handleUpdate={handleUpdate}
                    editData={editData}
                />
            )}
        </div>
    );
}
