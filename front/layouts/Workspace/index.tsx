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
import CreateWorkspaceModal from '@components/CreateWorkspaceModal';
import UserProfile from '@components/UserProfile';
import axios from 'axios';
import ChannelsSection from '@components/ChannelsSection';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import { useParams } from 'react-router';
import useSocket from '@hooks/useSocket';
import useChannel from '@hooks/useChannel';

const ChannelPage = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = () => {
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);

  const { workspace } = useParams<{ workspace: string }>();

  const { myData, isLoadingMyData, mutateMyData } = useUser();
  const { data: channelData } = useChannel(workspace);
  const [socket, disconnect] = useSocket(workspace);

  const onSignOut = useCallback(async () => {
    try {
      await axios.post('/api/users/logout', null, { withCredentials: true });
      mutateMyData(false, false);
    } catch (error) {
      console.error(error);
    }
  }, [mutateMyData]);

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
  }, []);

  useEffect(() => {
    if (!(socket && channelData && myData)) return;
    socket.emit('login', { id: myData.id, channels: channelData.map((v) => v.id) });
  }, [socket, channelData, myData, disconnect]);

  useEffect(() => {
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace, disconnect]);

  if (isLoadingMyData) {
    return <div>로딩중...</div>;
  }

  if (!myData) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <Header>
        <RightMenu>
          <UserProfile onSignOut={onSignOut} />
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {myData.Workspaces.map((ws) => {
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
    </>
  );
};

export default Workspace;
