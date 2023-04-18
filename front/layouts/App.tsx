import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';
import { Link } from 'react-router-dom';

const SignInPage = loadable(() => import('@pages/SignIn'));
const SignUpPage = loadable(() => import('@pages/SignUp'));
const ChannelPage = loadable(() => import('@pages/Channel'));

const App = () => {
  return (
    <div>
      <div>
        <Link to="/signin">SignIn</Link>
      </div>
      <div>
        <Link to="/signup">SignUp</Link>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/workspace" element={<Navigate to="/workspace/channel" replace />} />
        <Route path="/workspace/channel" element={<ChannelPage />} />
      </Routes>
    </div>
  );
};

export default App;
