import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import Schedule from "../../../components/ui/Schedule/Schedule.tsx"
import { getClassroomByClassroomId } from "../../../services/ClassroomService.js";
import { UpdateButton } from "../../../components/ui/Button/Update/UpdateButton.jsx";
import { CancelButton } from "../../../components/ui/Button/Cancel/CancelButton.jsx";
import { toast } from "react-toastify";
import "./ClassroomDeadline.css";
import dayjs from "dayjs";
import { createDeadlinesByClassroomId } from "../../../services/DeadlineService.js";

export function ClassroomDeadline() {
  const [loading, setIsLoading] = useState(false);
  const { classroomId } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [deadlines, setDeadlines] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      const classroomRes = await getClassroomByClassroomId(classroomId);
      setClassroom(classroomRes.data);
      console.log(classroomRes);
    }

    fetchData();
  }, [])

  async function handleSubmit() {
    try {
      const data = {deadlines: deadlines}
      await createDeadlinesByClassroomId(classroomId, data);
      setIsDemo(false);
      toast.success("Create successful")
    } catch (error) {
      toast.error("Please try again!")
    }
  }

  async function handleUnDemo() {
    setDeadlines([]);
    setIsDemo(false);
  }


  return (
    <div className='classroom-container'>
      <div className='classroom-content'>
        <div className='classroom-header'>
          <div className='classroom-header-top-row'>
            <div className='classroom-header-back-to-subject'>
              <Link to="/teacher/home" className="back-button">
                <i className="fa-solid fa-circle-arrow-left"></i>
              </Link>
              <h2 className="classroom-class-title">Portfolio checkup time of {classroom?.class_name}</h2>
            </div>
            <div className='classroom-header-navigation d-flex justify-content-between'>
              {!isDemo && <button onClick={() => { setIsShowForm(true) }} className="create-subject-btn"><i className="fa-solid fa-plus"></i>Create a deadline timer</button>}
              {isDemo && <div className="d-flex justify-content-start gap-2">
                  <UpdateButton onClick={handleSubmit} >Save</UpdateButton>
                  <CancelButton onClick={handleUnDemo} ></CancelButton>
                </div>}
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Schedule classroomId={classroomId} deadlines={deadlines} />
        )}
      </div>
      {isShowForm && <div className="form-create-timer-overlay">
        <CreateDeadlineTimerForm setIsDemo={setIsDemo} classroomId={classroomId} setIsShowForm={setIsShowForm} setDeadlines={setDeadlines} className={classroom?.class_name} />
      </div>
      }
    </div>
  )
}

function CreateDeadlineTimerForm({ setIsShowForm, setDeadlines, setIsDemo, className }) {
  const [initialData, setInitialData] = useState({
    title: "Porfolio checkup time - " + className,
    started_at: "",
    ended_at: "",
    start_date: "",
    end_date: "",
    days_repeat: null
  });


  const [timeError, setTimeError] = useState("");

  function handleOnChange(e) {
    const { name, value } = e.target;

    const newData = {
      ...initialData,
      [name]: value
    };

    if (name === "started_at" || name === "ended_at") {
      const { started_at, ended_at } = newData;

      if (started_at && ended_at) {
        const [startHour, startMinute] = started_at.split(":").map(Number);
        const [endHour, endMinute] = ended_at.split(":").map(Number);

        const startDate = new Date(0, 0, 0, startHour, startMinute);
        const endDate = new Date(0, 0, 0, endHour, endMinute);

        const diff = (endDate - startDate) / (1000 * 60);

        if (diff < 30) {
          setTimeError("The checkup time must be greater than 30 minutes");
          newData.ended_at = null;
        } else {
          setTimeError("");
        }
      }
    }
    setInitialData(newData);
  }

  const handleGenerate = () => {
    const {
      title,
      start_date,
      end_date,
      days_repeat,
      started_at,
      ended_at,
    } = initialData;

    const start = dayjs(start_date);
    const end = dayjs(end_date);
    const repeat = parseInt(days_repeat, 10);

    if (!start.isValid() || !end.isValid() || repeat <= 0) return;

    const newDeadlines = [];

    let currentDate = start;

    while (currentDate.isBefore(end) || currentDate.isSame(end)) {
      newDeadlines.push({
        title,
        date: currentDate.format('YYYY-MM-DD'),
        started_at,
        ended_at,
      });
      currentDate = currentDate.add(repeat, 'day');
    }
    console.log('Generated deadlines:', newDeadlines);

    setDeadlines(newDeadlines);
    setIsShowForm(false);
    setIsDemo(true);

  };

  return (
    <form className="add-subject-form">
      <h6 className="text-center">CREATE AN AUTOMATIC DEADLINE</h6>
      <label>
        <div>Title</div>
        <input value={initialData.title} name="title" type="text" onChange={handleOnChange} />
      </label>
      <label>
        <div>Select the start date</div>
        <input value={initialData.start_date} name="start_date" type="date" onChange={handleOnChange} />
      </label>
      <div className="time-input-container">
        <label>
          <div>Start from</div>
          <input value={initialData.started_at} name="started_at" type="time" onChange={handleOnChange} />
        </label>
        <label>
          <div>To</div>
          <input value={initialData.ended_at || ""} name="ended_at" type="time" onChange={handleOnChange} />
          <span style={{color: "red"}}>{timeError}</span>
        </label>
      </div>
      <label>
        <div>Repeat after (day)</div>
        <input value={initialData.days_repeat} name="days_repeat" type="number" onChange={handleOnChange} />
      </label>
      <label>
        <div>Select the end date</div>
        <input value={initialData.end_date} name="end_date" type="date" onChange={handleOnChange} />
      </label>
      <div className="d-flex justify-content-end gap-2 mt-2">
        <CancelButton onClick={() => setIsShowForm(false)} />
        <UpdateButton onClick={handleGenerate}>Generate</UpdateButton>
      </div>
    </form>
  )
}