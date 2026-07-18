import { Link } from "react-router-dom";

function DashboardHome({ students }) {

  // Total Students

  const totalStudents =
    students.length;

  // Present Students

  const presentStudents =
    students.filter(

      (student) =>
        student.status === "Present"

    ).length;

  // Absent Students

  const absentStudents =
    students.filter(

      (student) =>
        student.status === "Absent"

    ).length;

  return (

    <div className="dashboard-home">

      {/* Welcome Section */}

      <div className="welcome-card">

        <div>

          <h2>
            Welcome Back, Divyanshi 👋
          </h2>

          <p>
            Manage students,
            attendance and analytics
            from one dashboard.
          </p>

        </div>

      </div>

      {/* Analytics */}

      <div className="dashboard-stats">

        <div className="stat-card">

          <h3>Total Students</h3>

          <p>{totalStudents}</p>

        </div>

        <div className="stat-card">

          <h3>Present Today</h3>

          <p>{presentStudents}</p>

        </div>

        <div className="stat-card">

          <h3>Absent Today</h3>

          <p>{absentStudents}</p>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="quick-actions">

        <Link
          to="/dashboard/students"
          className="action-btn"
        >
          Manage Students
        </Link>

        <Link
          to="/dashboard/attendance"
          className="action-btn"
        >
          Mark Attendance
        </Link>

      </div>

      {/* Recent Students */}

      <div className="recent-students">

        <h2>Recent Students</h2>

        <div className="recent-grid">

          {students.slice(0, 4).map(
            (student) => (

              <div
                className="recent-card"
                key={student._id}
              >

                <img
                  src={student.image}
                  alt={student.name}
                />

                <h3>{student.name}</h3>

                <p>
                  Section:
                  {" "}
                  {student.section}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

}

export default DashboardHome;