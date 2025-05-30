import React, { useState, useEffect } from 'react';
import { getAllStudentsByClassroomId } from '../../../services/UserService';
import { getStudentProgerssByStudentId } from '../../../services/StudentProgressService';
import { getAllSubjects } from "../../../services/SubjectService";
import { Link, useParams, useLocation } from 'react-router-dom';
import { StudentList } from '../StudentList/StudentList';
import { SubjectList } from '../SubjectList/SubjectList';
import "./Classroom.css";
import goalIcon from "../../../assests/images/goal-icon.png";

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
  const totalStudent = data.students.length;

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
            <div className='classroom-header-navigation d-flex justify-content-between'>
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
              <div className='classroom-info-components' >
                <div className="student-list-count-wrap cursor-pointer">
                  <div className="weekly-checkup-block">
                    <span className="weekly-checkup-icon"><img style={{width: "40px", height: "40px", aspectRatio: 1}} src={goalIcon} /></span>
                    <span className="content"> Weekly checkup </span>
                  </div>
                </div>
                <div className="student-list-count-wrap">
                  <div className="student-list-count">
                    <span className="student-list-count-icon"><i class="fa-solid fa-user-graduate"></i></span>
                    <span className="count">{totalStudent > 1 ? totalStudent + " students" : totalStudent + " student"} </span>
                  </div>
                </div>
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
