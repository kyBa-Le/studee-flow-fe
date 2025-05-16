import React, { useEffect, useState } from "react";
import { getAllSubjects } from "../../../services/SubjectService";
import { getSemesterGoalsByUser } from "../../../services/SemesterGoalService";
import { getCurrentSemesterByClassroomId } from "../../../services/SemesterService";
import { getUser } from "../../../services/UserService";
import { createSemesterGoal } from "../../../services/SemesterGoalService";
import { updateSemesterGoals } from "../../../services/SemesterGoalService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SemesterGoal.css";

export function SemesterGoal() {
  const [subjects, setSubjects] = useState([]);
  const [semesterGoals, setSemesterGoals] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = (await getUser()).data;
        const classroomId = user.student_classroom_id;

        const semesterRes = await getCurrentSemesterByClassroomId(classroomId);
        const currentSemester = semesterRes.data[0];
        setSelectedSemester(currentSemester.name);

        const subjects = (await getAllSubjects(classroomId)).data;
        setSubjects(subjects);

        const semesterGoals = (await getSemesterGoalsByUser(currentSemester.id)).data;
        setSemesterGoals(semesterGoals);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = async () => {
    try {
      const user = (await getUser()).data;
      const studentId = user.id;
      const classroomId = user.student_classroom_id;

      const semesterRes = await getCurrentSemesterByClassroomId(classroomId);
      const semesterId = semesterRes.data[0].id;

      const forms = document.querySelectorAll("form");

      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        const formData = new FormData(form);

        const data = {
          teacher_goals: formData.get("teacher_goals"),
          course_goals: formData.get("course_goals"),
          self_goals: formData.get("self_goals"),
          is_achieved: formData.get("is_achieved") === "true",
          student_id: studentId,
          subject_id: subjects[i]?.id,
          semester_id: semesterId,
        };

        const semester_goal_id = formData.get("semester_goal_id");

        if (!data.subject_id) continue;

        if (semester_goal_id && semester_goal_id !== "null") {
          await updateSemesterGoals(semester_goal_id, data);
        } else {
          await createSemesterGoal(data);
        }
      }

      toast.success("Semester goals submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit semester goals.");
    }
  };

  const findGoalBySubject = (subjectId) =>
    semesterGoals.find((goal) => goal.subject_id === subjectId) || {};

  return (
    <div className="semester-goal-container">
      <div className="semester-goal">
        <div className="semester-goal-btn">
          <div className="semester-goal-btn-select">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  Semester {num}
                </option>
              ))}
            </select>
            <i className="icon-semester fa-solid fa-angle-right"></i>
          </div>
        </div>

        <div className="semester-goal-content">
          <div className="semester-goal-content-in">
            <div className="semester-goal-header">
              <p>
                <strong>Semester goal:</strong>
                <br />
                What do I expect from the course and my teachers?
                <br />
                At the end of this semester, what exactly would I like to be
                able to do in the language?
              </p>
            </div>

            <div className="semester-goal-title">
              {selectedSemester || "?"}
            </div>

            <div className="semester-goal-table">
              <div className="semester-goal-row header-row">
                <div className="semester-goal-cell title"></div>
                <div className="semester-goal-cell">
                  What I expect from the teacher & instructor
                </div>
                <div className="semester-goal-cell">
                  What I expect from the course
                </div>
                <div className="semester-goal-cell">
                  What I expect from myself
                </div>
              </div>

              {!isLoading &&
                subjects.map((cls, index) => {
                  const goal = findGoalBySubject(cls.id);

                  return (
                    <form key={cls.id} className="semester-goal-row">
                      <input
                        type="hidden"
                        name="is_achieved"
                        value={goal.is_achieved ?? false}
                      />
                      <input
                        type="hidden"
                        name="semester_goal_id"
                        value={goal.id ?? ""}
                      />
                      <div className="semester-goal-cell title">
                        {cls.subject_name}
                      </div>
                      <div className="semester-goal-cell">
                        <textarea
                          name="teacher_goals"
                          onInput={autoResize}
                          defaultValue={goal.teacher_goals || ""}
                        />
                      </div>
                      <div className="semester-goal-cell">
                        <textarea
                          name="course_goals"
                          onInput={autoResize}
                          defaultValue={goal.course_goals || ""}
                        />
                      </div>
                      <div className="semester-goal-cell">
                        <textarea
                          name="self_goals"
                          onInput={autoResize}
                          defaultValue={goal.self_goals || ""}
                        />
                      </div>
                    </form>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="semester-goal-btn">
          <button
            onClick={handleSubmit}
            type="button"
            className="semester-goal-btn-submit"
          >
            Submit
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
