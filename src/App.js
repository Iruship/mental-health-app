import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import PHQTest from './components/PHQTest';
import LiveStressDetection from './components/LiveStressDetection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/phq-test" element={<PHQTest />} />
        <Route path="/live-stress-detection" element={<LiveStressDetection />} />
      </Routes>
    </Router>
  );
}

export default App;
