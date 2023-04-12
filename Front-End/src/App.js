import Home from "./Home";
import Login from "./Login";
import Menu from "./Menu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Menu></Menu>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
