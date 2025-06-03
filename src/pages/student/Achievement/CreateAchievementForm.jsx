import React, { useState, useRef } from 'react';
import "./CreateAchievementForm.css";
import AchievementImg from '../../../assests/images/AchievementImg.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateAchievementForm({ handleCreate, handleCanle, semesters }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    semester: '',
    image_link: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // NEW
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image_link: imageUrl
      }));
      setSelectedFile(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter the title!");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please enter the description!");
      return;
    }

    if (!formData.semester) {
      toast.error("Please select a semester!");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select an image!");
      return;
    }

    setIsCreating(true); 

    try {
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("upload_preset", "using_clouding_for_studee-flow");
      data.append("cloud_name", "dec0ihezw");

      const res = await fetch("https://api.cloudinary.com/v1_1/dec0ihezw/image/upload", {
        method: "POST",
        body: data
      });

      const uploaded = await res.json();

      const finalData = {
        ...formData,
        image_link: uploaded.secure_url
      };

      handleCreate(finalData);
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1 className="form-title">Create achievement</h1>

        <div
          className='achievement-img-container'
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        >
          <img
            className='achievement-img'
            src={formData.image_link || AchievementImg}
            alt='achievement'
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            placeholder="Enter title of achievement"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Description</label>
          <input
            id="content"
            name="content"
            type="text"
            placeholder="Enter description of achievement"
            value={formData.content}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="semester">Semester</label>
          <div className="select-container">
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Semester --</option>
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.name}>
                  {sem.name}
                </option>
              ))}
            </select>
            <i className="fa fa-caret-down"></i>
          </div>
        </div>

        <div className="button-group">
          <button type="button" onClick={handleCanle} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="create-button" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
