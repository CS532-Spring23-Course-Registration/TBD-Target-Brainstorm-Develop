import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignupForm from "./Pages/Signup";
import Menu from "./Components/Menu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PDF from "./Components/PDF";
import CRegHome from "./Pages/Register/CRegHome";
import CSearch from "./Pages/Register/CSearch";
import MajorList from "./Pages/Register/MajorList";
import MyCourses from "./Pages/Register/MyCourses";
import Courses from "./Pages/Register/Courses";
import Cinfo from "./Pages/Register/Cinfo";
import CReg from "./Pages/Register/CReg";

function App() {
  return (
    <div>
      <Router>
        <Menu></Menu>
        <Routes>
          <Route exact path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pdf" element={<PDF />} />
          <Route path="/reghome" element={<CRegHome />} />
          <Route path="/search" element={<CSearch />} />
          <Route path="/majorlist" element={<MajorList />} />
          <Route path="/mycourses" element={<MyCourses />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courseinfo" element={<Cinfo />} />
          <Route path="/register" element={<CReg />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
