import { useEffect, useState, useCallback, useMemo } from "react";
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
  const [semesterId, setSemesterId] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { studentId } = useParams();

  // Cache user data để tránh gọi API lặp lại
  const [cachedUser, setCachedUser] = useState(null);

  // Memoized function để resize textarea
  const autoResize = useCallback((e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }, []);

  // Memoized function để handle goal change
  const handleGoalChange = useCallback((subjectId, field, value) => {
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
  }, []);

  // Helper function để get user data
  const getUserData = useCallback(async () => {
    if (cachedUser) return cachedUser;

    const userData = (await (studentId ? getStudentById(studentId) : getUser())).data;
    setCachedUser(userData);
    return userData;
  }, [studentId, cachedUser]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const student = await getUserData();
        const classroomId = student.student_classroom_id;

        // Gọi API song song để tăng tốc độ
        const [allSemestersResult, currentSemesterResult, subjectsResult] = await Promise.all([
          getAllSemestersByClassroomId(classroomId),
          getCurrentSemesterByClassroomId(classroomId),
          getAllSubjects(classroomId)
        ]);

        const allSemesters = allSemestersResult.data;
        const currentSemester = currentSemesterResult.data[0];
        const subjects = subjectsResult.data;

        setSemesters(allSemesters);
        setSelectedSemester(currentSemester.name);
        setSemesterId(currentSemester.id);
        setSubjects(subjects);

        // Fetch semester goals sau khi có đủ thông tin
        const semesterGoals = (await getSemesterGoalsByUser(student.id, currentSemester.id)).data;
        setSemesterGoals(semesterGoals);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Chỉ chạy một lần khi component mount

  // Fetch goals khi thay đổi semester
  useEffect(() => {
    const fetchGoalsForSelectedSemester = async () => {
      if (!selectedSemester || semesters.length === 0 || !cachedUser) return;

      try {
        const selected = semesters.find((s) => s.name === selectedSemester);
        if (!selected) return;

        setSemesterId(selected.id);

        const goals = (await getSemesterGoalsByUser(cachedUser.id, selected.id)).data;
        setSemesterGoals(goals);
      } catch (error) {
        console.error("Error fetching semester goals by selected semester:", error);
        toast.error("Failed to load semester goals for selected semester.");
      }
    };

    fetchGoalsForSelectedSemester();
  }, [selectedSemester, semesters, cachedUser]);

  // Memoized submit function
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    try {
      const user = cachedUser || (await getUser()).data;
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

      // Batch API calls để tăng hiệu suất
      const updatePromises = [];
      const createPromises = [];

      goalsToSubmit.forEach(goal => {
        if (goal.id) {
          updatePromises.push(updateSemesterGoals(goal.id, goal));
        } else {
          createPromises.push(createSemesterGoal(goal));
        }
      });

      // Thực hiện tất cả API calls song song
      await Promise.all([...updatePromises, ...createPromises]);

      toast.success("Semester goals submitted successfully!");

      // Refresh goals sau khi submit
      const updatedGoals = (await getSemesterGoalsByUser(studentId, semesterId)).data;
      setSemesterGoals(updatedGoals);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit semester goals.");
    } finally {
      setIsSubmitting(false);
    }
  }, [subjects, semesterGoals, semesterId, cachedUser, isSubmitting]);

  // Memoized rendered subjects để tránh re-render không cần thiết
  const renderedSubjects = useMemo(() => {
    if (isLoading) return null;

    return subjects.map((subject) => {
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
            readOnly={!!studentId}
          />
          <input
            type="hidden"
            name="semester_goal_id"
            value={goal.id ?? ""}
            readOnly={!!studentId}
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
              readOnly={!!studentId}
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
              readOnly={!!studentId}
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
              readOnly={!!studentId}
            />
          </div>
        </div>
      );
    });
  }, [subjects, semesterGoals, isLoading, studentId, autoResize, handleGoalChange]);

  // Memoized semester options
  const semesterOptions = useMemo(() => {
    return semesters.map((sem) => (
      <option key={sem.id} value={sem.name}>
        {sem.name}
      </option>
    ));
  }, [semesters]);

  return (
    <div className="semester-goal-container">
      <div className="semester-goal">
        <div className="semester-goal-btn">
          {studentId && (
            <button
              className="student-profile-back-btn"
              onClick={() => window.history.back()}
            >
              <i className="fa-solid fa-circle-arrow-left"></i>
            </button>
          )}
          <div></div>
          <div className="semester-goal-btn-select">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {semesterOptions}
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
              {selectedSemester || "Semester"}
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

              {renderedSubjects}
            </div>
          </div>
        </div>

        <div className="semester-goal-btn">
          <div></div>
          {!studentId && (
            <button
              onClick={handleSubmit}
              type="button"
              className="semester-goal-btn-submit"
              disabled={!!studentId || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}