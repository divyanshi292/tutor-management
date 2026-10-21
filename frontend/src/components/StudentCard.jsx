import { Link } from "react-router-dom";
import studentAvatar from "../assets/student-avatar.svg";

function StudentCard({
  student,
  variant = "full",
  onEdit,
  onDelete,
}) {
  const isCompact = variant === "compact";

  const feeStatus = student.feeStatus || "Paid";
  const feeBg =
    feeStatus === "Paid"
      ? "rgba(16, 185, 129, 0.12)"
      : feeStatus === "Overdue"
      ? "rgba(244, 63, 94, 0.14)"
      : "rgba(245, 158, 11, 0.14)";
  const feeColor =
    feeStatus === "Paid"
      ? "#059669"
      : feeStatus === "Overdue"
      ? "#e11d48"
      : "#d97706";

  if (isCompact) {
    return (
      <div className="recent-card">
        <img
          src={student.image || studentAvatar}
          alt={student.name}
        />
        <h3>{student.name}</h3>
        <p>Section: {student.section || "General"}</p>
        <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
          <span
            className={
              student.status === "Present"
                ? "present-badge"
                : "absent-badge"
            }
            style={{ fontSize: "11px", padding: "3px 8px" }}
          >
            {student.status || "Unmarked"}
          </span>
          <span
            style={{
              fontSize: "11px",
              padding: "3px 8px",
              borderRadius: "8px",
              background: feeBg,
              color: feeColor,
              fontWeight: 600,
            }}
          >
            {feeStatus}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="student-card">
      <img
        src={student.image || studentAvatar}
        alt={student.name}
        className="student-image"
      />

      <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 6px 0" }}>
        {student.name}
      </h3>

      <p style={{ margin: "0 0 6px 0", color: "#64748b" }}>
        Section: <strong>{student.section || "General"}</strong>
      </p>

      <p style={{ margin: "0 0 10px 0" }}>
        Attendance: <strong>{student.attendance || "0%"}</strong>
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <span
          className={
            student.status === "Present"
              ? "present-badge"
              : "absent-badge"
          }
          style={{ margin: 0 }}
        >
          {student.status || "Unmarked"}
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
          Fee: {feeStatus}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="student-buttons">
        <Link
          to={`/dashboard/students/${student._id}`}
          className="view-btn"
        >
          View
        </Link>

        {onEdit && (
          <button
            type="button"
            className="edit-student-btn"
            onClick={() => onEdit(student)}
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className="delete-btn"
            onClick={() => onDelete(student)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default StudentCard;
