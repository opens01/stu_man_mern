
import { useEffect, useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [message, setMessage] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch students");
      }

      setStudents(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.course} ${student.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const saveStudent = async (studentData) => {
    const url = editingStudent
      ? `http://localhost:5000/api/students/${editingStudent._id}`
      : "http://localhost:5000/api/students";

    const method = editingStudent ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setMessage(editingStudent ? "Student updated" : "Student added");
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage(data.message);
      fetchStudents();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Student Management</h1>

      <input
        type="text"
        placeholder="Search by name, course or city"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <StudentForm
        onSave={saveStudent}
        editingStudent={editingStudent}
      />

      <p>{message}</p>

      <StudentList
        students={filteredStudents}
        onEdit={setEditingStudent}
        onDelete={deleteStudent}
      />
    </div>
  );
}

export default App;