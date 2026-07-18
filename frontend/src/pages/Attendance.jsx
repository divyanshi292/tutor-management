import { updateStudent } from "../services/studentService";

function Attendance({

  students,

  setStudents,

}) {

  // ================= TOGGLE ATTENDANCE =================

  const toggleAttendance = async (
    student
  ) => {

    try {

      const updatedStatus =

        student.status === "Present"

          ? "Absent"

          : "Present";

      // Update MongoDB

      await updateStudent(student._id, { status: updatedStatus });

      // Update Frontend Instantly

      const updatedStudents =

        students.map((s) =>

          s._id === student._id

            ? {
                ...s,
                status: updatedStatus,
              }

            : s

        );

      setStudents(updatedStudents);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="attendance-page">

      {/* ================= TITLE ================= */}

      <h1 className="attendance-title">

        Attendance Tracker

      </h1>

      {/* ================= ATTENDANCE LIST ================= */}

      <div className="attendance-container">

        {students.map(

          (student) => (

            <div

              className="attendance-card"

              key={student._id}

            >

              {/* Student Info */}

              <div className="attendance-info">
                <h3>{student.name}</h3>
                <span

                  className={
                    student.status ===
                    "Present"
                      ? "present-badge"
                      : "absent-badge"
                  }
                >

                  {student.status}
                </span>

              </div>

              {/* Button */}

              <button
                className="attendance-btn"
                onClick={() =>
                  toggleAttendance(
                    student
                  )

                }

              >

                Mark {
                  student.status ===
                  "Present"
                    ? "Absent"
                    : "Present"
                }

              </button>

            </div>

          )

        )}

      </div>

    </div>

  );

}

export default Attendance;
