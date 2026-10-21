import { useState } from "react";
import { FeedbackAlert } from "../components";
import { useTheme } from "../hooks/useTheme";

const getInitialFormData = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  phone: user?.phone || "",
  location: user?.location || "",
  bio: user?.bio || "",
  subject: user?.subject || "",
  experience: user?.experience || "",
  teachingMode: user?.teachingMode || "Online & Offline",
  notificationsEnabled: user?.notificationsEnabled ?? true,
  autoApprove: user?.autoApprove ?? false,
});

const Settings = ({ user, updateUserProfile }) => {
  const { darkMode, setDarkMode } = useTheme();

  const [prevUser, setPrevUser] = useState(user);
  const [formData, setFormData] = useState(() => getInitialFormData(user));

  if (user !== prevUser) {
    setPrevUser(user);
    setFormData(getInitialFormData(user));
  }

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: "", text: "" });

    try {
      if (updateUserProfile) {
        await updateUserProfile({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          subject: formData.subject,
          experience: formData.experience,
          teachingMode: formData.teachingMode,
          notificationsEnabled: formData.notificationsEnabled,
          autoApprove: formData.autoApprove,
        });
      }
      setFeedback({
        type: "success",
        text: "Profile settings saved successfully!",
      });
      setTimeout(() => {
        setFeedback({ type: "", text: "" });
      }, 4000);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h1>Tutor Settings</h1>

        <FeedbackAlert
          type={feedback.type}
          message={feedback.text}
          onClose={() => setFeedback({ type: "", text: "" })}
        />

        <form onSubmit={handleSave}>
          {/* ================= PROFILE INFORMATION ================= */}
          <div className="section">
            <h2>Profile Information</h2>

            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
            />

            <label>Email (Account ID - Read Only)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              style={{ opacity: 0.7, cursor: "not-allowed" }}
            />

            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />

            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="City, State"
              value={formData.location}
              onChange={handleChange}
            />

            <label>Bio / About</label>
            <textarea
              name="bio"
              rows={3}
              placeholder="Brief introduction about your teaching style..."
              value={formData.bio}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontFamily: "inherit",
                fontSize: "14px",
                marginBottom: "16px",
                resize: "vertical",
              }}
            />
          </div>

          {/* ================= TEACHING DETAILS ================= */}
          <div className="section">
            <h2>Teaching Details</h2>

            <label>Subject Expertise</label>
            <input
              type="text"
              name="subject"
              placeholder="e.g. Mathematics, Physics"
              value={formData.subject}
              onChange={handleChange}
            />

            <label>Experience</label>
            <input
              type="text"
              name="experience"
              placeholder="e.g. 3 Years, 5+ Years"
              value={formData.experience}
              onChange={handleChange}
            />

            <label>Teaching Mode</label>
            <select
              name="teachingMode"
              value={formData.teachingMode}
              onChange={handleChange}
            >
              <option value="Online & Offline">Online &amp; Offline</option>
              <option value="Online Only">Online Only</option>
              <option value="Offline Only">Offline Only</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* ================= PREFERENCES & MANAGEMENT ================= */}
          <div className="section">
            <h2>Preferences &amp; Display</h2>

            {/* Notifications */}
            <div className="toggle">
              <span>Enable Notifications</span>
              <input
                type="checkbox"
                name="notificationsEnabled"
                checked={formData.notificationsEnabled}
                onChange={handleChange}
              />
            </div>

            {/* Auto Approve */}
            <div className="toggle">
              <span>Auto Approve Student Requests</span>
              <input
                type="checkbox"
                name="autoApprove"
                checked={formData.autoApprove}
                onChange={handleChange}
              />
            </div>

            {/* Dark Mode */}
            <div className="toggle">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </div>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="button-group">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
