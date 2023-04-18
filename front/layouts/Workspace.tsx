import useUser from '@hooks/useUser';
import axios from 'axios';
import React, { MouseEvent, PropsWithChildren, useCallback } from 'react';
import { Navigate } from 'react-router';

const Workspace = ({ children }: PropsWithChildren) => {
  const { data, mutate, isLoading } = useUser();
  const onSignOut = useCallback(async (_e: MouseEvent<HTMLButtonElement>) => {
    try {
      await axios.post('/api/users/logout', null, { withCredentials: true });
      mutate(false, false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (data === false) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div>
      <button onClick={onSignOut}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
