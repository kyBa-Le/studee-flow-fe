import { useState, useEffect } from "react"
import CreateAchievementForm from "./CreateAchievementForm"
import { creatAchievement } from "../../../services/AchievementService";
import { getAllSemestersByClassroomId } from "../../../services/SemesterService";
import { getUser } from "../../../services/UserService";
import { getAchievement } from "../../../services/AchievementService";
import "./Achievement.css"
import { toast } from "react-toastify"

export default function Achievement() {
  const [isShow, setIsShow] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [achievements, setAchievements] = useState([]);
  
  console.log(achievements);
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const userRes = await getUser();

      const classroomId = userRes?.data?.student_classroom_id;

      const semesterRes = await getAllSemestersByClassroomId(classroomId);
      setSemesters(semesterRes.data);

      const achievementRes = await getAchievement();
      setAchievements(achievementRes.data)

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    }
  };

  fetchData();
}, []);

  const handleCanle = () => {
    setIsShow(false);
  }

  const handleShow = () => {
    setIsShow(true)
  }

const handleCreate =  async (formData) => {
  console.log("Form Data", formData)
  try {
    await creatAchievement(formData);
    
    const achievementRes = await getAchievement();
    setAchievements(achievementRes.data);

    setIsShow(false);
    toast.success("Achievement created successfully!"); 
  } catch (error) {
    console.error("Error creating classroom:", error);
    toast.error("Failed to create achievement.");
  }
}

  return (
    <div className="achievement-container">
      <div className="achievement-content">
        <div className="achievement-header">
            <h1 className="title-achievement">All Achievements</h1>
            <button className="add-button" onClick={handleShow}>
              <span className="plus-icon">+</span>
              Add Achievement
            </button>
        </div>
        <div className="certificates-container">
          <div className="certificates-grid">
            {achievements.map((achiv) => (
            <div key={achiv.id} className="certificate-card">
                <div className="card-content">
                <div className="image-container">
                    <img src={achiv.image_link } alt="achievement image" className="certificate-image" />
                    <div className="hover-overlay">
                    <div className="overlay-content">
                        <h3 className="overlay-title">Title: {achiv.title}</h3>
                        <p className="overlay-description"><b>Description: </b>{achiv.content}</p>
                        <p className="overlay-duration"><b>Semmester: </b>{achiv.semester}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            ))}
          </div>
        </div>
      </div>
      {
        isShow ? <CreateAchievementForm handleCreate={handleCreate} handleCanle={handleCanle} semesters={semesters}/> : null
      }
    </div>
  )
}
