import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './views/Dashboard';
import Login from './views/Login';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
