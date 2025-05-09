import React, { useState, useEffect } from 'react';
import { getAllClassrooms } from '../../services/ClassroomService';
import './CreateStudentsForm.css';

export function CreateStudentsForm() {
    const [currentEmail, setCurrentEmail] = useState('');
    const [password, setPassword] = useState('');
    const [classroom, setClassroom] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [classes, setClasses] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [emailError, setEmailError] = useState('');
    const [editingStudent, setEditingStudent] = useState(null);

    useEffect(() => {
      const fetchClasses = async () => {
        try {
          const response = await getAllClassrooms();
          setClasses(response);
          if (response.length > 0) {
            setClassroom(response[0].classroom); 
          }
        } catch (error) {
          console.error("Failed to fetch classes:", error);
        }
      };
    
      fetchClasses();
    }, []);
    
    const handleAddEmail = () => {
      if (currentEmail) {
        const isDuplicate = studentList.some(
            (student, idx) => student.email === currentEmail && idx !== editingStudent?.index
        );
        if (isDuplicate) {
            setEmailError('Email already exists in the list!');
            return;
        }
    
        if (editingStudent !== null) {
            const updatedList = [...studentList];
            updatedList[editingStudent.index] = { email: currentEmail, password };
            setStudentList(updatedList);
            setEditingStudent(null);
        } else {
            setStudentList([...studentList, { email: currentEmail, password }]);
        }
    
        setCurrentEmail('');
        setPassword('');
        setEmailError('');
      }    
    };

    const handleEditStudent = (index) => {
      setEditingStudent({ index, email: studentList[index].email, password: studentList[index].password });
    };  

    const handleSaveEdit = (index) => {
      const updatedList = [...studentList];
      updatedList[index] = { 
        email: editingStudent.email, 
        password: editingStudent.password 
      };
      setStudentList(updatedList);
      setEditingStudent(null);
    };

    const handleCancelEdit = () => {
      setEditingStudent(null);
    };

    const handleDeleteStudent = (index) => {
        const newList = [...studentList];
        newList.splice(index, 1);
        setStudentList(newList);
        if (editingStudent?.index === index) {
          setEditingStudent(null);
        }
    };

    const handleCreate = () => {
        console.log('Student List:', studentList);
        console.log('Default Password:', password);
        console.log('Classroom:', classroom);
    };

    const handleCancel = () => {
        setCurrentEmail('');
        setPassword('');
        setStudentList([]);
        setEditingStudent(null);
        if (classes.length > 0) {
            setClassroom(classes[0].classroom);
        }
    };

    const handleEditFieldChange = (field, value) => {
      setEditingStudent(prev => ({
        ...prev,
        [field]: value
      }));
    };

    return (
        <div className="modal-create-student-accounts">
            <div className="modal-create-student-accounts-container">
                <div className="modal-create-student-accounts-content">
                  <h2 className="title-create-student-accounts">Create Student Accounts</h2>
                  <div className="body-create-student-accounts">
                      <div className="form-group">
                          <label htmlFor="email">Email address</label>
                          <input
                              type="email"
                              id="email"
                              value={currentEmail}
                              onChange={(e) => {
                                  setCurrentEmail(e.target.value);
                                  setEmailError(''); 
                              }}
                              placeholder="Email address"
                              className={emailError ? 'input-error' : ''}
                          />
                          {emailError && <p className="error-text">{emailError}</p>}
                          <div className="add-btn-create-student-accounts">
                              <button type="button" onClick={handleAddEmail} className="add-button">
                                  Add
                              </button>
                          </div>
                      </div>
                      <div className="form-password-classroom">
                          <div className="form-group">
                              <label htmlFor="password">Default password</label>
                              <div className="password-input-container">
                                  <input
                                      type={showPassword ? 'text' : 'password'}
                                      id="password"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      placeholder="Default password"
                                      className="password-input-field"
                                  />
                                  <button
                                      type="button"
                                      className="password-toggle-button"
                                      onClick={() => setShowPassword(!showPassword)}
                                  >
                                  </button>
                              </div>
                          </div>
                          <div className="form-group">
                              <label htmlFor="classroom">Classroom</label>
                              <div className="select-container">
                                  <select
                                      id="classroom"
                                      value={classroom}
                                      onChange={(e) => setClassroom(e.target.value)}
                                  >
                                      {classes.map((cls) => (
                                          <option key={cls.id} value={cls.classroom}>
                                              {cls.classroom}
                                          </option>
                                      ))}
                                  </select>
                                  <i className="fa fa-caret-down"></i>
                              </div>
                          </div>
                      </div>
                      <div className="student-list">
                        <div className="student-list-content">
                            <h3>Student List</h3>
                            {studentList.length > 0 ? (
                                <div className="student-list-table">
                                    <table className="student-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Email</th>
                                                <th>Password</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentList.map((student, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td className="email-cell">
                                                      {editingStudent?.index === index ? (
                                                        <input
                                                          type="email"
                                                          value={editingStudent.email}
                                                          onChange={(e) => handleEditFieldChange('email', e.target.value)}
                                                          className="edit-input"
                                                        />
                                                      ) : (
                                                        student.email
                                                      )}
                                                    </td>
                                                    <td className="password-cell">
                                                      {editingStudent?.index === index ? (
                                                        <input
                                                          type={showPassword ? 'text' : 'password'}
                                                          value={editingStudent.password}
                                                          onChange={(e) => handleEditFieldChange('password', e.target.value)}
                                                          className="edit-input"
                                                        />
                                                      ) : (
                                                        student.password
                                                      )}
                                                    </td>
                                                    <td className="action-buttons">
                                                      {editingStudent?.index === index ? (
                                                        <>
                                                          <button
                                                            type="button"
                                                            onClick={() => handleSaveEdit(index)}
                                                            className="save-edit-button"
                                                          >
                                                            <i className='fas fa-check'></i>
                                                          </button>
                                                          <button
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            className="cancel-edit-button"
                                                          >
                                                            <i className='fas fa-times'></i>
                                                          </button>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <button
                                                            type="button"
                                                            onClick={() => handleEditStudent(index)}
                                                            className="edit-button"
                                                          >
                                                            <i className='far fa-edit'></i>
                                                          </button>
                                                          <button
                                                            type="button"
                                                            onClick={() => handleDeleteStudent(index)}
                                                            className="delete-button"
                                                          >
                                                            <i className='far fa-trash-alt'></i>
                                                          </button>
                                                        </>
                                                      )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No students added yet.</p>
                            )}
                        </div>
                      </div>
                  </div>
                  <div className="footer-create-student-accounts">
                  <div className="total-display">
                    Total: {studentList.length}
                  </div>
                  <div className="footer-buttons">
                    <button type="button" onClick={handleCancel} className="cancel-button">
                      Cancel
                    </button>
                    <button type="button" onClick={handleCreate} className="create-button">
                      Create
                    </button>
                  </div>
                </div>
                </div>
            </div>
        </div>
    );
}
