import { useEffect, useState } from "react";
import styles from "./AddTeacher.module.css";
import { CancelButton } from "../../../components/ui/Button/Cancel/CancelButton";
import { searchTeachersByEmail } from "../../../services/UserService";
import { LoadingData } from "../../../components/ui/Loading/LoadingData";
import { addTeacherToClassroom } from "../../../services/ClassroomService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function AddTeacher({ classroomId, showInputSearch, setParentTeachers }) {
    const [teachers, setTeachers] = useState([]);
    const [searchData, setSearchData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function handleOnChange(e) {
        setSearchData(e.target.value);
    }

    useEffect(() => {
        console.log(teachers)
    }, [teachers])

    async function handleOnSearch(e) {
        setIsLoading(true);
        e.preventDefault();
        try {
            const teachers = (await searchTeachersByEmail(searchData)).data.teachers;
            setTeachers(teachers);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddTeacher(teacherId, index) {
       try {
           await addTeacherToClassroom(classroomId, teacherId)
           toast.success("Teacher added.")
           const teacher = teachers[index];
           setParentTeachers(prev => [...prev, teacher]);
       } catch (error) {
            if (error.status == 400) {
                toast.error("Teacher already in the class");
            } else {
                toast.error("Add teacher failed! Please try again.")
            }
       }
    }
    
    return (
        <div style={{ width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.5)" }} className="d-flex justify-center align-items-center position-absolute top-0 left-0">
            <div className="add-teacher-form" style={{ width: "500px", backgroundColor: "white" }}>
                <div className="p-4" >
                    <h5 className="text-center pb-1">Add teacher to the class</h5>
                    <form className="w-100" onSubmit={handleOnSearch} >
                        <input name="email" onChange={handleOnChange} className="" style={{ fontSize: "10px", width: "90%" }} value={searchData} type="text" placeholder="Search a teacher by email" />
                        <button type="submit" onClick={handleOnSearch} className="w-10"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </form>
                    <div style={{ padding: "15px 0", height: "30vh"}}>
                        <table className={`${styles.listTeacherTable} table w-full`} style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Add</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    teachers?.map((teacher, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{teacher.id}</th>
                                                <td style={{ maxWidth: "120px", overflowWrap: "break-word" }}>{teacher.email}</td>
                                                <td style={{ maxWidth: "120px", overflowWrap: "break-word" }}>{teacher.full_name}</td>
                                                <td>
                                                    <div
                                                        onClick={() => handleAddTeacher(teacher.id, index)}
                                                        style={{
                                                            width: "fit-content",
                                                            padding: "2px 6px",
                                                            backgroundColor: "#24b7e3",
                                                            color: "white",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        +
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                      
                                }
                            </tbody>
                        </table>
                        {isLoading && <LoadingData />}
                    </div>
                    <div className="d-flex justify-end w-100"><CancelButton onClick={showInputSearch} /></div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}