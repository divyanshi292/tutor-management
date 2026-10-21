import { useEffect, useState } from "react";
import { AttendanceRow, ConfirmModal, FeedbackAlert } from "../components";
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [pendingDateSwitch, setPendingDateSwitch] = useState(null);

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
          setHasUnsavedChanges(false);
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

  // Mark student locally without auto-saving directly
  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        status: newStatus,
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Mark all students locally without auto-saving directly
  const handleBatchMark = (status) => {
    const updatedMap = { ...attendanceMap };
    students.forEach((s) => {
      updatedMap[s._id] = {
        ...(updatedMap[s._id] || {}),
        status,
      };
    });
    setAttendanceMap(updatedMap);
    setHasUnsavedChanges(true);
  };

  // Explicit save action triggered by the button on top
  const handleSaveAttendance = async () => {
    if (students.length === 0) return true;
    setIsSaving(true);
    setFeedback({ type: "", text: "" });

    const records = Object.entries(attendanceMap).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      notes: data.notes || "",
    }));

    try {
      await saveAttendance({
        date: selectedDate,
        records,
      });

      if (isToday && setStudents) {
        setStudents(
          students.map((s) => ({
            ...s,
            status: attendanceMap[s._id]?.status || s.status,
          }))
        );
      }

      setHasUnsavedChanges(false);
      setFeedback({
        type: "success",
        text: `Attendance for ${selectedDate} saved successfully!`,
      });
      setTimeout(() => setFeedback({ type: "", text: "" }), 4000);
      return true;
    } catch (err) {
      console.error("Failed to save attendance:", err);
      setFeedback({
        type: "error",
        text: "Failed to save attendance records. Please try again.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const requestDateChange = (newDate) => {
    if (hasUnsavedChanges) {
      setPendingDateSwitch(newDate);
    } else {
      setSelectedDate(newDate);
    }
  };

  const changeDateByDays = (delta) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + delta);
    const nextDate = cur.toISOString().slice(0, 10);
    requestDateChange(nextDate);
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
      <FeedbackAlert
        type={feedback.type}
        message={feedback.text}
        onClose={() => setFeedback({ type: "", text: "" })}
      />

      {/* Title & Date Controls & Primary Save Button on Top */}
      <div className="attendance-header-bar">
        <div>
          <h1 className="attendance-title" style={{ marginBottom: "6px" }}>
            Attendance Tracker
          </h1>
          <p style={{ color: "var(--butter-muted, #776846)", fontSize: "14px" }}>
            Mark student presence below, then click &quot;Save Attendance&quot; to commit changes.
          </p>
        </div>

        {/* Top Controls: Date Selector + Primary Save Attendance Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Date Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              className="action-btn"
              style={{ padding: "8px 12px", fontSize: "13px" }}
              onClick={() => changeDateByDays(-1)}
            >
              ← Prev
            </button>

            <div className="attendance-date-picker-wrap">
              <span role="img" aria-label="calendar">📅</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => requestDateChange(e.target.value)}
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
              Next →
            </button>
          </div>

          {/* Primary Save Attendance Button on Top */}
          <button
            type="button"
            className={`attendance-save-btn ${hasUnsavedChanges ? "unsaved" : "saved"}`}
            onClick={handleSaveAttendance}
            disabled={isSaving || students.length === 0}
            title={hasUnsavedChanges ? "Click to save all marked attendance" : "All changes are saved"}
          >
            {isSaving ? (
              <>⏳ Saving...</>
            ) : hasUnsavedChanges ? (
              <>💾 Save Attendance *</>
            ) : (
              <>✓ Attendance Saved</>
            )}
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

      {/* Unsaved Changes Notice Banner */}
      {hasUnsavedChanges && (
        <div
          style={{
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #fffbeb 0%, #fff1f2 100%)",
            border: "1.5px solid rgba(251, 113, 133, 0.4)",
            borderRadius: "14px",
            padding: "12px 18px",
            boxShadow: "0 4px 14px rgba(244, 63, 94, 0.1)",
            animation: "modalFadeIn 0.3s ease",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#9f1239", fontSize: "13.5px", fontWeight: 600 }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            <span>You have unsaved attendance changes for {selectedDate}. Click &quot;Save Attendance&quot; above to commit.</span>
          </div>
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={isSaving}
            style={{
              background: "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)",
              color: "white",
              border: "none",
              padding: "7px 18px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(244, 63, 94, 0.3)",
            }}
          >
            {isSaving ? "Saving..." : "Save Now"}
          </button>
        </div>
      )}

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
              padding: "9px 16px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
            }}
          >
            ✓ Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleBatchMark("Absent")}
            style={{
              padding: "9px 16px",
              background: "linear-gradient(135deg, #fb7185, #f43f5e)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(244, 63, 94, 0.25)",
            }}
          >
            ✕ Mark All Absent
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
              <AttendanceRow
                key={student._id}
                student={student}
                currentStatus={currentStatus}
                onStatusChange={handleStatusChange}
              />
            );
          })
        )}
      </div>

      {/* Aesthetic Modal when switching dates with unsaved changes */}
      <ConfirmModal
        isOpen={Boolean(pendingDateSwitch)}
        title="Unsaved Attendance"
        message={`You have unsaved attendance marks for ${selectedDate}. If you navigate to ${pendingDateSwitch} without saving, your changes will be discarded.`}
        confirmText="Save & Continue"
        cancelText="Discard Changes"
        type="warning"
        loading={isSaving}
        onConfirm={async () => {
          const ok = await handleSaveAttendance();
          if (ok) {
            setSelectedDate(pendingDateSwitch);
            setPendingDateSwitch(null);
          }
        }}
        onCancel={() => {
          setHasUnsavedChanges(false);
          setSelectedDate(pendingDateSwitch);
          setPendingDateSwitch(null);
        }}
      />
    </div>
  );
}

export default Attendance;
