import React, { useState, useEffect } from 'react';
import './ProfileEdit.css';
import { CancelButton } from "../../../components/ui/Button/Cancel/CancelButton";
import { UpdateButton } from "../../../components/ui/Button/Update/UpdateButton";

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
  const [loading, setLoading] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

  useEffect(() => {
    setLocalProfile({
      ...profile,
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    });
    setSelectedAvatarFile(null);
    setLocalError('');
  }, [profile]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedAvatarFile(file);
    const preview = URL.createObjectURL(file);
    setLocalProfile(prev => ({
      ...prev,
      avatar_link: preview,
    }));
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
    setSubmitting(true);
    setLoading(true);

    const { current_password, new_password, confirm_new_password } = localProfile;
    const hasAnyPassword = current_password || new_password || confirm_new_password;
    const hasAllPassword = current_password && new_password && confirm_new_password;

    if (hasAnyPassword && !hasAllPassword) {
      setLocalError('Please fill in all password fields to update password.');
      setSubmitting(false);
      setLoading(false);
      return;
    }

    if (new_password !== confirm_new_password) {
      setLocalError('New password and confirm password do not match!');
      setSubmitting(false);
      setLoading(false);
      return;
    }

    let uploadedImageUrl = localProfile.avatar_link;

    if (selectedAvatarFile) {
      const data = new FormData();
      data.append("file", selectedAvatarFile);
      data.append("upload_preset", "using_clouding_for_studee-flow");
      data.append("cloud_name", "dec0ihezw");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dec0ihezw/image/upload", {
          method: "POST",
          body: data,
        });

        if (!res.ok) throw new Error("Avatar upload failed");

        const uploaded = await res.json();
        uploadedImageUrl = uploaded.secure_url || uploaded.url;
      } catch (error) {
        console.error("Upload error:", error);
        setLocalError("Avatar upload failed. Please try again.");
        setSubmitting(false);
        setLoading(false);
        return;
      }
    }

    const updatedProfile = {
      ...localProfile,
      avatar_link: uploadedImageUrl,
    };

    try {
      const result = await onSave(updatedProfile);

      if (!result.status) {
        setLocalError(result.message || errorMessage || 'Update failed. Please check inputs.');
        setSubmitting(false);
        setLoading(false);
        return;
      }

      setLocalProfile(prev => ({
        ...prev,
        avatar_link: result.avatar_link || uploadedImageUrl,
      }));
    } catch (error) {
      setLocalError('An unexpected error occurred.');
    }

    setSubmitting(false);
    setLoading(false);
  };


  return (
    <div className="profile-edit-container">
      <form className="profile-edit" onSubmit={handleSubmit}>
        <h2 className="profile-edit__title">Edit Profile</h2>

        <div className="profile-edit__avatar-upload">
          <input
            type="file"
            id="avatar-upload"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <div
            onClick={() => document.getElementById("avatar-upload").click()}
            className="profile-edit__avatar-preview"
          >
            {loading ? (
              <p>Uploading...</p>
            ) : (
               <img
                  src={localProfile.avatar_link || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                  alt="Avatar"
                  className="profile-edit__avatar-image"
               />
            )}
          </div>
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
              readOnly
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
              disabled
            >
              <option value="PNV26A">PNV26A</option>
              <option value="PNV26B">PNV26B</option>
            </select>
          </div>
        </div>

        {localError && <p className="profile-edit__error">{localError}</p>}

        <div className="profile-edit__buttons">
          <CancelButton
            type="button"
            className="profile-edit__button profile-edit__button--cancel"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </CancelButton>
          <UpdateButton
            type="submit"
            className="profile-edit__button profile-edit__button--update"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update'}
          </UpdateButton>
        </div>
      </form>
    </div>
  );
}
