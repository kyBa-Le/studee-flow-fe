import React, { useEffect, useState } from 'react';
import { getAllStudents } from '../../../services/UserService';
import './StudentManagement.css';

export function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const studentsPerPage = 40;

  useEffect(() => {
    setLoading(true);
    getAllStudents(currentPage, studentsPerPage)
      .then((res) => {
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

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><i className="fa-solid fa-spinner fa-spin"></i></div>;
  }

  return (
    <div className="student-table">
      <div className="student-table__header">
        <button className="student-table__add-button">+ Add students</button>
        <input type="text" className="student-table__search" placeholder="Search ..." />
      </div>

      <div className="student-table__content">
        <table className="student-table__table">
          <thead>
            <tr className="student-table__row student-table__row--head">
              <th className="student-table__cell">ID</th>
              <th className="student-table__cell">Student</th>
              <th className="student-table__cell">Status</th>
              <th className="student-table__cell">Email</th>
              <th className="student-table__cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr className="student-table__row" key={student.id}>
                <td className="student-table__cell">{student.id}</td>
                <td className="student-table__cell student-table__cell--bold">{student.name}</td>
                <td className="student-table__cell">
                  <select className="student-table__status-select" defaultValue={student.status}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td className="student-table__cell">{student.email}</td>
                <td className="student-table__cell">
                  <button className="student-table__action student-table__action--edit">✏️</button>
                  <button className="student-table__action student-table__action--delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="student-table__pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="student-table__page-nav">&laquo;</button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`student-table__page ${currentPage === i + 1 ? 'student-table__page--active' : ''}`}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="student-table__page-nav">&raquo;</button>
        </div>
      </div>
    </div>
  );
}
