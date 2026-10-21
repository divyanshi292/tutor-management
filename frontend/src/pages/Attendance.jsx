import { useEffect, useState } from "react";
import {
  getAttendanceByDate,
  saveAttendance,
} from "../services/attendanceService";

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

function Attendance({ students = [], setStudents }) {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [savingMsg, setSavingMsg] = useState("");

  const isToday = selectedDate === getTodayDateString();

  // Load attendance records for selected date
  useEffect(() => {
    let cancelled = false;

    getAttendanceByDate(selectedDate)
      .then((res) => {
        if (!cancelled) {
          const map = {};
          // Map existing records
          if (res.records && res.records.length > 0) {
            res.records.forEach((rec) => {
              const studentId =
                typeof rec.student === "object" ? rec.student._id : rec.student;
              map[studentId] = {
                status: rec.status,
                notes: rec.notes || "",
              };
            });
          }

          // Fill in students without explicit record for today using their default status
          students.forEach((s) => {
            if (!map[s._id]) {
              map[s._id] = {
                status: isToday ? s.status || "Present" : "Present",
                notes: "",
              };
            }
          });

          setAttendanceMap(map);
        }
      })
      .catch((err) => {
        console.error("Failed to load attendance for date:", err);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, students, isToday]);

  const handleStatusChange = async (studentId, newStatus) => {
    // Optimistic local update
    const previousMap = { ...attendanceMap };
    const updatedMap = {
      ...attendanceMap,
      [studentId]: {
        ...(attendanceMap[studentId] || {}),
        status: newStatus,
      },
    };
    setAttendanceMap(updatedMap);

    if (isToday && setStudents) {
      setStudents(
        students.map((s) =>
          s._id === studentId ? { ...s, status: newStatus } : s
        )
      );
    }

    try {
      await saveAttendance({
        date: selectedDate,
        studentId,
        status: newStatus,
      });
      setSavingMsg(`Saved for ${selectedDate}`);
      setTimeout(() => setSavingMsg(""), 2500);
    } catch (err) {
      console.error("Failed to save attendance:", err);
      setAttendanceMap(previousMap);
    }
  };

  const handleBatchMark = async (status) => {
    const records = students.map((s) => ({
      studentId: s._id,
      status,
    }));

    const updatedMap = {};
    students.forEach((s) => {
      updatedMap[s._id] = { status, notes: "" };
    });
    setAttendanceMap(updatedMap);

    if (isToday && setStudents) {
      setStudents(students.map((s) => ({ ...s, status })));
    }

    try {
      await saveAttendance({
        date: selectedDate,
        records,
      });
      setSavingMsg(`Marked all ${status} for ${selectedDate}`);
      setTimeout(() => setSavingMsg(""), 3000);
    } catch (err) {
      console.error("Batch attendance update failed:", err);
    }
  };

  const changeDateByDays = (delta) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + delta);
    setSelectedDate(cur.toISOString().slice(0, 10));
  };

  // Metrics for selected date
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = students.filter(
    (s) => attendanceMap[s._id]?.status === "Present"
  ).length;
  const absentCount = students.filter(
    (s) => attendanceMap[s._id]?.status === "Absent"
  ).length;
  const lateCount = students.filter(
    (s) => attendanceMap[s._id]?.status === "Late"
  ).length;
  const attendanceRate =
    students.length > 0
      ? Math.round(
          ((presentCount + lateCount * 0.5) / students.length) * 100
        )
      : 0;

  return (
    <div className="attendance-page">
      {/* Title & Date Controls */}
      <div className="attendance-header-bar">
        <div>
          <h1 className="attendance-title" style={{ marginBottom: "6px" }}>
            Attendance Tracker
          </h1>
          <p style={{ color: "var(--butter-muted, #776846)", fontSize: "14px" }}>
            Track and log daily attendance sessions with real-time sync.
          </p>
        </div>

        {/* Date Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="action-btn"
            style={{ padding: "8px 12px", fontSize: "13px" }}
            onClick={() => changeDateByDays(-1)}
          >
            ← Prev Day
          </button>

          <div className="attendance-date-picker-wrap">
            <span role="img" aria-label="calendar">📅</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {isToday && (
              <span
                style={{
                  fontSize: "11px",
                  background: "var(--butter-soft, #fff3c4)",
                  color: "#b88915",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "6px",
                }}
              >
                Today
              </span>
            )}
          </div>

          <button
            type="button"
            className="action-btn"
            style={{ padding: "8px 12px", fontSize: "13px" }}
            onClick={() => changeDateByDays(1)}
          >
            Next Day →
          </button>
        </div>
      </div>

      {/* Summary Chip Bar */}
      <div className="attendance-summary-bar">
        <div className="attendance-summary-chip">
          <span>Total Students:</span>
          <strong>{students.length}</strong>
        </div>
        <div className="attendance-summary-chip">
          <span>Present:</span>
          <strong style={{ color: "#16a34a" }}>{presentCount}</strong>
        </div>
        <div className="attendance-summary-chip">
          <span>Absent:</span>
          <strong style={{ color: "#dc2626" }}>{absentCount}</strong>
        </div>
        <div className="attendance-summary-chip">
          <span>Late:</span>
          <strong style={{ color: "#d97706" }}>{lateCount}</strong>
        </div>
        <div className="attendance-summary-chip">
          <span>Attendance Rate:</span>
          <strong style={{ color: "#b88915" }}>{attendanceRate}%</strong>
        </div>
      </div>

      {/* Action Controls & Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => handleBatchMark("Present")}
            style={{
              padding: "8px 14px",
              background: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            ✓ Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleBatchMark("Absent")}
            style={{
              padding: "8px 14px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            ✕ Mark All Absent
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {savingMsg && (
            <span
              style={{
                fontSize: "13px",
                color: "#16a34a",
                fontWeight: 600,
              }}
            >
              ✓ {savingMsg}
            </span>
          )}
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "14px",
              minWidth: "200px",
            }}
          />
        </div>
      </div>

      {/* Attendance List */}
      <div className="attendance-container">
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "36px",
              color: "var(--butter-muted, #776846)",
            }}
          >
            Loading attendance records...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "36px",
              color: "var(--butter-muted, #776846)",
            }}
          >
            {students.length === 0
              ? "No students enrolled. Add students to begin tracking attendance."
              : "No students matching your search."}
          </div>
        ) : (
          filteredStudents.map((student) => {
            const currentStatus =
              attendanceMap[student._id]?.status || "Present";

            return (
              <div className="attendance-card" key={student._id}>
                {/* Student Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <img
                    src={student.image}
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
                    onClick={() => handleStatusChange(student._id, "Present")}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    className={`status-pill-btn ${
                      currentStatus === "Late" ? "active-late" : ""
                    }`}
                    onClick={() => handleStatusChange(student._id, "Late")}
                  >
                    Late
                  </button>
                  <button
                    type="button"
                    className={`status-pill-btn ${
                      currentStatus === "Absent" ? "active-absent" : ""
                    }`}
                    onClick={() => handleStatusChange(student._id, "Absent")}
                  >
                    Absent
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Attendance;
