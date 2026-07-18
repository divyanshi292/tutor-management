import { useTheme } from "../hooks/useTheme";

const Settings = ({
  profileData,
  setProfileData,
}) => {
  const { darkMode, setDarkMode } = useTheme();

  // Handle Input Changes

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  // Save Button

  const handleSave = () => {
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="settings-page">

      <div className="settings-card">

        <h1>Tutor Settings</h1>

        {/* ================= PROFILE INFORMATION ================= */}

        <div className="section">

          <h2>Profile Information</h2>

          <label>Full Name</label>

          <input
            type="text"
            name="tutorName"
            value={profileData.tutorName}
            onChange={handleChange}
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
          />

          <label>Phone Number</label>

          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
          />

          <label>Location</label>

          <input
            type="text"
            name="location"
            value={profileData.location}
            onChange={handleChange}
          />

        </div>

        {/* ================= TEACHING DETAILS ================= */}

        <div className="section">

          <h2>Teaching Details</h2>

          <label>Subject Expertise</label>

          <input
            type="text"
            name="subject"
            value={profileData.subject}
            onChange={handleChange}
          />

          <label>Experience</label>

          <input
            type="text"
            name="experience"
            value={profileData.experience}
            onChange={handleChange}
          />

          <label>Teaching Mode</label>

          <select>
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>

        </div>

        {/* ================= STUDENT MANAGEMENT ================= */}

        <div className="section">

          <h2>Student Management</h2>

          {/* Notifications */}

          <div className="toggle">

            <span>Enable Notifications</span>

            <input
              type="checkbox"
              defaultChecked
            />

          </div>

          {/* Auto Approve */}

          <div className="toggle">

            <span>Auto Approve Student Requests</span>

            <input type="checkbox" />

          </div>

          {/* Dark Mode */}

          <div className="toggle">

            <span>Dark Mode</span>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={() =>
                setDarkMode(!darkMode)
              }
            />

          </div>

        </div>

        {/* ================= BUTTONS ================= */}

        <div className="button-group">

          <button
            className="save-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>

          

        </div>

      </div>

    </div>
  );
};

export default Settings;
