import { useState } from "react";
import "./SubjectList.css";
import { createSubject } from "../../../services/SubjectService";
import { toast } from "react-toastify";
import { CancelButton } from "../../../components/ui/Button/Cancel/CancelButton";
import { UpdateButton } from "../../../components/ui/Button/Update/UpdateButton";


export function SubjectList({ classroomId, subjects, setSubject }) {
  const [isShowForm, setIsShowForm] = useState(false);



  return (
    <div className="subject-list-container">
      <div className="subject-list-content">
        <div className='subject-list-body-header'>
          <div className="subject-list-header-left">
            <h2 className='subject-list-body-header-title'>All Subjects</h2>
            <button className="create-subject-btn" onClick={() => { setIsShowForm(true) }}>
              <i className="fa-solid fa-plus"></i> Create Subject
            </button>
          </div>
          <div className='subject-list-body-header-search'>
            <input
              type="text"
              placeholder="Search ..."
              className="subject-list-search-input"
            />
            <span className="subject-list-search-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
        </div>

        <div className="subject-list-grid">
          {subjects.length > 0 ? (
            subjects.map((cls, idx) => {
              const colorClass = `subject-card-${idx % 3}`;
              return (
                <div
                  key={cls.id || idx}
                  className={`subject-card ${colorClass}`}
                >
                  <h3 className="subject-card-title">
                    {cls.subject_name}
                  </h3>
                </div>
              );
            })
          ) : (
            <div className="subject-list-empty">
              No subjects found.
            </div>
          )}
        </div>
      </div>
      {
        isShowForm && <div className="create-subject-form-overlay">
          <CreateSubjectForm setSubject={setSubject} classroomId={classroomId} setIsShowForm={setIsShowForm} />
        </div>
      }
    </div>
  );
}

function CreateSubjectForm({classroomId ,setIsShowForm, setSubject}) {
  const [data, setData] = useState({subject_name: ""});

  function handleOnChange(e) {
    const { value } = e.target;

    setData(prev => ({
      ...prev,
      subject_name: value
    }));
  }

  async function handleSubmit() {
    try {
      console.log(data);
      const response = await createSubject(classroomId ,data);
      setIsShowForm(false);
      toast.success("New subject created")
      setSubject(prev => ({
        ...prev, subjects: [...prev.subjects, response.data.subject]
      }))
    } catch (error) {
      toast.error("Please try again!")
    }
  }

  return (
    <form className="add-subject-form">
      <h6 className="text-center">CREATE A SUBJECT</h6>
      <label>
        <div>Subject name</div>
        <input value={data.subject_name} name="subject_name" type="text" onChange={handleOnChange} />
      </label>
      <div className="d-flex justify-content-end gap-2 mt-2">
        <CancelButton onClick={() => setIsShowForm(false)} />
        <UpdateButton onClick={handleSubmit}>Create</UpdateButton>
      </div>
    </form>
  )
}