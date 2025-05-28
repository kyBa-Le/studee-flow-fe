import React, { useState, useEffect } from 'react';
import { createBulkStudents } from '../../../services/UserService';
import { getAllClassrooms } from '../../../services/UserService';
import './CreateStudentsForm.css';
import { toast } from "react-toastify";

export function CreateStudentsForm() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [classes, setClasses] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [emailError, setEmailError] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getAllClassrooms();
        setClasses(response.data);
        if (response.data.length > 0) {
          setClassroomId(response.data[0].id); 
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleAddEmail = () => {
    const emailCandidates = currentEmail
      .split(/[\s,;]+/)
      .map(e => e.trim())
      .filter(e => e);

    const newStudents = [];
    const errors = [];

    emailCandidates.forEach(email => {
      const isDuplicate = studentList.some(student => student.email === email);
      if (isDuplicate) {
        errors.push(email);
      } else {
        if (password != "") {
          newStudents.push({ email, password });
        } else {
          toast.warning("Please add the password!");
        }
      }
    });

    if (errors.length > 0) {
      setEmailError(`Duplicate email(s): ${errors.join(', ')}`);
    } else {
      setEmailError('');
    }

    if (newStudents.length > 0) {
      setStudentList(prev => [...prev, ...newStudents]);
      setCurrentEmail('');
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

  const handleCreate = async () => {
    if (studentList.length === 0) {
      toast.warning("Please add at least one student.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        emails: studentList.map(student => student.email),
        password,
        classroom_id: classroomId,
      };

      const response = await createBulkStudents(payload);
      console.log('Create success:', response.data);
      toast.success('Students created successfully!');
      handleCancel();

    } catch (error) {
      console.error('Failed to create students:', error);
      toast.error('Failed to create students!');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFieldChange = (field, value) => {
    setEditingStudent(prev => ({
      ...prev,
      [field]: value
    }));
  }
  const handleCancel = () => {
    window.location.href = "/admin/student-management";
  };

  return (
    <div className="modal-create-student-accounts">
      <div className="modal-create-student-accounts-container">
        <div className="modal-create-student-accounts-content">
          <h2 className="title-create-student-accounts">Create Student Accounts</h2>
          <div className="body-create-student-accounts">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input required
                type="email"
                id="email"
                value={currentEmail}
                onChange={(e) => {
                  setCurrentEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="Email address (multiple separated by space/comma/semicolon)"
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
                  <input required
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
                    value={classroomId}
                    onChange={(e) => setClassroomId(e.target.value)}
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name}
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
                    <table className="student-table-form">
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
              <button type="button" onClick={handleCreate} className="create-button" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
