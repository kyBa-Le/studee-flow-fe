import { useEffect, useRef, useState } from "react";
import { ButtonDelete } from "../../../components/ui/Button/Delete/ButtonDelete";
import { ButtonEdit } from "../../../components/ui/Button/Edit/ButtonEdit";
import { DateConverter } from "../../../components/utils/DateConverter";
import "./ClassroomInfo.css";
import { deleteTeacherFromClassroom, getAllTeachersByClassroomId } from "../../../services/ClassroomService";
import { getAllSubjects } from "../../../services/SubjectService";
import { getAllSemestersByClassroomId } from "../../../services/SemesterService";
import { AddLearningJournalFormButton } from "../../../components/ui/Button/AddLearningJournalFormButton";
import { AddTeacher } from "./AddTeacher";
import { toast } from "react-toastify";

export function ClassroomInfo({ classroom }) {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [isShowSearch, setIsShowSearch] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (classroom) {
                try {
                    const [teachersResponse, subjectResponse, semesterResponse] = await Promise.all([
                        getAllTeachersByClassroomId(classroom.id),
                        getAllSubjects(classroom.id),
                        getAllSemestersByClassroomId(classroom.id)
                    ]);
                    setTeachers(teachersResponse.data);
                    setSubjects(subjectResponse.data);
                    setSemesters(semesterResponse.data);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchData();
    }
        , [classroom])

    function showInputSearch() {
        setIsShowSearch(prev => !prev)
    }

    async function handleDeleteTeacher(classroomId, teacherId, index) {
        try {
            await deleteTeacherFromClassroom(classroomId, teacherId);
            toast.success("Delete teacher successfully")
            setTeachers(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            toast.error("Delete teacher failed.");
        }
    }

    return (
        <div className="content classroom-info-container">
            <h4 style={{ paddingTop: "10px" }}>Class information</h4>
            {
                classroom && (
                    <form className="classroom-info-form">
                        <label>
                            <span className="label-title">Class name:</span>
                            <input value={classroom.class_name} />
                        </label>

                        <label>
                            <span className="label-title">Created at:</span>
                            <input readOnly type="date" value={DateConverter(classroom.created_at)} />
                        </label>

                        <div>
                            <span className="label-title">Teachers:</span>
                            <div className="teacher-avatar-place form-section">
                                {teachers.map((teacher, i) => (
                                    <div className="teacher-avatar-item position-relative" key={i}>
                                        <div className="cancel-icon w-5 h-5 top-0 right-0 position-absolute d-none" onClick={() => handleDeleteTeacher(classroom.id, teacher.id, i)}><i class="fa-solid fa-xmark"></i></div>
                                        <div className="teacher-avatar"
                                            style={{
                                                backgroundImage: teacher.avatar_link ? `url(${teacher.avatar_link})` : "url('https://th.bing.com/th/id/OIP.lFfefuSR0zhQyrwk3N93NAHaEK?w=281&h=180&c=7&r=0&o=5&cb=iwc2&pid=1.7')"
                                            }}></div>
                                        <p className="teacher-name">{teacher.full_name}</p>
                                    </div>
                                ))}

                            </div>
                            <div className="d-flex justify-end align-center" ><AddLearningJournalFormButton onClick={showInputSearch} /></div>

                        </div>

                        <label>
                            <span className="label-title">Subjects: {subjects?.length}</span>
                            <div className="subjects-place">
                                {subjects?.map((subj, idx) => (
                                    <span className="badge" key={idx}>{subj.subject_name}</span>
                                ))}
                            </div>
                        </label>

                        <label>
                            <span className="label-title">Semesters:</span>
                            <div className="semester-list">
                                {
                                    semesters.length > 0 ?
                                        (
                                            semesters.map((semester) => (
                                                <div className="semester-row" key={semester.id}>
                                                    <span>{semester.name}:</span>
                                                    <input type="date" value={DateConverter(semester.started_at)} />
                                                    <input type="date" value={DateConverter(semester.ended_at)} />
                                                </div>))
                                        ) :
                                        (
                                            <div className="semester-row">
                                                <span>No semester found!</span>
                                                <input type="date" />
                                                <input type="date" />
                                            </div>
                                        )
                                }
                            </div>
                        </label>

                        <div className="action-buttons">
                            <ButtonEdit />
                            <ButtonDelete />
                        </div>
                    </form>
                )
            }
            {/* Show modal search and add teacher */}
            {
                isShowSearch &&
                (
                    <AddTeacher setParentTeachers={setTeachers} classroomId={classroom.id} showInputSearch={showInputSearch}/>
                )
            }
        </div>
    );
}
