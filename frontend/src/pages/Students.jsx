import { Link } from "react-router-dom";
import { useState } from "react";
import {
  createStudent,
  deleteStudent,
  updateStudent,
} from "../services/studentService";

function Students({ students, refreshStudents }) {

  // ================= NEW STUDENT =================

  const [newStudent, setNewStudent] = useState({
    name: "",
    attendance: "",
    status: "Present",
  });

  // ================= OTHER STATES =================

  const [search, setSearch] = useState("");

  const [sortOrder, setSortOrder] =
    useState("asc");

  const [editId, setEditId] =
    useState(null);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });

  };

  // ================= ADD STUDENT =================

  const handleAddStudent = async () => {

    if (
      newStudent.name === "" ||
      newStudent.attendance === ""
    ) {

      alert("Please fill all fields");

      return;
    }

    try {

      // ================= UPDATE =================

      if (editId !== null) {

        await updateStudent(editId, {
            name: newStudent.name,
            attendance:
              newStudent.attendance,
          });

        setEditId(null);

      } else {

        // ================= ADD =================

        await createStudent({
            name: newStudent.name,
            section: "General",
            attendance:
              newStudent.attendance,

            status: "Present",
          });

      }

      // Refresh Students

      await refreshStudents();

      // Reset Form

      setNewStudent({
        name: "",
        attendance: "",
        status: "Present",
      });

    } catch (error) {

      console.log(error);

    }

  };

  // ================= DELETE =================

  const handleDelete = async (id) => {

    try {

      await deleteStudent(id);
      await refreshStudents();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= EDIT =================

  const handleEdit = (student) => {

    setNewStudent({
      name: student.name,
      attendance: student.attendance,
    });

    setEditId(student._id);

  };

  // ================= SEARCH + SORT =================

  const filteredStudents = students

    .filter((student) =>
      student.name
        .toLowerCase()
        .includes(search.toLowerCase())

    )

    .sort((a, b) => {

      if (sortOrder === "asc") {
        return a.name.localeCompare(
          b.name
        );

      } else {
        return b.name.localeCompare(
          a.name
        );
      }

    });

  return (
    <div className="students-page">

      <h2 className="students-title">
        Students Management
      </h2>

      {/* ================= SEARCH ================= */}

      <input
        type="text"
        placeholder="Search Students..."
        className="search-input"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* ================= SORT ================= */}

      <select
        className="sort-select"
        value={sortOrder}
        onChange={(e) =>
          setSortOrder(e.target.value)
        }
      >

        <option value="asc">
          Sort A → Z
        </option>

        <option value="desc">
          Sort Z → A
        </option>

      </select>

      {/* ================= FORM ================= */}

      <div className="student-form">

        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={newStudent.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="attendance"
          placeholder="Attendance %"
          value={newStudent.attendance}
          onChange={handleChange}
        />

        <button onClick={handleAddStudent}>

          {editId !== null
            ? "Update Student"
            : "Add Student"}

        </button>

      </div>

      {/* ================= STUDENTS GRID ================= */}

      <div className="students-grid">

        {filteredStudents.map((student) => (

          <div
            className="student-card"
            key={student._id}
          >

            <img
              src={student.image}
              alt={student.name}
              className="student-image"
            />

            <h3>{student.name}</h3>
            <br></br>

            <p>
              Attendance:
              <span>
                {" "}
                {student.attendance}
              </span>
            </p>

            {/* ================= BUTTONS ================= */}

            <div className="student-buttons">

              <Link
                to={`/dashboard/students/${student._id}`}
                className="view-btn"
              >
                View
              </Link>

              <button
                className="edit-student-btn"
                onClick={() =>
                  handleEdit(student)
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(student._id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Students;
