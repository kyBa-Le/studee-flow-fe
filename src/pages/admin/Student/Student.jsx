import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Student.css';

export default function AllStudent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/students')
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="student-table__loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="student-table">
      <div className="student-table__header">
        <button className="student-table__add-button">+ Add students</button>
        <input
          type="text"
          className="student-table__search"
          placeholder="Search ..."
        />
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
          <button className="student-table__page-nav">&laquo;</button>
          <button className="student-table__page student-table__page--active">1</button>
          <button className="student-table__page">2</button>
          <button className="student-table__page">3</button>
          <button className="student-table__page-nav">&raquo;</button>
        </div>
      </div>
    </div>
  );
}

export { AllStudent };