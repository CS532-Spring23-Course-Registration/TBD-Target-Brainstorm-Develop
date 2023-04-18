import React from "react";
import Login from "./Components/Login";
import Menu from "./Components/Menu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PDF from "./Components/PDF";
import CRegHome from "./Components/Register/CRegHome";
import CSearch from "./Components/Register/CSearch";
import MajorList from "./Components/Register/MajorList";
import MyCourses from "./Components/Register/MyCourses";
import Courses from "./Components/Register/Courses";
import Cinfo from "./Components/Register/Cinfo";
import CReg from "./Components/Register/CReg";
import Navigation from "./Components/Navigation";
import Profile from "./Components/Profile";
import AcademicRecord from "./Components/acedemic_Record";
import Signup from "./Components/Signup";

function App() {
  return (
    <div>
      <Router>
        <Menu></Menu>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pdf" element={<PDF />} />
          <Route path="/reghome" element={<CRegHome />} />
          <Route path="/search" element={<CSearch />} />
          <Route path="/majorlist" element={<MajorList />} />
          <Route path="/mycourses" element={<MyCourses />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courseinfo" element={<Cinfo />} />
          <Route path="/register" element={<CReg />} />
          <Route path="/" element={<Navigation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/academic-Record" element={<AcademicRecord />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
