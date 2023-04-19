import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from "react";

import Login from "./Components/Login";
import Menu from "./Components/Menu";
import PDF from "./Components/PDF";
import FacultyAndCourses from "./Components/FacultyAndCourses";
import CRegHome from "./Components/Register/CRegHome";
import CSearch from "./Components/Register/CSearch";
import MajorList from "./Components/Register/MajorList";
import MyCourses from "./Components/Register/MyCourses";
import Cinfo from "./Components/Register/Cinfo";
import Navigation from "./Components/Navigation";
import Profile from "./Components/Profile";
import AcademicRecord from "./Components/acedemic_Record";
import Signup from "./Components/Signup";
import MajorRequirements from "./Components/major_Requirements";

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
            element={<Login />}
            updateAuthentication={updateAuthentication}
          />
          <Route path="/pdf" element={<PDF />} />
          <Route path="/reghome" element={<CRegHome />} />
          <Route path="/search" element={<CSearch />} />
          <Route path="/majorlist" element={<MajorList />} />
          <Route path="/mycourses" element={<MyCourses />} />
          <Route path="/faculty-and-course-info" element={<FacultyAndCourses />} />
          <Route path="/courseinfo" element={<Cinfo />} />
          <Route path="/" element={<Navigation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/academic-Record" element={<AcademicRecord />} />
          <Route path="/Major-Requirements" element={<MajorRequirements />} />
          <Route exact path="/cinfo/:id" element={<Cinfo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
