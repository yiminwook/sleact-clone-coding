import useUser from '@hooks/useUser';
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import axios from 'axios';
import React, { MouseEvent, PropsWithChildren, useCallback } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import gravatar from 'gravatar';
import loadable from '@loadable/component';

const ChannelPage = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

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

  if (!data) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.email} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onSignOut}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Channel</WorkspaceName>
          <MenuScroll>manuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel" element={<ChannelPage />} />
            <Route path="/dm" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
