import { useNavigate } from "react-router-dom";

const Profile = ({ user, students }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/dashboard/settings");
  };

  const name = user?.name || "Tutor";
  const subject = user?.subject || "General";
  const experience = user?.experience || "1+ Year";
  const email = user?.email || "tutor@example.com";
  const phone = user?.phone || "Not configured";
  const location = user?.location || "Not specified";
  const bio =
    user?.bio ||
    "Passionate tutor helping students improve their academic performance through engaging and interactive learning methods.";
  const teachingMode = user?.teachingMode || "Online & Offline";
  const enrolledCount = students?.length ? `${students.length} Student${students.length > 1 ? "s" : ""}` : "0 Students";

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
            alt="Tutor avatar"
            className="profile-image"
          />

          <div className="profile-info">
            <h2>{name}</h2>
            <p>{subject} Tutor</p>
            <span>{experience} Experience</span>
          </div>
        </div>

        {/* About Section */}
        <div className="profile-section">
          <h3>About</h3>
          <p>{bio}</p>
        </div>

        {/* Contact Information */}
        <div className="profile-section">
          <h3>Contact Information</h3>

          <div className="detail-row">
            <strong>Email:</strong>
            <span>{email}</span>
          </div>

          <div className="detail-row">
            <strong>Phone:</strong>
            <span>{phone}</span>
          </div>

          <div className="detail-row">
            <strong>Location:</strong>
            <span>{location}</span>
          </div>
        </div>

        {/* Teaching Details */}
        <div className="profile-section">
          <h3>Teaching Details</h3>

          <div className="detail-row">
            <strong>Subject Expertise:</strong>
            <span>{subject}</span>
          </div>

          <div className="detail-row">
            <strong>Teaching Mode:</strong>
            <span>{teachingMode}</span>
          </div>

          <div className="detail-row">
            <strong>Active Students:</strong>
            <span>{enrolledCount}</span>
          </div>

          <div className="detail-row">
            <strong>Ratings:</strong>
            <span>4.9 ⭐ (Student Feedback)</span>
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
