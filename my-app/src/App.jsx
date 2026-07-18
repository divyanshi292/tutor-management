import axios from "axios";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import Attendance from "./pages/Attendance";

import Students from "./pages/Students";

import StudentDetails from "./pages/StudentDetails";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";

import Profile from "./pages/Profile";

import Settings from "./pages/Settings";

function App() {

  // ================= LOGIN STATE =================

  const [isLoggedIn, setIsLoggedIn] =
    useState(

      localStorage.getItem(
        "isLoggedIn"
      ) === "true"

    );

  // ================= PROFILE DATA =================

  const [profileData, setProfileData] =
    useState(() => {

      const savedProfile =
        localStorage.getItem(
          "profileData"
        );

      return savedProfile

        ? JSON.parse(savedProfile)

        : {

            tutorName:
              "Divyanshi Agarwal",

            email:
              "divyanshi@gmail.com",

            phone:
              "+91 9876543210",

            subject:
              "Mathematics",

            experience:
              "3 Years",

            location:
              "Ajmer, Rajasthan",

          };

    });

  // ================= STUDENTS =================

  const [students, setStudents] =
    useState([]);

  // ================= DARK MODE =================

  const [darkMode, setDarkMode] =
    useState(() => {

      const savedTheme =
        localStorage.getItem(
          "darkMode"
        );

      return savedTheme

        ? JSON.parse(savedTheme)

        : false;

    });

  // ================= FETCH STUDENTS =================

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const response =
        await axios.get(

          "http://localhost:5000/api/students"

        );

      setStudents(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= SAVE PROFILE =================

  useEffect(() => {

    localStorage.setItem(

      "profileData",

      JSON.stringify(profileData)

    );

  }, [profileData]);

  // ================= SAVE DARK MODE =================

  useEffect(() => {

    localStorage.setItem(

      "darkMode",

      JSON.stringify(darkMode)

    );

  }, [darkMode]);

  // ================= APPLY DARK MODE =================

  useEffect(() => {

    if (darkMode) {

      document.body.classList.add(
        "dark"
      );

    } else {

      document.body.classList.remove(
        "dark"
      );

    }

  }, [darkMode]);

  return (

    <div>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route

          path="/login"

          element={

            isLoggedIn

              ? (
                  <Navigate
                    to="/dashboard"
                  />
                )

              : (
                  <Login
                    setIsLoggedIn={
                      setIsLoggedIn
                    }
                  />
                )

          }

        />

        {/* ================= ROOT REDIRECT ================= */}

        <Route

          path="/"

          element={

            isLoggedIn

              ? (
                  <Navigate
                    to="/dashboard"
                  />
                )

              : (
                  <Navigate
                    to="/login"
                  />
                )

          }

        />

        {/* ================= DASHBOARD LAYOUT ================= */}

        <Route

          path="/dashboard"

          element={

            isLoggedIn

              ? (
                  <Dashboard
                    students={students}
                  />
                )

              : (
                  <Navigate
                    to="/login"
                  />
                )

          }

        >

          {/* ================= DASHBOARD HOME ================= */}

          <Route

  index

  element={
    <DashboardHome
      students={students}
    />
  }

/>

          {/* ================= STUDENTS ================= */}

          <Route

            path="students"

            element={

              <Students

                students={students}

                setStudents={
                  setStudents
                }

              />

            }

          />

          {/* ================= ATTENDANCE ================= */}

          <Route

            path="attendance"

            element={

              <Attendance

                students={students}

                setStudents={
                  setStudents
                }

              />

            }

          />

          {/* ================= STUDENT DETAILS ================= */}

          <Route

            path="students/:id"

            element={

              <StudentDetails
                students={students}
              />

            }

          />

          {/* ================= PROFILE ================= */}

          <Route

            path="profile"

            element={
              <Profile
                profileData={
                  profileData
                }
              />
            }

          />

          {/* ================= SETTINGS ================= */}

          <Route

            path="settings"

            element={

              <Settings

                profileData={
                  profileData
                }

                setProfileData={
                  setProfileData
                }

                darkMode={
                  darkMode
                }

                setDarkMode={
                  setDarkMode
                }

              />

            }

          />

        </Route>

      </Routes>

    </div>

  );

}

export default App;