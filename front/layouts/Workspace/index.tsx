import useUser from '@hooks/useUser';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  MenuScroll,
  RightMenu,
  WorkspaceButton,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import React, { MouseEvent, useCallback, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import CreateWorkspaceModal from '@layouts/Workspace/CreateWorkspaceModal';
import UserProfile from '@layouts/Workspace/UserProfile';

const ChannelPage = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = () => {
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);

  const params = useParams();

  const { data: userData, isLoading } = useUser();

  const onClickUserProfile = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setShowUserMenu((pre) => !pre);
  }, []);

  const onClickCreateWorkspace = useCallback(
    (close?: boolean) => {
      if (close === true) {
        setShowCreateWorkspaceModal((pre) => false);
      } else {
        setShowCreateWorkspaceModal((pre) => !pre);
      }
    },
    [showCreateWorkspaceModal],
  );

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((pre) => !pre);
  }, []);

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <UserProfile showUserMenu={showUserMenu} onClickUserProfile={onClickUserProfile} />
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name[0].toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={() => onClickCreateWorkspace()}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}></Menu>
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<ChannelPage />} />
            <Route path="/dm" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <CreateWorkspaceModal
        showCreateWorkspaceModal={showCreateWorkspaceModal}
        onClickCreateWorkspace={onClickCreateWorkspace}
        setShowCreateWorkspaceModal={setShowCreateWorkspaceModal}
      />
    </div>
  );
};

export default Workspace;
