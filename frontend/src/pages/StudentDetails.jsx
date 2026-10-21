import { Link, useParams } from "react-router-dom";
import studentAvatar from "../assets/student-avatar.svg";

function StudentDetails({ students, loading }) {
  const { id } = useParams();

  const student = students.find((s) => s._id === id);

  if (loading) {
    return (
      <div className="student-details-page">
        <div
          className="student-details-card"
          style={{ textAlign: "center", padding: "48px" }}
        >
          <h2>Loading student details...</h2>
          <p
            style={{
              marginTop: "8px",
              color: "var(--butter-muted, #776846)",
            }}
          >
            Retrieving student records from database...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-details-page">
        <div
          className="student-details-card"
          style={{ textAlign: "center", padding: "48px" }}
        >
          <h2>Student Not Found</h2>
          <p
            style={{
              marginTop: "12px",
              color: "var(--butter-muted, #776846)",
            }}
          >
            The requested student record does not exist or has been deleted.
          </p>
          <Link
            to="/dashboard/students"
            className="action-btn"
            style={{ display: "inline-block", marginTop: "24px" }}
          >
            ← Back to Students
          </Link>
        </div>
      </div>
    );
  }

  const attendancePercent = parseInt(student.attendance || "0", 10);
  const progressBarColor =
    attendancePercent >= 75
      ? "#22c55e"
      : attendancePercent >= 50
      ? "#f59e0b"
      : "#ef4444";

  const feeBg =
    student.feeStatus === "Paid"
      ? "rgba(34, 197, 94, 0.15)"
      : student.feeStatus === "Overdue"
      ? "rgba(239, 68, 68, 0.15)"
      : "rgba(245, 158, 11, 0.15)";
  const feeColor =
    student.feeStatus === "Paid"
      ? "#16a34a"
      : student.feeStatus === "Overdue"
      ? "#dc2626"
      : "#d97706";

  return (
    <div className="student-details-page">
      <Link
        to="/dashboard/students"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "18px",
          color: "var(--butter-deep, #4b3711)",
          fontWeight: 600,
          textDecoration: "none",
          fontSize: "14px",
        }}
      >
        ← Back to All Students
      </Link>

      <div className="student-details-card">
        {/* Header */}
        <div className="details-header">
          <img
            src={student.image || studentAvatar}
            alt={student.name}
            className="details-image"
          />

          <div className="details-info">
            <h1>{student.name}</h1>

            <p>
              Section: <span>{student.section || "General"}</span>
            </p>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
              <span
                className={
                  student.status === "Present"
                    ? "present-badge"
                    : student.status === "Late"
                    ? "late-badge"
                    : "absent-badge"
                }
                style={{ margin: 0 }}
              >
                Today: {student.status}
              </span>

              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "10px",
                  background: feeBg,
                  color: feeColor,
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Fee: {student.feeStatus || "Paid"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Profile Grid */}
        <div className="details-grid">
          <div className="details-box">
            <h3>Attendance Rate</h3>
            <p style={{ color: progressBarColor, fontWeight: 700 }}>
              {student.attendance || "0%"}
            </p>
          </div>

          <div className="details-box">
            <h3>Email</h3>
            <p>{student.email || "Not specified"}</p>
          </div>

          <div className="details-box">
            <h3>Phone</h3>
            <p>{student.phone || "Not specified"}</p>
          </div>

          <div className="details-box">
            <h3>Parent / Guardian</h3>
            <p>{student.parentName || "Not specified"}</p>
          </div>

          <div className="details-box">
            <h3>Parent Contact</h3>
            <p>{student.parentPhone || "Not specified"}</p>
          </div>

          <div className="details-box">
            <h3>Monthly Tuition Fee</h3>
            <p>
              {student.monthlyFee
                ? `₹${student.monthlyFee}`
                : "Not configured"}
            </p>
          </div>
        </div>

        {/* Teacher Notes */}
        {student.notes && (
          <div
            style={{
              margin: "24px 0",
              padding: "18px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #fff9db 0%, #fff0f5 100%)",
              border: "1px solid rgba(251, 113, 133, 0.3)",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--butter-ink)",
                marginBottom: "6px",
              }}
            >
              Teacher Notes & Remarks
            </h3>
            <p style={{ fontSize: "14px", color: "var(--butter-muted)", lineHeight: 1.5 }}>
              {student.notes}
            </p>
          </div>
        )}

        {/* Attendance Progress */}
        <div className="progress-section">
          <h2>Attendance Record Overview</h2>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: student.attendance || "0%",
                backgroundColor: progressBarColor,
              }}
            ></div>
          </div>

          <p>
            Current Overall Attendance: <strong>{student.attendance || "0%"}</strong>
          </p>
        </div>

        {/* Quick Action Footer */}
        <div style={{ marginTop: "28px", display: "flex", gap: "12px" }}>
          <Link to="/dashboard/attendance" className="action-btn">
            Log Attendance Session
          </Link>
          <Link
            to="/dashboard/students"
            className="action-btn"
            style={{
              background: "#fff5f8",
              color: "#e11d48",
              border: "1px solid rgba(251, 113, 133, 0.4)",
              boxShadow: "none",
            }}
          >
            Return to List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;