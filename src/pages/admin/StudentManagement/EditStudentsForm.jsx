import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, data } from 'react-router-dom';
import { getAllClassrooms, updateStudent } from '../../../services/UserService';
import './EditStudentsForm.css';

export function EditStudentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student;

  useEffect(() => {
    if (!student) {
      navigate('/admin/student-management');
    }
  }, [student, navigate]);

  const [fullName, setFullName] = useState(student?.full_name || '');
  const [password, setPassword] = useState(student?.password || '');
  const [email, setEmail] = useState(student?.email || '');
  const [gender, setGender] = useState(student?.gender || 'Female');
  const [classroomId, setClassroomId] = useState(student?.classroom?.id || '');
  const [classes, setClasses] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getAllClassrooms();
        setClasses(response.data);
        if (!classroomId && response.data.length > 0) {
          setClassroomId(response.data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedStudent = {
        id: student.id,
        full_name: fullName,
        email,
        password,
        gender,
        student_classroom_id: classroomId,
      };

      await updateStudent(updatedStudent);
      alert('Student updated successfully!');
      navigate('/admin/student-management');
    } catch (error) {
      console.error('Update failed:', data);
      alert('Failed to update student!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/student-management');
  };

  if (!student) return null;

  return (
    <div className="modal-edit-student">
      <div className="edit-student-container">
        <h2 className="edit-title">Edit Student</h2>

        <div className="avatar-placeholder">
          <img src={student.avatar_link ?? "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"} alt="Avatar" border="2"/>
        </div>

        <div className="form-group full-width">
          <label>Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? (
                  <i className="far fa-eye-slash"></i>
                ) : (
                  <i className="far fa-eye"></i>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div className="form-group">
            <label>Class</label>  
            <select
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="footer-buttons">
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="create-button"
            disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
