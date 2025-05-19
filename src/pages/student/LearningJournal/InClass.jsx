import { useEffect, useState } from "react";
import { getInClassJournal } from "../../../services/InClassService";
import { getUser } from "../../../services/UserService";
import { getAllSubjects } from "../../../services/SubjectService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function InClass({ weekId }) {
  const [inClassJournal, setInClassJournal] = useState([]);
  const [subjects, setSubjects] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
          await fetchInClassAndSubjects(weekId);
          // setInClassJournal([createEmptyRow()]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
        setInClassJournal([createEmptyRow()]);
      }
    };

    fetchData();
  }, []);

  const fetchInClassAndSubjects = async (weekId) => {
    const resInClass = await getInClassJournal(weekId);
    const inClass = resInClass.data;

    const user = await getUser();
    const classroomId = user.data.student_classroom_id;

    const resSubjects = await getAllSubjects(classroomId);

    setSubjects(resSubjects.data);
    setInClassJournal(inClass.length > 0 ? inClass : [createEmptyRow()]);
  };

  const createEmptyRow = () => ({
    date: "",
    lesson: "",
    self_assessment: "1",
    difficulties: "",
    plan: "",
    is_problem_solved: 0,
    subject_id: "",
  });

  const handleChange = (index, field, value) => {
    const updated = [...inClassJournal];
    updated[index][field] = value;
    setInClassJournal(updated);
  };

  const renderRow = (entry, index) => (
    <div className="learning-journal-row" key={index}>
      <div className="learning-journal-cell">
        <textarea
          rows="2"
          style={{ width: "100%", resize: "none" }}
          value={entry.date}
          onChange={(e) => handleChange(index, "date", e.target.value)}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          value={entry.subject_id || ""}
          style={{ width: "100%" }}
          onChange={(e) => handleChange(index, "subject_id", e.target.value)}
        >
          {subjects?.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>
      <div className="learning-journal-cell">
        <textarea
          rows="2"
          style={{ width: "100%", resize: "none" }}
          value={entry.lesson}
          onChange={(e) => handleChange(index, "lesson", e.target.value)}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          value={entry.self_assessment}
          onChange={(e) => handleChange(index, "self_assessment", e.target.value)}
          style={{ width: "100%" }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div className="learning-journal-cell">
        <textarea
          rows="2"
          style={{ width: "100%", resize: "none" }}
          value={entry.difficulties}
          onChange={(e) => handleChange(index, "difficulties", e.target.value)}
        />
      </div>
      <div className="learning-journal-cell">
        <textarea
          rows="2"
          style={{ width: "100%", resize: "none" }}
          value={entry.plan}
          onChange={(e) => handleChange(index, "plan", e.target.value)}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          value={entry.is_problem_solved}
          onChange={(e) => handleChange(index, "is_problem_solved", parseInt(e.target.value))}
          style={{ width: "100%" }}
        >
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="learning-journal-table-container">
      <div className="learning-journal-table">
        <div className="learning-journal-row header-row">
          <div className="learning-journal-cell header">Date</div>
          <div className="learning-journal-cell header">Skill/Module</div>
          <div className="learning-journal-cell header">
            My lesson <br /> What did I learn today?
          </div>
          <div className="learning-journal-cell header">
            Self-assessment <br />
            1: I need more practice <br />
            2: I sometimes find this difficult <br />
            3: No problem!
          </div>
          <div className="learning-journal-cell header">My difficulties</div>
          <div className="learning-journal-cell header">My plan</div>
          <div className="learning-journal-cell header">Problem solved</div>
        </div>
        {inClassJournal.map((entry, index) => renderRow(entry, index))}
      </div>
      <ToastContainer />
    </div>
  );
}