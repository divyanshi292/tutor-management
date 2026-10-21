import { useState } from "react";
import { Link } from "react-router-dom";
import {
  createStudent,
  deleteStudent,
  updateStudent,
} from "../services/studentService";

const initialStudentState = {
  name: "",
  section: "General",
  email: "",
  phone: "",
  parentName: "",
  parentPhone: "",
  feeStatus: "Paid",
  monthlyFee: "",
  notes: "",
  attendance: "0%",
  status: "Present",
};

function Students({ students, refreshStudents }) {
  const [formState, setFormState] = useState(initialStudentState);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  // Extract unique sections for filter dropdown
  const sections = Array.from(
    new Set(students.map((s) => s.section || "General"))
  ).filter(Boolean);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: "", text: "" }), 3500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.name.trim()) {
      showFeedback("error", "Student name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formState.name.trim(),
        section: formState.section.trim() || "General",
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        parentName: formState.parentName.trim(),
        parentPhone: formState.parentPhone.trim(),
        feeStatus: formState.feeStatus || "Paid",
        monthlyFee: Number(formState.monthlyFee) || 0,
        notes: formState.notes.trim(),
        attendance: formState.attendance || "0%",
        status: formState.status || "Present",
      };

      if (editId !== null) {
        await updateStudent(editId, payload);
        showFeedback("success", `Updated student "${payload.name}" successfully!`);
        setEditId(null);
      } else {
        await createStudent(payload);
        showFeedback("success", `Added new student "${payload.name}" successfully!`);
      }

      await refreshStudents();
      setFormState(initialStudentState);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Save student error:", error);
      showFeedback(
        "error",
        error.response?.data?.message || "Failed to save student record."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setFormState({
      name: student.name || "",
      section: student.section || "General",
      email: student.email || "",
      phone: student.phone || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      feeStatus: student.feeStatus || "Paid",
      monthlyFee: student.monthlyFee || "",
      notes: student.notes || "",
      attendance: student.attendance || "0%",
      status: student.status || "Present",
    });
    setEditId(student._id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to remove ${student.name}?`)) {
      return;
    }

    try {
      await deleteStudent(student._id);
      showFeedback("success", `Removed student "${student.name}".`);
      await refreshStudents();
    } catch (error) {
      console.error("Delete student error:", error);
      showFeedback("error", "Failed to delete student record.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormState(initialStudentState);
    setIsFormOpen(false);
  };

  // Search & Filter & Sort
  const filteredStudents = students
    .filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        (student.section &&
          student.section.toLowerCase().includes(search.toLowerCase())) ||
        (student.email &&
          student.email.toLowerCase().includes(search.toLowerCase()));

      const matchSection =
        sectionFilter === "all" || (student.section || "General") === sectionFilter;

      const matchFee =
        feeFilter === "all" || (student.feeStatus || "Paid") === feeFilter;

      return matchSearch && matchSection && matchFee;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "desc") {
        return b.name.localeCompare(a.name);
      } else if (sortOrder === "attendance") {
        const rateA = parseInt(a.attendance || "0", 10);
        const rateB = parseInt(b.attendance || "0", 10);
        return rateB - rateA;
      }
      return 0;
    });

  return (
    <div className="students-page">
      {/* Header & Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 className="students-title" style={{ margin: 0 }}>
            Students Management
          </h2>
          <p style={{ color: "var(--butter-muted, #776846)", fontSize: "14px" }}>
            Total enrolled: {students.length} student{students.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="button"
          className="action-btn"
          style={{
            background: isFormOpen ? "#64748b" : "linear-gradient(90deg, #d4a72c, #e8ba3f)",
            color: isFormOpen ? "white" : "#2f2919",
            fontWeight: 700,
            padding: "10px 20px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => {
            if (isFormOpen && editId !== null) cancelEdit();
            else setIsFormOpen(!isFormOpen);
          }}
        >
          {isFormOpen ? "✕ Close Form" : "+ Add New Student"}
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback.text && (
        <div
          className={
            feedback.type === "success"
              ? "success-msg rounded-xl px-4 py-3 text-sm mb-6"
              : "error-msg rounded-xl px-4 py-3 text-sm mb-6"
          }
        >
          {feedback.text}
        </div>
      )}

      {/* Expandable Form */}
      {isFormOpen && (
        <form
          className="student-form"
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            border: "1px solid rgba(241, 223, 164, 0.8)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <div style={{ gridColumn: "1 / -1", marginBottom: "4px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#222936" }}>
              {editId !== null ? "Edit Student Details" : "Enroll New Student"}
            </h3>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Full Name *</span>
            <input
              type="text"
              name="name"
              placeholder="e.g. Aarav Sharma"
              value={formState.name}
              required
              onChange={handleInputChange}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Grade / Section</span>
            <input
              type="text"
              name="section"
              placeholder="e.g. Grade 10 - Science"
              value={formState.section}
              onChange={handleInputChange}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Student Email</span>
            <input
              type="email"
              name="email"
              placeholder="student@example.com"
              value={formState.email}
              onChange={handleInputChange}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Student Phone</span>
            <input
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              value={formState.phone}
              onChange={handleInputChange}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Parent / Guardian Name</span>
            <input
              type="text"
              name="parentName"
              placeholder="Parent's Name"
              value={formState.parentName}
              onChange={handleInputChange}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Parent Phone</span>
            <input
              type="tel"
              name="parentPhone"
              placeholder="+91 9876543210"
              value={formState.parentPhone}
              onChange={handleInputChange}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Fee Status</span>
            <select
              name="feeStatus"
              value={formState.feeStatus}
              onChange={handleInputChange}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Monthly Fee (₹ / $)</span>
            <input
              type="number"
              name="monthlyFee"
              placeholder="e.g. 2500"
              value={formState.monthlyFee}
              onChange={handleInputChange}
            />
          </label>

          <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Notes / Remarks</span>
            <input
              type="text"
              name="notes"
              placeholder="Any special learning needs, syllabus progress, etc."
              value={formState.notes}
              onChange={handleInputChange}
            />
          </label>

          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "10px 24px",
                background: "linear-gradient(90deg, #d4a72c, #e8ba3f)",
                color: "#2f2919",
                fontWeight: 700,
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {submitting
                ? "Saving..."
                : editId !== null
                ? "Update Student"
                : "Add Student"}
            </button>

            {editId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  padding: "10px 20px",
                  background: "#e2e8f0",
                  color: "#334155",
                  fontWeight: 600,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "28px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, section, or email..."
          className="search-input"
          style={{ margin: 0, flex: "1 1 240px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {sections.length > 0 && (
          <select
            className="sort-select"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="all">All Sections</option>
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        )}

        <select
          className="sort-select"
          value={feeFilter}
          onChange={(e) => setFeeFilter(e.target.value)}
          style={{ minWidth: "140px" }}
        >
          <option value="all">All Fees</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ minWidth: "140px" }}
        >
          <option value="asc">Name (A → Z)</option>
          <option value="desc">Name (Z → A)</option>
          <option value="attendance">Highest Attendance</option>
        </select>
      </div>

      {/* Students Grid */}
      <div className="students-grid">
        {filteredStudents.length === 0 ? (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "var(--butter-muted, #776846)",
              padding: "40px",
            }}
          >
            No students found matching your criteria.
          </p>
        ) : (
          filteredStudents.map((student) => {
            const feeBg =
              student.feeStatus === "Paid"
                ? "rgba(34, 197, 94, 0.15)"
                : student.feeStatus === "Overdue"
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(245, 158, 11, 0.15)";
            const feeColor =
              student.feeStatus === "Paid"
                ? "#16a34a"
                : student.feeStatus === "Overdue"
                ? "#dc2626"
                : "#d97706";

            return (
              <div className="student-card" key={student._id}>
                <img
                  src={student.image}
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
                    {student.status}
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
                    Fee: {student.feeStatus || "Paid"}
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

                  <button
                    type="button"
                    className="edit-student-btn"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(student)}
                  >
                    Delete
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

export default Students;
