import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useStudents } from "./hooks/useStudents";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import StudentDetails from "./pages/StudentDetails";
import Students from "./pages/Students";

function App() {
  const { isLoggedIn, user, updateUserProfile } = useAuth();
  const { students, setStudents, refreshStudents, loading: studentsLoading } =
    useStudents(isLoggedIn);

  const protectedDashboard = isLoggedIn ? (
    <Dashboard />
  ) : (
    <Navigate to="/login" replace />
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
        }
      />
      <Route path="/dashboard" element={protectedDashboard}>
        <Route index element={<DashboardHome students={students} />} />
        <Route
          path="students"
          element={
            <Students
              students={students}
              refreshStudents={refreshStudents}
            />
          }
        />
        <Route
          path="attendance"
          element={
            <Attendance students={students} setStudents={setStudents} />
          }
        />
        <Route
          path="students/:id"
          element={
            <StudentDetails
              students={students}
              loading={studentsLoading}
            />
          }
        />
        <Route
          path="profile"
          element={<Profile user={user} students={students} />}
        />
        <Route
          path="settings"
          element={
            <Settings
              user={user}
              updateUserProfile={updateUserProfile}
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
