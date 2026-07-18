import { useParams } from "react-router-dom";

function StudentDetails({ students }) {

  const { id } = useParams();

  const student = students.find(
  (student) =>
    student._id === id
);

  if (!student) {
    return <h1>Student Not Found</h1>;
  }

  return (
    <div className="student-details-page">

      <div className="student-details-card">

        {/* Header */}

        <div className="details-header">

          <img
            src={student.image}
            alt={student.name}
            className="details-image"
          />

          <div className="details-info">

            <h1>{student.name}</h1>

            <p>
              Section:
              <span>
                {" "}
                {student.section}
              </span>
            </p>

            <div
              className={
                student.status === "Present"
                  ? "present-badge"
                  : "absent-badge"
              }
            >
              {student.status}
            </div>

          </div>

        </div>

        {/* Details Section */}

        <div className="details-grid">

          <div className="details-box">

            <h3>Attendance</h3>

            <p>{student.attendance}</p>

          </div>

          <div className="details-box">

            <h3>Email</h3>

            <p>
              {student.name
                .toLowerCase()
                .replace(" ", "")}
              @gmail.com
            </p>

          </div>

          <div className="details-box">

            <h3>Performance</h3>

            <p>Excellent</p>

          </div>

          <div className="details-box">

            <h3>Assignments</h3>

            <p>8 Completed</p>

          </div>

        </div>

        {/* Progress */}

        <div className="progress-section">

          <h2>Progress Overview</h2>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: student.attendance,
              }}
            ></div>

          </div>

          <p>
            Attendance Progress:
            {" "}
            {student.attendance}
          </p>

        </div>

      </div>

    </div>
  );
}

export default StudentDetails;