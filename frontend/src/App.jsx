import { useEffect, useState } from "react";
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

const defaultProfile = {
  tutorName: "Divyanshi Agarwal",
  email: "divyanshi@gmail.com",
  phone: "+91 9876543210",
  subject: "Mathematics",
  experience: "3 Years",
  location: "Ajmer, Rajasthan",
};

function App() {
  const { isLoggedIn } = useAuth();
  const { students, setStudents, refreshStudents } =
    useStudents(isLoggedIn);
  const [profileData, setProfileData] = useState(() => {
    const savedProfile = localStorage.getItem("profileData");
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(profileData));
  }, [profileData]);

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
          element={<StudentDetails students={students} />}
        />
        <Route
          path="profile"
          element={<Profile profileData={profileData} />}
        />
        <Route
          path="settings"
          element={
            <Settings
              profileData={profileData}
              setProfileData={setProfileData}
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
