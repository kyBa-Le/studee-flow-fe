import React, { useEffect, useState } from "react";
import { getAllSubjects } from "../../../services/SubjectService";
import { getUser } from "../../../services/UserService";
import { getWeeklySelfStudyJournalOfStudent } from "../../../services/SelfStudyService";
import { getAllWeek } from "../../../services/WeekService";

export function SelfStudy() {
  const [subjects, setSubjects] = useState([]);
  const [selfStudies, setSelfStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        const studentId = user.data.id;
        const classroomId = user.data.student_classroom_id;

        const [subjectsResponse, weekResponse] = await Promise.all([
          getAllSubjects(classroomId),
          getAllWeek(),
        ]);

        setSubjects(subjectsResponse.data);

        const sortedWeeks = weekResponse.data.sort(
          (a, b) => new Date(b.end_date) - new Date(a.end_date)
        );
        setWeeks(sortedWeeks);
        console.log("hello ",sortedWeeks)
        if (sortedWeeks.length > 0) {
          setCurrentWeek(sortedWeeks[0]);
          const studies = await getWeeklySelfStudyJournalOfStudent(
            studentId,
            sortedWeeks[0].id
          );
          setSelfStudies(studies.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const cellStyle = { width: "100%", resize: "none", outline: "none" };
  const selectStyle = { width: "100%", outline: "none" };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="learning-journal-table-container">
      <div className="learning-journal-table">
        {/* Header */}
        <div className="learning-journal-row header-row">
          <div className="learning-journal-cell header">Date</div>
          <div className="learning-journal-cell header">Skills/Module</div>
          <div className="learning-journal-cell header">
            My lesson - What did I learn today?
          </div>
          <div className="learning-journal-cell header">Time allocation</div>
          <div className="learning-journal-cell header">Learning resources</div>
          <div className="learning-journal-cell header">
            Learning activities
          </div>
          <div className="learning-journal-cell header">Concentration</div>
          <div className="learning-journal-cell header">Plan & follow plan</div>
          <div className="learning-journal-cell header">
            Evaluation of my work
          </div>
          <div className="learning-journal-cell header">
            Reinforcing learning
          </div>
          <div className="learning-journal-cell header">Notes</div>
        </div>

        {selfStudies.length > 0 ? (
          selfStudies.map((study, index) => (
            <div className="learning-journal-row" key={study.id}>
              <div className="learning-journal-cell">
                <textarea
                  name={`date_${index}`}
                  rows="2"
                  style={cellStyle}
                  defaultValue={new Date(study.date).toLocaleDateString(
                    "en-GB"
                  )}
                />
              </div>
              <div className="learning-journal-cell">
                <select
                  name={`skill_${index}`}
                  defaultValue={study.subject_id}
                  style={selectStyle}
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="learning-journal-cell">
                <textarea
                  name={`lesson_${index}`}
                  rows="2"
                  style={cellStyle}
                  defaultValue={study.lesson}
                />
              </div>
              <div className="learning-journal-cell">
                <textarea
                  name={`time_${index}`}
                  rows="2"
                  style={cellStyle}
                  defaultValue={study.time_allocation}
                />
              </div>
              <div className="learning-journal-cell">
                {study.learning_resources.startsWith("http") ? (
                  <a
                    href={study.learning_resources}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {study.learning_resources}
                  </a>
                ) : (
                  <textarea
                    name={`resource_${index}`}
                    rows="2"
                    style={cellStyle}
                    defaultValue={study.learning_resources}
                  />
                )}
              </div>
              <div className="learning-journal-cell">
                <textarea
                  name={`activity_${index}`}
                  rows="2"
                  style={cellStyle}
                  defaultValue={study.learning_activities}
                />
              </div>
              <div className="learning-journal-cell">
                <select
                  name={`concentration_${index}`}
                  defaultValue={study.concentration}
                  style={selectStyle}
                >
                  <option value="1">Not sure</option>
                  <option value="0">No</option>
                  <option value="2">Yes</option>
                </select>
              </div>
              <div className="learning-journal-cell">
                <select
                  name={`plan_${index}`}
                  defaultValue={study.is_follow_plan ? "true" : "false"}
                  style={selectStyle}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="learning-journal-cell">
                <textarea
                  name={`evaluation_${index}`}
                  rows="2"
                  style={cellStyle}
                  defaultValue={study.evaluation}
                />
              </div>
              <div className="learning-journal-cell">
                <textarea
                  name={`reinforce_${index}`}
                  rows="2"
                  style={cellStyle}
                  defaultValue={study.reinforcing_learning}
                />
              </div>
              <div className="learning-journal-cell">
                <textarea
                  name={`notes_${index}`}
                  rows="2"
                  style={cellStyle}
                  defaultValue={study.notes}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="learning-journal-row">
            <div className="learning-journal-cell" colSpan="11">
              No self-study records found for this week.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
