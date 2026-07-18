import React from "react";

import { useNavigate } from "react-router-dom";

const Profile = ({ profileData }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/dashboard/settings");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* Header Section */}
        <div className="profile-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
            alt="Tutor"
            className="profile-image"
          />

          <div className="profile-info">
            <h2>{profileData.tutorName}</h2>

            <p>{profileData.subject} Tutor</p>

            <span>{profileData.experience} Experience</span>
          </div>
        </div>

        {/* About Section */}
        <div className="profile-section">
          <h3>About</h3>

          <p>
            Passionate tutor helping students improve their academic
            performance through engaging and interactive learning methods.
          </p>
        </div>

        {/* Contact Information */}
        <div className="profile-section">
          <h3>Contact Information</h3>

          <div className="detail-row">
            <strong>Email:</strong>
            <span>{profileData.email}</span>
          </div>

          <div className="detail-row">
            <strong>Phone:</strong>
            <span>{profileData.phone}</span>
          </div>

          <div className="detail-row">
            <strong>Location:</strong>
            <span>{profileData.location}</span>
          </div>
        </div>

        {/* Teaching Details */}
        <div className="profile-section">
          <h3>Teaching Details</h3>

          <div className="detail-row">
            <strong>Subject Expertise:</strong>
            <span>{profileData.subject}</span>
          </div>

          <div className="detail-row">
            <strong>Teaching Mode:</strong>
            <span>Online & Offline</span>
          </div>

          <div className="detail-row">
            <strong>Students Enrolled:</strong>
            <span>120+</span>
          </div>

          <div className="detail-row">
            <strong>Ratings:</strong>
            <span>4.8 ⭐</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="profile-buttons">
          <button className="edit-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;