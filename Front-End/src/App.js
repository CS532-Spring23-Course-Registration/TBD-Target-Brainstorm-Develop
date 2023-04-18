import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from 'react';

import Home from "./Pages/Home";
import Login from "./Components/Login";
import SignupForm from "./Pages/Signup";
import Menu from "./Components/Menu";
import PDF from "./Components/PDF";
import CRegHome from "./Pages/Register/CRegHome";
import CSearch from "./Pages/Register/CSearch";
import MajorList from "./Pages/Register/MajorList";
import MyCourses from "./Pages/Register/MyCourses";
import Courses from "./Pages/Register/Courses";
import Cinfo from "./Pages/Register/Cinfo";
import CReg from "./Pages/Register/CReg";
import Navigation from "./Components/Navigation";
import Profile from "./Components/Profile";
import AcademicRecord from "./Components/acedemic_Record";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuthentication = (newStatus) => {
    setIsAuthenticated(newStatus);
  }

  return (
    <div>
      <Router>
      {isAuthenticated && <Menu />}
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<Login />} updateAuthentication={updateAuthentication}/>
          <Route path="/home" element={<Home />} />
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
