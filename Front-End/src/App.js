import Home from "./Home";
import Login from "./Login";
import SignupForm from "./Signup";
import Menu from "./Menu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Test from "./PDF";

function App() {
  return (
    <div>
      <Router>
        <Menu></Menu>
        <Routes>
          <Route exact path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
