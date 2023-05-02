import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React, { useState } from "react";

import Login from "./Components/Login";
import Menu from "./Components/Menu";
import FacultyAndCourses from "./Components/FacultyAndCourses/FacultyAndCourses";
import CSearch from "./Components/Register/CSearch";
import MajorList from "./Components/Register/MajorList";
import Cinfo from "./Components/Register/Cinfo";
import Navigation from "./Components/Navigation";
import Profile from "./Components/Profile/Profile";
import Signup from "./Components/Signup";
import MajorRequirements from "./Components/MajorRequirement/major_Requirements";
import CGrades from "./Components/CGrades";
import AdminPanel from "./Components/AdminPanel";

function App() {
  // const [user, setUser] = useState({
  //   auth: false,
  //   permission: "",
  //   id: ""
  // });

  const [user, setUser] = useState({
    auth: false,
    permission: "",
    id: "",
  });

  return (
    <div>
      <Router>
        {user.auth && <Menu setUser={setUser} permission={user.permission} />}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          {!user.auth ? (
            <Route path="/*" element={<Navigate to="/login" />} />
          ) : (
            <>
              <Route path="/adminpanel" element={<AdminPanel />} />
              <Route path="/search" element={<CSearch />} />
              <Route path="/majorlist" element={<MajorList />} />
              <Route
                path="/faculty-and-course-info"
                element={<FacultyAndCourses />}
              />
              <Route path="/courseinfo" element={<Cinfo />} />
              <Route
                path="/"
                element={<Navigation permission={user.permission} />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/Major-Requirements"
                element={<MajorRequirements user={user} />}
              />
              <Route exact path="/cinfo/:id" element={<Cinfo />} />
              <Route path="/grades" element={<CGrades user={user} />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
