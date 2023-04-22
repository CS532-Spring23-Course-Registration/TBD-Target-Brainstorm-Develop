import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React, { useState } from "react";

import Login from "./Components/Login";
import Menu from "./Components/Menu";
import FacultyAndCourses from "./Components/FacultyAndCourses";
import CSearch from "./Components/Register/CSearch";
import MajorList from "./Components/Register/MajorList";
import Cinfo from "./Components/Register/Cinfo";
import Navigation from "./Components/Navigation";
import Profile from "./Components/Profile";
import Signup from "./Components/Signup";
import MajorRequirements from "./Components/major_Requirements";
import CGrades from "./Components/CGrades";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const updateAuthentication = (newStatus) => {
    setIsAuthenticated(newStatus);
  };

  return (
    <div>
      <Router>
        {isAuthenticated && <Menu />}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={<Login updateAuthentication={updateAuthentication} />}
          />
          {!isAuthenticated ? (
            <Route path="/*" element={<Navigate to="/login" />} />
          ) : (
            <>
              <Route path="/search" element={<CSearch />} />
              <Route path="/majorlist" element={<MajorList />} />
              <Route
                path="/faculty-and-course-info"
                element={<FacultyAndCourses />}
              />
              <Route path="/courseinfo" element={<Cinfo />} />
              <Route path="/" element={<Navigation />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/Major-Requirements"
                element={<MajorRequirements />}
              />
              <Route exact path="/cinfo/:id" element={<Cinfo />} />
              <Route path="/grades" element={<CGrades />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
