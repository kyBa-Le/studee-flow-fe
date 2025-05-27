import { useEffect, useState } from "react";
import { getAllSubjects } from "../../../services/SubjectService";
import {
  getSemesterGoalsByUser,
  createSemesterGoal,
  updateSemesterGoals,
} from "../../../services/SemesterGoalService";
import {
  getCurrentSemesterByClassroomId,
  getAllSemestersByClassroomId,
} from "../../../services/SemesterService";
import { getStudentById, getUser } from "../../../services/UserService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SemesterGoal.css";
import { useParams } from "react-router-dom";

export function SemesterGoal() {
  const [subjects, setSubjects] = useState([]);
  const [semesterGoals, setSemesterGoals] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { studentId } = useParams();
  const [semesterId, setSemesterId] = useState();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const student = (await (studentId ? getStudentById(studentId) : getUser())).data;
        const classroomId = student.student_classroom_id;

        const allSemesters = await getAllSemestersByClassroomId(classroomId);
        setSemesters(allSemesters.data);

        const currentSemester = (await getCurrentSemesterByClassroomId(classroomId)).data[0];
        setSelectedSemester(currentSemester.name);
        setSemesterId(currentSemester.id);

        const subjects = (await getAllSubjects(classroomId)).data;
        setSubjects(subjects);

        const semesterGoals = (await getSemesterGoalsByUser(student.id, currentSemester.id)).data;
        setSemesterGoals(semesterGoals);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchGoalsForSelectedSemester = async () => {
      try {
        const student = (await (studentId ? getStudentById(studentId) : getUser())).data;
        const selected = semesters.find((s) => s.name === selectedSemester);
        if (!selected) return;
        setSemesterId(selected.id);

        const goals = (await getSemesterGoalsByUser(student.id, selected.id)).data;
        setSemesterGoals(goals);
      } catch (error) {
        console.error("Error fetching semester goals by selected semester:", error);
        toast.error("Failed to load semester goals for selected semester.");
      }
    };

    if (selectedSemester && semesters.length > 0) {
      fetchGoalsForSelectedSemester();
    }
  }, [selectedSemester, semesters]);

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleGoalChange = (subjectId, field, value) => {
    setSemesterGoals((prev) => {
      const existingGoalIndex = prev.findIndex((goal) => goal.subject_id === subjectId);

      if (existingGoalIndex >= 0) {
        const updatedGoals = [...prev];
        updatedGoals[existingGoalIndex] = {
          ...updatedGoals[existingGoalIndex],
          [field]: value,
        };
        return updatedGoals;
      } else {
        return [
          ...prev,
          {
            subject_id: subjectId,
            [field]: value,
            teacher_goals: "",
            course_goals: "",
            self_goals: "",
            is_achieved: false,
          },
        ];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const user = (await getUser()).data;
      const studentId = user.id;

      const goalsToSubmit = subjects.map((subject) => {
        const goal = semesterGoals.find((g) => g.subject_id === subject.id);

        return {
          teacher_goals: goal?.teacher_goals ?? "",
          course_goals: goal?.course_goals ?? "",
          self_goals: goal?.self_goals ?? "",
          is_achieved: goal?.is_achieved ?? false,
          student_id: studentId,
          subject_id: subject.id,
          semester_id: semesterId,
          id: goal?.id ?? null,
        };
      });

      for (const goal of goalsToSubmit) {
        if (goal.id) {
          await updateSemesterGoals(goal.id, goal);
        } else {
          await createSemesterGoal(goal);
        }
      }

      toast.success("Semester goals submitted successfully!");

      const updatedGoals = (await getSemesterGoalsByUser(studentId, semesterId)).data;
      setSemesterGoals(updatedGoals);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit semester goals.");
    }
  };

  return (
    <div className="semester-goal-container">
      <div className="semester-goal">
        <div className="semester-goal-btn">
          <div className="semester-goal-btn-select">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.name}>
                  {sem.name}
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
                At the end of this semester, what exactly would I like to be able to do in the language?
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
                subjects.map((subject) => {
                  let goal = semesterGoals.find((g) => g.subject_id === subject.id);
                  goal = goal ?? {
                    subject_id: subject.id,
                    teacher_goals: "",
                    course_goals: "",
                    self_goals: "",
                    is_achieved: false,
                  };

                  return (
                    <div key={subject.id} className="semester-goal-row">
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
                        {subject.subject_name}
                      </div>
                      <div className="semester-goal-cell">
                        <textarea
                          name="teacher_goals"
                          onInput={autoResize}
                          value={goal.teacher_goals}
                          onChange={(e) =>
                            handleGoalChange(subject.id, "teacher_goals", e.target.value)
                          }
                        />
                      </div>
                      <div className="semester-goal-cell">
                        <textarea
                          name="course_goals"
                          onInput={autoResize}
                          value={goal.course_goals}
                          onChange={(e) =>
                            handleGoalChange(subject.id, "course_goals", e.target.value)
                          }
                        />
                      </div>
                      <div className="semester-goal-cell">
                        <textarea
                          name="self_goals"
                          onInput={autoResize}
                          value={goal.self_goals}
                          onChange={(e) =>
                            handleGoalChange(subject.id, "self_goals", e.target.value)
                          }
                        />
                      </div>
                    </div>
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
            Save
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
