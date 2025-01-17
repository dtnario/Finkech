import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainScreen from './components/MainScreen';

const AppRouter = ({ onLogin, onRegister }) => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/register" element={<Register onRegister={onRegister} />} />
        <Route path="/" element={<MainScreen />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;