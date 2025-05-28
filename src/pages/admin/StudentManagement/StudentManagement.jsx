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
  const [centerButton, setCenterButton] = useState(1);
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

  function renderPaginationButtons() {
    const startPage = Math.max(1, centerButton - 1);
    const endPage = Math.min(totalPages, centerButton + 1);
    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`student-table__page ${currentPage === i ? 'student-table__page--active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  }

  function handleArrowClick(direction) {
    let newCenter = centerButton + direction;
    newCenter = Math.max(1, Math.min(totalPages, newCenter));
    setCenterButton(newCenter);
  }

  return (
    <div className="student-table vw-100">
      <div className="student-table__header">
        <button className="student-table__add-button" onClick={() => navigate("/admin/create-student-accounts")}>
          + Add students
        </button>
        <form id="search-box">
          <input type="text" placeholder="Search ..." />
          <div id="search-icon">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </form>
      </div>

      <div className="student-table__content">
        <div className="student-table__scroll-wrapper">
          <table className="student-table__table">
            <colgroup>
              <col style={{ width: '6.25%' }} />  
              <col style={{ width: '15.75%' }} />  
              <col style={{ width: '18.75%' }} /> 
              <col style={{ width: '18.75%' }} />  
              <col style={{ width: '12.5%' }} />   
              <col style={{ width: '12.5%' }} />   
              <col style={{ width: '12.5%' }} />   
              <col style={{ width: '12.5%' }} />   
            </colgroup>
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
          </table>
          <div style={{maxHeight: "60vh", overflowY: "scroll"}}>
            <table className='student-table__table' style={{fontSize: "12px"}}>
              <colgroup>
                <col style={{ width: '6.25%' }} />   
                <col style={{ width: '15.75%' }} />  
                <col style={{ width: '18.75%' }} />  
                <col style={{ width: '18.75%' }} /> 
                <col style={{ width: '12.5%' }} />   
                <col style={{ width: '12.5%' }} />  
                <col style={{ width: '12.5%' }} />  
                <col style={{ width: '12.5%' }} />   
              </colgroup>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8"><LoadingData content='Loading students' /></td>
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
        </div>

        {/* Updated Pagination */}
        <div className="pagination-place ">
          <div className="pagination-container">
            <i className="fa-solid fa-chevron-left" onClick={() => handleArrowClick(-3)}></i>
            <div className="pagination-buttons">
              {renderPaginationButtons()}
            </div>
            <i className="fa-solid fa-chevron-right" onClick={() => handleArrowClick(3)}></i>
          </div>
        </div>
      </div>
    </div>
  );
}