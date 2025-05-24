import React, { useState, useEffect } from 'react';
import './ProfileEdit.css';

export default function ProfileEdit({ profile, onSave, onCancel, errorMessage }) {
  const [localProfile, setLocalProfile] = useState({
    full_name: '',
    gender: 'male',
    avatar_link: '',
    email: '',
    className: '',
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setLocalProfile({
      ...profile,
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    });
    setLocalError('');
  }, [profile]);

  // Khi chọn ảnh mới, đọc file và cập nhật avatar_link thành base64 để preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile(prev => ({
          ...prev,
          avatar_link: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const { current_password, new_password, confirm_new_password } = localProfile;
    const hasAnyPassword = current_password || new_password || confirm_new_password;
    const hasAllPassword = current_password && new_password && confirm_new_password;

    if (hasAnyPassword && !hasAllPassword) {
      setLocalError('Please fill in all password fields to update password.');
      return;
    }
    if (new_password !== confirm_new_password) {
      setLocalError('New password and confirm password do not match!');
      return;
    }

    setSubmitting(true);

    try {
      const result = await onSave(localProfile);

      if (!result.status) {
        setLocalError(result.message || errorMessage || 'Update failed. Please check inputs.');
        setSubmitting(false);
        return;
      }

      if (result.avatar_link) {
        setLocalProfile(prev => ({
          ...prev,
          avatar_link: result.avatar_link,
        }));
      }

      setSubmitting(false);
    } catch (error) {
      setLocalError('An unexpected error occurred.');
      setSubmitting(false);
    }
  };


  return (
    <div className="profile-edit-container">
      <form className="profile-edit" onSubmit={handleSubmit}>
        <h2 className="profile-edit__title">Edit Profile</h2>

        {/* Click vào ảnh để chọn file */}
        <div
          className="profile-edit__avatar"
          onClick={() => document.getElementById('avatarInput').click()}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={localProfile.avatar_link || 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'}
            alt="Avatar"
            className="profile-edit__avatar-image"
          />
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="profile-edit__field">
          <label className="profile-edit__label">Full name</label>
          <input
            name="full_name"
            type="text"
            value={localProfile.full_name}
            onChange={handleChange}
            className="profile-edit__input"
            required
          />
        </div>

        <div className="profile-edit__row">
          <div className="profile-edit__field">
            <label className="profile-edit__label">Current password</label>
            <input
              type="password"
              name="current_password"
              value={localProfile.current_password}
              onChange={handleChange}
              className="profile-edit__input"
              required
            />
          </div>
          <div className="profile-edit__field">
            <label className="profile-edit__label">Email</label>
            <input
              type="email"
              name="email"
              value={localProfile.email}
              onChange={handleChange}
              className="profile-edit__input"
              required
            />
          </div>
        </div>

        <div className="profile-edit__row">
          <div className="profile-edit__field">
            <label className="profile-edit__label">New password</label>
            <input
              type="password"
              name="new_password"
              value={localProfile.new_password}
              onChange={handleChange}
              className="profile-edit__input"
            />
          </div>
          <div className="profile-edit__field">
            <label className="profile-edit__label">Gender</label>
            <select
              name="gender"
              value={localProfile.gender}
              onChange={handleChange}
              className="profile-edit__input"
              required
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
        </div>

        <div className="profile-edit__row">
          <div className="profile-edit__field">
            <label className="profile-edit__label">Confirm new password</label>
            <input
              type="password"
              name="confirm_new_password"
              value={localProfile.confirm_new_password}
              onChange={handleChange}
              className="profile-edit__input"
            />
          </div>
          <div className="profile-edit__field">
            <label className="profile-edit__label">Class</label>
            <select
              name="className"
              value={localProfile.className}
              onChange={handleChange}
              className="profile-edit__input"
              required
            >
              <option value="PNV26A">PNV26A</option>
              <option value="PNV26B">PNV26B</option>
            </select>
          </div>
        </div>

        {localError && <p className="profile-edit__error">{localError}</p>}

        <div className="profile-edit__buttons">
          <button
            type="button"
            className="profile-edit__button profile-edit__button--cancel"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="profile-edit__button profile-edit__button--update"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}
