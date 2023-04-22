import useUser from '@hooks/useUser';
import {
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import axios from 'axios';
import React, { MouseEvent, PropsWithChildren, useCallback, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';

const ChannelPage = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = ({ children }: PropsWithChildren) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data, mutate, isLoading } = useUser();

  const onSignOut = useCallback(async () => {
    try {
      await axios.post('/api/users/logout', null, { withCredentials: true });
      mutate(false, false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onClickUserPropfile = useCallback((e: MouseEvent) => {
    setShowUserMenu((pre) => !pre);
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
          <span onClick={onClickUserPropfile}>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.email} />
            {showUserMenu ? (
              <Menu onCloseModal={onClickUserPropfile} style={{ right: 0, top: 38 }}>
                <ProfileModal>
                  <img src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton>로그아웃</LogOutButton>
              </Menu>
            ) : null}
          </span>
        </RightMenu>
      </Header>
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
