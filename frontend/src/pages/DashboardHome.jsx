import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StatCard, StudentCard } from "../components";
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
  Present: "#10b981",
  Absent: "#f43f5e",
  Late: "#f59e0b",
  Unmarked: "#cbd5e1",
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
        <StatCard
          title="Total Enrolled"
          value={totalStudents}
          icon="👥"
          subtext="Active students"
        />
        <StatCard
          title="Present Today"
          value={presentStudents}
          color="#10b981"
          icon="✅"
          subtext="Checked in"
        />
        <StatCard
          title="Absent Today"
          value={absentStudents}
          color="#f43f5e"
          icon="❌"
          subtext="Unexcused / absent"
        />
        <StatCard
          title="Pending Fees"
          value={pendingFees}
          color="#f59e0b"
          icon="💰"
          subtext="Awaiting payment"
        />
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
            background: "linear-gradient(145deg, #ffffff 0%, #fffbfc 100%)",
            border: "1px solid rgba(251, 113, 133, 0.22)",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 10px 26px rgba(244, 63, 94, 0.06), 0 3px 10px rgba(245, 158, 11, 0.04)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--butter-ink)" }}>
              Weekly Attendance Trends
            </h3>
            <p style={{ fontSize: "13px", color: "var(--butter-muted)" }}>
              Daily student presence over the past 7 days
            </p>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" opacity={0.6} />
                <XAxis dataKey="day" stroke="#a18897" fontSize={12} tickLine={false} />
                <YAxis stroke="#a18897" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.96)",
                    borderRadius: "12px",
                    border: "1px solid #fce7f3",
                    boxShadow: "0 6px 18px rgba(244, 63, 94, 0.1)",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "13px" }} />
                <Area
                  type="monotone"
                  dataKey="present"
                  name="Present"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPresent)"
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  name="Absent"
                  stroke="#f43f5e"
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
            background: "linear-gradient(145deg, #ffffff 0%, #fffbfc 100%)",
            border: "1px solid rgba(251, 113, 133, 0.22)",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 10px 26px rgba(244, 63, 94, 0.06), 0 3px 10px rgba(245, 158, 11, 0.04)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--butter-ink)" }}>
              Today&apos;s Attendance Status
            </h3>
            <p style={{ fontSize: "13px", color: "var(--butter-muted)" }}>
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
              <StudentCard
                key={student._id}
                student={student}
                variant="compact"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;