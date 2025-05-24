import React, { useEffect, useState } from 'react';
import { getAllStudents, deleteStudent } from '../../../services/UserService';
import './StudentManagement.css';
import { useNavigate } from 'react-router-dom';
import { LoadingData } from '../../../components/ui/Loading/LoadingData';

export function StudentManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const studentsPerPage = 40;

  useEffect(() => {
    setLoading(true);
    getAllStudents(currentPage, studentsPerPage)
      .then((res) => {
        console.log('API response:', res);
        setStudents(res.data);
        setTotalPages(res.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error calling API:', error);
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditClick = (student) => {
    navigate('/admin/edit-student-accounts', { state: { student } });
  }

  const handleDeleteClick = (student) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(student.id)
        .then(() => {
          setStudents(prevStudents => prevStudents.filter(s => s.id !== student.id));
        })
        .catch(error => {
          console.error('Failed to delete student:', error);
          alert('Failed to delete student. Please try again later.');
        });
    }
  }
  return (
    <div className="student-table vw-100">
      <div className="student-table__header">
        <button className="student-table__add-button" onClick={() => navigate("/admin/create-student-accounts")}>
          + Add students
        </button>
        <input type="text" className="student-table__search" placeholder="Search ..." />
      </div>

      <div className="student-table__content">
        <div className="student-table__scroll-wrapper">
          <table className="student-table__table">
            <thead>
              <tr className="student-table__row--head">
                <th className="student-table__cell">ID</th>
                <th className="student-table__cell">Student Name</th>
                <th className="student-table__cell">Email</th>
                <th className="student-table__cell">Class</th>
                <th className="student-table__cell">Gender</th>
                <th className="student-table__cell">Created_at</th>
                <th className="student-table__cell">Updated_at</th>
                <th className="student-table__cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9"><LoadingData content='Loading students' /></td>
                </tr>
              ) : (
                students?.map((student) => (
                  <tr key={student.id}>
                    <td className="student-table__cell">{student.id}</td>
                    <td className="student-table__cell">{student.full_name}</td>
                    <td className="student-table__cell">{student.email}</td>
                    <td className="student-table__cell">{student.classroom?.class_name}</td>
                    <td className="student-table__cell">{student.gender || 'N/A'}</td>
                    <td className="student-table__cell">
                      {new Date(student.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="student-table__cell">
                      {new Date(student.updated_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="student-table__cell">
                      <button
                        type="button"
                        onClick={() => handleEditClick(student)}
                        className="edit-button"
                        title="Edit"
                      >
                        <i className="far fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(student)}
                        className="delete-button"
                        title="Delete"
                      >
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="student-table__pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="student-table__page-nav">&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`student-table__page ${currentPage === i + 1 ? 'student-table__page--active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="student-table__page-nav">&gt;</button>
        </div>
      </div>
    </div>
  );
}
