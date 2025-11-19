import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginSignup from "./Pages/LoginSignup/LoginSignup";
import MainPage from "./Pages/MainPage/MainPage";

import './App.css';

function App() {
  return (
  <Router>
    <Routes class='background'>
      <Route path='/login' element={<LoginSignup/>}/>
      <Route path='/chat' element={<MainPage/>}/>
    </Routes>
  </Router>  
  );
}

export default App;
