import useUser from '@hooks/useUser';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import axios, { AxiosError } from 'axios';
import React, { FormEvent, MouseEvent, PropsWithChildren, useCallback, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { toast } from 'react-toastify';
import useInput from '@hooks/useInput';

const ChannelPage = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = ({ children }: PropsWithChildren) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const params = useParams();

  const { data: userData, mutate, isLoading } = useUser();

  const onSignOut = useCallback(async () => {
    try {
      await axios.post('/api/users/logout', null, { withCredentials: true });
      mutate(false, false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onClickUserPropfile = useCallback((e: MouseEvent) => {
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

  const onCreateWorkspace = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        if (!(newWorkspace && newWorkspace.trim())) return;
        if (!(newUrl && newUrl.trim())) return;
        await axios.post('/api/workspaces', { workspace: newWorkspace, url: newUrl });
        mutate();
        setShowCreateWorkspaceModal(() => false);
        setNewWorkspace(() => '');
        setNewUrl(() => '');
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data, { position: 'bottom-center' });
        }
      }
    },
    [newWorkspace, newUrl],
  );

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
          <span onClick={onClickUserPropfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.email} />
            {showUserMenu ? (
              <Menu onCloseModal={onClickUserPropfile} style={{ right: 0, top: 38 }}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onSignOut}>로그아웃</LogOutButton>
              </Menu>
            ) : null}
          </span>
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
          <WorkspaceName>Channel</WorkspaceName>
          <MenuScroll>manuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<ChannelPage />} />
            <Route path="/dm" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onClickCreateWorkspace}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크 스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크 스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Workspace;
