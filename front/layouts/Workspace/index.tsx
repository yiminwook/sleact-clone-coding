import useUser from '@hooks/useUser';
import {
  AddButton,
  Chats,
  Header,
  RightMenu,
  WorkspaceButton,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import loadable from '@loadable/component';
import { Link } from 'react-router-dom';
import CreateWorkspaceModal from '@layouts/Workspace/CreateWorkspaceModal';
import UserProfile from '@layouts/Workspace/UserProfile';
import axios from 'axios';
import ChannelsSection from '@layouts/Workspace/ChannelsSection';
import CreateChannelModal from '@layouts/Workspace/CreateChannelModal';
import InviteWorkspaceModal from '@layouts/Workspace/InviteWorkspaceModal';
import InviteChannelModal from './InviteChannelModal';
import { useParams } from 'react-router';
import useSocket from '@hooks/useSocket';
import useChannel from '@hooks/useChannel';

const ChannelPage = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = () => {
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const { workspace } = useParams<{ workspace: string }>();

  const { data: userData, isLoading, mutate } = useUser();
  const { data: channelData } = useChannel(workspace);
  const [socket, disconnect] = useSocket(workspace);

  const onSignOut = useCallback(async () => {
    try {
      await axios.post('/api/users/logout', null, { withCredentials: true });
      mutate(false, false);
    } catch (error) {
      console.error(error);
    }
  }, [mutate]);

  const onClickCreateChannel = useCallback(() => {
    setShowCreateChannelModal(() => true);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(() => true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(() => true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateChannelModal(() => false);
    setShowCreateWorkspaceModal(() => false);
    setShowInviteWorkspaceModal(() => false);
    setShowInviteChannelModal(() => false);
  }, []);

  useEffect(() => {
    if (!(socket && channelData && userData)) return;
    socket.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) });
  }, [socket, channelData, userData, disconnect]);

  useEffect(() => {
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace, disconnect]);

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
          <UserProfile onSignOut={onSignOut} />
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name[0].toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={() => onClickCreateWorkspace()}>+</AddButton>
        </Workspaces>
        <ChannelsSection
          onSignOut={onSignOut}
          onCloseModal={onCloseModal}
          onClickCreateChannel={onClickCreateChannel}
          onClickInviteWorkspace={onClickInviteWorkspace}
        />
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<ChannelPage />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      {/* modal */}
      <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} />
      <CreateWorkspaceModal show={showCreateWorkspaceModal} onCloseModal={onCloseModal} />
      <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal} />
      {/* <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} /> */}
    </div>
  );
};

export default Workspace;
