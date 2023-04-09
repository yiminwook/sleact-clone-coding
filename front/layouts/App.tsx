import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from '@pages/LogIn/index';
import SignUp from '@pages/SignUp/index';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      {/* <Route path="*" element={}></Route> */}
    </Routes>
  );
};

export default App;
