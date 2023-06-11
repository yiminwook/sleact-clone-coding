import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';
import { ToastContainer } from 'react-toastify';

const SignInPage = loadable(() => import('@pages/SignIn'));
const SignUpPage = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/workspace/:workspace/*" element={<Workspace />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
