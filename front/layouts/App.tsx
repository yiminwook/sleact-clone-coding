import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';
import { Link } from 'react-router-dom';

const SignIn = loadable(() => import('@pages/SignIn/index'));
const SignUp = loadable(() => import('@pages/SignUp/index'));

const App = () => {
  return (
    <div>
      <div>
        <Link to={'/signin'}>SignIn</Link>
      </div>
      <div>
        <Link to={'/signup'}>SignUp</Link>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="*" element={}></Route> */}
      </Routes>
    </div>
  );
};

export default App;
