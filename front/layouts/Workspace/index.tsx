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
import CreateWorkspaceModal from '@components/Workspace/CreateWorkspaceModal';
import UserProfile from '@components/common/UserProfile';
import axios from 'axios';
import ChannelsSection from '@components/Workspace/ChannelsSection';
import CreateChannelModal from '@components/Workspace/CreateChannelModal';
import InviteWorkspaceModal from '@components/Workspace/InviteWorkspaceModal';
import { useParams } from 'react-router';
import useSocket from '@hooks/useSocket';
import { useWorkspaceChannelList, useMydata } from '@hooks/useApi';

const ChannelPage = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = () => {
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);

  const { workspace } = useParams<{ workspace: string }>();

  const { myData, isLoadingMyData, mutateMyData } = useMydata();
  const { workspaceChannelList } = useWorkspaceChannelList();
  const [socket, disconnect] = useSocket();

  const onSignOut = useCallback(async () => {
    try {
      await axios.post('/api/users/logout');
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
    if (!(socket && workspaceChannelList && myData)) return;
    //on 콜백함수, emit 문자열
    socket.emit('login', { id: myData.id, channels: workspaceChannelList.map((v) => v.id) });
  }, [socket, workspaceChannelList, myData, disconnect]);

  useEffect(() => {
    return () => disconnect();
  }, [workspace, disconnect]);

  if (isLoadingMyData) {
    return <div>로딩중...</div>;
  }

  if (!myData) {
    //로그인되어있지 않으면 로그인페이지로
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
              <Link key={`workspaces-${ws.id}`} to={`/workspace/${ws.url}/channel/일반`}>
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
