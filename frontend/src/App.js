import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginSignup from "./Pages/LoginSignup/LoginSignup";
import MainPage from "./Pages/MainPage/MainPage";

import './App.css';

function App() {
  function MainPageRedirectWrapper() {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        }
      }, [navigate]);

    return <MainPage/>;
  }


  return (
  <Router>
    <Routes class='background'>
      <Route path='/login' element={<LoginSignup/>}/>
      <Route path='/chat' element={<MainPageRedirectWrapper/>}/>
      
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>  
  );
}

export default App;
