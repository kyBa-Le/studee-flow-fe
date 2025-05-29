import React, { useEffect, useState } from 'react';
import { getUser, updateOwnProfile } from '../../../services/UserService';
import TeacherEditProfile from './TeacherEditProfile';
import './TeacherProfile.css';
import { ButtonEdit } from "../../../components/ui/Button/Edit/ButtonEdit";


export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    gender: '',
    avatar_link: '',
    className: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUser();
        const data = response.data.data || response.data;
        console.log('Profile data:', data);
        setProfile({
          full_name: data.full_name || '',
          email: data.email || '',
          gender: data.gender || '',
          avatar_link: data.avatar_link || '',
          className: data.className || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setErrorMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage('');
  };

  const handleSave = async (updatedProfile) => {
    setErrorMessage('');
    try {
      await updateOwnProfile(updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      return true; 
    } catch (error) {
      setErrorMessage('Update failed. Please check your current password and inputs.');
      return false;
    }
  };

  if (isEditing) {
    return (
      <TeacherEditProfile
        profile={profile}
        onSave={handleSave}
        onCancel={handleCancel}
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <div className="profile__container">
      <div className="profile__card">
        <div className="profile__avatar-section">
          <img
            src={profile.avatar_link || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
            alt="Avatar"
            border="2"
          />
          <h2 className="profile__name">{profile.full_name || 'User Name'}</h2>
        </div>

        <form className="profile__form">
          <div className="profile__group">
            <label className="profile__label">Full name</label>
            <input
              type="text"
              value={profile.full_name}
              className="profile__input"
              readOnly
            />
          </div>

          <div className="profile__group-row">
            <div className="profile__group">
              <label className="profile__label">Password</label>
              <input type="password" value="********" className="profile__input" readOnly />
            </div>
            <div className="profile__group">
              <label className="profile__label">Email</label>
              <input type="email" value={profile.email} className="profile__input" readOnly />
            </div>
          </div>

          <div className="profile__group-row">
            <div className="profile__group">
              <label className="profile__label">Gender</label>
              <select value={profile.gender} className="profile__select" disabled>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
          </div>
          <div className="profile__button-container">
            <ButtonEdit type="button" className="profile__button" onClick={handleEditClick}>Edit</ButtonEdit>
          </div>
        </form>
      </div>
    </div>
  );
}
