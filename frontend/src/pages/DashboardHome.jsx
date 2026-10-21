import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../hooks/useAuth";
import { getAttendanceStats } from "../services/attendanceService";

const PIE_COLORS = {
  Present: "#22c55e",
  Absent: "#ef4444",
  Late: "#f59e0b",
  Unmarked: "#94a3b8",
};

function DashboardHome({ students = [] }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAttendanceStats()
      .then((data) => {
        if (isMounted) {
          setStats(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load attendance stats:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [students]);

  const totalStudents = students.length;
  const presentStudents =
    stats?.today?.present ??
    students.filter((s) => s.status === "Present").length;
  const absentStudents =
    stats?.today?.absent ??
    students.filter((s) => s.status === "Absent").length;
  const pendingFees = students.filter(
    (s) => s.feeStatus === "Pending" || s.feeStatus === "Overdue"
  ).length;

  const attendancePieData = [
    { name: "Present", value: presentStudents },
    { name: "Absent", value: absentStudents },
    { name: "Late", value: stats?.today?.late ?? 0 },
    {
      name: "Unmarked",
      value:
        stats?.today?.unmarked ??
        Math.max(0, totalStudents - (presentStudents + absentStudents)),
    },
  ].filter((item) => item.value > 0);

  const fallbackTrend = [
    { day: "Mon", present: 0, absent: 0, late: 0 },
    { day: "Tue", present: 0, absent: 0, late: 0 },
    { day: "Wed", present: 0, absent: 0, late: 0 },
    { day: "Thu", present: 0, absent: 0, late: 0 },
    { day: "Fri", present: 0, absent: 0, late: 0 },
    { day: "Sat", present: 0, absent: 0, late: 0 },
    { day: "Sun", present: 0, absent: 0, late: 0 },
  ];

  const trendData =
    stats?.weeklyTrend && stats.weeklyTrend.length > 0
      ? stats.weeklyTrend
      : fallbackTrend;

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-card">
        <div>
          <h2>Welcome Back, {user?.name || "Tutor"} 👋</h2>
          <p>
            Manage your {user?.subject ? `${user.subject} ` : ""}students,
            daily attendance, and classroom analytics in one place.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Enrolled</h3>
          <p>{totalStudents}</p>
        </div>

        <div className="stat-card">
          <h3>Present Today</h3>
          <p style={{ color: "#16a34a" }}>{presentStudents}</p>
        </div>

        <div className="stat-card">
          <h3>Absent Today</h3>
          <p style={{ color: "#dc2626" }}>{absentStudents}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Fees</h3>
          <p style={{ color: "#d97706" }}>{pendingFees}</p>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div
        className="analytics-charts-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          margin: "28px 0",
        }}
      >
        {/* Weekly Trend Chart */}
        <div
          className="chart-card"
          style={{
            background: "var(--butter-surface, #fffdf7)",
            border: "1px solid rgba(241, 223, 164, 0.7)",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 8px 24px rgba(120, 83, 16, 0.06)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#222936" }}>
              Weekly Attendance Trends
            </h3>
            <p style={{ fontSize: "13px", color: "var(--butter-muted, #776846)" }}>
              Daily student presence over the past 7 days
            </p>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1dfa4" opacity={0.4} />
                <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.96)",
                    borderRadius: "12px",
                    border: "1px solid #f1dfa4",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "13px" }} />
                <Area
                  type="monotone"
                  dataKey="present"
                  name="Present"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPresent)"
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  name="Absent"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAbsent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Attendance Breakdown */}
        <div
          className="chart-card"
          style={{
            background: "var(--butter-surface, #fffdf7)",
            border: "1px solid rgba(241, 223, 164, 0.7)",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 8px 24px rgba(120, 83, 16, 0.06)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#222936" }}>
              Today&apos;s Attendance Status
            </h3>
            <p style={{ fontSize: "13px", color: "var(--butter-muted, #776846)" }}>
              Distribution of student presence today
            </p>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            {totalStudents === 0 ? (
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--butter-muted, #776846)",
                  fontSize: "14px",
                }}
              >
                No student data available to chart
              </div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={attendancePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {attendancePieData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={PIE_COLORS[entry.name] || "#d4a72c"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.96)",
                      borderRadius: "12px",
                      border: "1px solid #f1dfa4",
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "13px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/dashboard/students" className="action-btn">
          Manage Students
        </Link>
        <Link to="/dashboard/attendance" className="action-btn">
          Mark Attendance
        </Link>
      </div>

      {/* Recent Students */}
      <div className="recent-students">
        <h2>Recent Students</h2>

        <div className="recent-grid">
          {students.length === 0 ? (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "var(--butter-muted, #776846)",
                padding: "28px",
              }}
            >
              No students enrolled yet. Click &quot;Manage Students&quot; above to
              add your first student!
            </p>
          ) : (
            students.slice(0, 4).map((student) => (
              <div className="recent-card" key={student._id}>
                <img src={student.image} alt={student.name} />
                <h3>{student.name}</h3>
                <p>Section: {student.section || "General"}</p>
                <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span
                    className={
                      student.status === "Present"
                        ? "present-badge"
                        : "absent-badge"
                    }
                    style={{ fontSize: "11px", padding: "3px 8px" }}
                  >
                    {student.status}
                  </span>
                  {student.feeStatus && (
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "8px",
                        background:
                          student.feeStatus === "Paid"
                            ? "rgba(34, 197, 94, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color:
                          student.feeStatus === "Paid" ? "#16a34a" : "#dc2626",
                        fontWeight: 600,
                      }}
                    >
                      {student.feeStatus}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;