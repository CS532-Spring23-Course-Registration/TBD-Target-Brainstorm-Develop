import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import Navigation from './Components/NavigationMenu/Navigation';
import Profile from './Components/ProfileTab/Profile';
import AcademicRecord from "./Components/Academic Record/academic_Record";
import MajorRequirements from './Components/Major Requirements/major_Requirements'; 
import FacultyAndCourseInformation from './Components/Faculty And Course information/faculty_Course_Information';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Academic-Record" element={<AcademicRecord />} />
          <Route path="/Major-Requirements" element={<MajorRequirements />} />
          <Route path ="/Faculty-And-Course-Information" element ={<FacultyAndCourseInformation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
