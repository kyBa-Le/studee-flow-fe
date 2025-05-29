import React, { useState, useEffect } from 'react';
import { getAllStudentsByClassroomId } from '../../../services/UserService';
import { getStudentProgerssByStudentId } from '../../../services/StudentProgressService';
import { getAllSubjects } from "../../../services/SubjectService";
import { Link, useParams, useLocation } from 'react-router-dom';
import { StudentList } from '../StudentList/StudentList';
import { SubjectList } from '../SubjectList/SubjectList';
import "./Classroom.css";

export function Classroom() {
  const { classroomId } = useParams();
  const { state } = useLocation();
  const [data, setData] = useState({
    className: state?.className || '',
    students: [],
    progressData: {},
    subjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [isStudentList, setIsStudentList] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          getAllStudentsByClassroomId(classroomId),
          getAllSubjects(classroomId) 
        ]);

        const studentsList = studentsRes.data;
        const subjectsList = Array.isArray(subjectsRes.data) ? subjectsRes.data : [];

        const progressResults = await Promise.all(
          studentsList.map(student => getStudentProgerssByStudentId(student.id))
        );

        const progressMap = studentsList.reduce((acc, student, idx) => {
          acc[student.id] = progressResults[idx].data;
          return acc;
        }, {});

        setData({
          className: state?.className || '',
          students: studentsList,
          subjects: subjectsList,
          progressData: progressMap,
        });

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classroomId, state?.className]);

  const changeLayout = (isStudent) => {
    setIsStudentList(isStudent);
  };

  const handleChangeFeedback = (studentId, newFeedback) => {
    setData(prev => ({
      ...prev,
      progressData: {
        ...prev.progressData,
        [studentId]: [{
          ...prev.progressData[studentId]?.[0],
          learning_journal_feedback: newFeedback
        }]
      }
    }));
  };

  return (
    <div className='classroom-container'>
      <div className='classroom-content'>
        <div className='classroom-header'>
          <div className='classroom-header-top-row'>
            <div className='classroom-header-back-to-subject'>
              <Link to="/teacher/home" className="back-button">
                <i className="fa-solid fa-circle-arrow-left"></i>
              </Link>
              <h2 className="classroom-class-title">{data.className}</h2>
            </div>
            <div className='classroom-header-navigation'>
              <div className="classroom-tabs">
                <button
                  onClick={() => changeLayout(true)}
                  type="button"
                  className={`classroom-tab ${isStudentList ? "active" : ""}`}
                >
                  Students
                </button>
                <button
                  onClick={() => changeLayout(false)}
                  type="button"
                  className={`classroom-tab ${!isStudentList ? "active" : ""}`}
                >
                  Subjects
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          isStudentList
            ? <StudentList
                students={data.students}
                progressData={data.progressData}
                handleChangeFeedback={handleChangeFeedback}
              />
            : <SubjectList setSubject={setData} classroomId={classroomId} subjects={data.subjects} />
        )}
      </div>
    </div>
  );
}
