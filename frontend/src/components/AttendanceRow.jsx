function AttendanceRow({ student, currentStatus = "Present", onStatusChange }) {
  return (
    <div className="attendance-card" key={student._id}>
      {/* Student Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <img
          src={student.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt={student.name}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>
            {student.name}
          </h3>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "13px",
              color: "var(--butter-muted, #776846)",
            }}
          >
            Section: {student.section || "General"} • Total Attendance:{" "}
            {student.attendance || "0%"}
          </p>
        </div>
      </div>

      {/* Status Switcher Pills */}
      <div className="status-pill-group">
        <button
          type="button"
          className={`status-pill-btn ${
            currentStatus === "Present" ? "active-present" : ""
          }`}
          onClick={() => onStatusChange(student._id, "Present")}
        >
          Present
        </button>
        <button
          type="button"
          className={`status-pill-btn ${
            currentStatus === "Late" ? "active-late" : ""
          }`}
          onClick={() => onStatusChange(student._id, "Late")}
        >
          Late
        </button>
        <button
          type="button"
          className={`status-pill-btn ${
            currentStatus === "Absent" ? "active-absent" : ""
          }`}
          onClick={() => onStatusChange(student._id, "Absent")}
        >
          Absent
        </button>
      </div>
    </div>
  );
}

export default AttendanceRow;
