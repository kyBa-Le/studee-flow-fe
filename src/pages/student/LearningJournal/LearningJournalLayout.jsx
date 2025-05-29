import { useEffect, useRef, useState } from "react";
import "./LearningJournal.css";
import { WeeklyGoal } from "./WeeklyGoal";
import { SelfStudy } from "./SelfStudy";
import { InClass } from "./InClass";
import { createWeek, getAllWeek } from "../../../services/WeekService";
import { useParams } from "react-router-dom";
import { AddLearningJournalFormButton } from "../../../components/ui/Button/AddLearningJournalFormButton";
import { UpdateButton } from "../../../components/ui/Button/Update/UpdateButton";
import { CancelButton } from "../../../components/ui/Button/Cancel/CancelButton";
import { toast } from "react-toastify";

export function LearningJournalLayout() {
  const [weeks, setWeeks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState({});
  const [isSelfStudy, setIsSelfStudy] = useState(false);
  const { studentId } = useParams();
  const [isMoving, setIsMoving] = useState();
  const timeOutRef = useRef(null);
  const [openWeekForm, setOpenWeekForm] = useState(false);



  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const response = await getAllWeek();
        const weekData = response.data.sort((a, b) => new Date(a.end_date) - new Date(b.end_date)) || [];
        setWeeks(weekData);

        if (weekData.length > 0) {
          setCurrentWeek(weekData[weekData.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching weeks:", error);
      }
    };

    fetchWeeks();
  }, []);

  function handleMouseEnter() {
    clearTimeout();
    setIsMoving(true);
  }

  function handleMouseLeave() {
    timeOutRef.current = setTimeout(() => {
      setIsMoving(false);
    }, 1300)
  }

  return (
    <div className="learning-journal-container">
      <div className="learning-journal">
        <div className="learning-journal-headerr">
          {studentId && <button className="student-profile-back-btn" onClick={() => window.history.back()}>
            <i className="fa-solid fa-circle-arrow-left"></i>
          </button>}
          <div></div>
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="learning-journal-week-selector">
            <select
              value={weeks.findIndex(w => w.week === currentWeek.week)}
              onChange={(e) => {
                const selectedIndex = parseInt(e.target.value);
                const selectedWeek = weeks[selectedIndex];
                setCurrentWeek(selectedWeek);
              }}
            >
              {weeks.map((week, index) => (
                <option key={week.id} value={index}>
                  Week {week.week}
                </option>
              ))}
            </select>

            <i className="fa-solid fa-angle-down learning-journal-icon"></i>
            <div className={`week-add-button ${isMoving ? "moving" : ""}`} ><AddLearningJournalFormButton onClick={() => {setOpenWeekForm(true)}} /></div>
          </div>
        </div>

        <div className="learning-journal-goal-content">
          <div className="learning-journal-header">
            <div className="learning-journal-title-wrapper">
              <h2 className="learning-journal-title" style={{ paddingTop: "20px" }}>
                Weekly Goal
              </h2>
            </div>
          </div>

          <div className="learning-journal-goal-section">

            <WeeklyGoal weekId={currentWeek.id} />

          </div>

          <hr />

          <div className="learning-journal-header">
            <div className="learning-journal-tabs">
              <button
                type="button"
                onClick={() => setIsSelfStudy(false)}
                className={`learning-journal-tab left ${!isSelfStudy ? "active" : "inactive"}`}
              >
                Classroom
              </button>
              <button
                type="button"
                onClick={() => setIsSelfStudy(true)}
                className={`learning-journal-tab right ${isSelfStudy ? "active" : "inactive"}`}
              >
                Self Study
              </button>
            </div>

            <h2 className="learning-journal-title">Learning Journal</h2>
            <div>
              <b>Week {currentWeek?.week}</b>: {currentWeek?.start_date} - {currentWeek?.end_date}
            </div>
          </div>

          <div className="learning-journal-table-container">
            {isSelfStudy ? <SelfStudy weekId={currentWeek.id} /> : <InClass weekId={currentWeek.id} />}
          </div>
        </div>

        <div className="learning-journal-submit">
          {
            !studentId && <button type="submit" className="learning-journal-submit-btn">
              Submit
            </button>
          }
        </div>
      </div>
      {openWeekForm && (
        <div className="create-week-form-overlay">
          <CreateWeekForm setOpenWeekForm={setOpenWeekForm}/>
        </div>
      )}

      
    </div>
  );
}

function CreateWeekForm({setOpenWeekForm}) {
  const [formData, setFormData] = useState({
    week_number: 1,
    start_date: null,
    end_date: null
  });

  function handleOnChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (updated.start_date && updated.end_date) {
        const start = new Date(updated.start_date);
        const end = new Date(updated.end_date);

        if (end < start) {
          return {
            ...updated,
            end_date: "",
          };
        }
      }

      return updated;
    });
  }
  

  async function handleSubmit() {
    try {
      console.log(formData);
      await createWeek(formData);
      toast.success("New week created")
    } catch (error) {
      toast.error("Please try again!")
    }
  }

  return (
    <form className="add-week-form">
      <h6 className="text-center">START A NEW WEEK JOURNAL</h6>
      <label>
        <div>Week number</div>
        <input value={formData.week_number} name="week_number" type="number" onChange={handleOnChange} />
      </label>
      <label>
        <div>Start date</div>
        <input value={formData.start_date} name="start_date" type="date" onChange={handleOnChange} />
      </label>
      <label>
        <div>End date</div>
        <input value={formData.end_date} name="end_date" type="date" onChange={handleOnChange} />
      </label>
      <div className="d-flex justify-content-end gap-2 mt-2">
        <CancelButton onClick={() => setOpenWeekForm(false)} />
        <UpdateButton onClick={handleSubmit}>Create</UpdateButton>
      </div>
    </form>
  )
}
