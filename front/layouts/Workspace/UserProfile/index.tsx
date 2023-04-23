import React, { MouseEvent, useCallback } from 'react';
import gravatar from 'gravatar';
import { LogOutButton, ProfileImg, ProfileModal } from '@layouts/Workspace/styles';
import useUser from '@hooks/useUser';
import Menu from '@components/Menu';
import axios from 'axios';

interface UserProfileProps {
  showUserMenu: boolean;
  onClickUserProfile: (e: MouseEvent) => void;
}

const UserProfile = ({ showUserMenu, onClickUserProfile }: UserProfileProps) => {
  const { data: userData, mutate } = useUser();

  const onSignOut = useCallback(async () => {
    try {
      await axios.post('/api/users/logout', null, { withCredentials: true });
      mutate(false, false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  if (!userData) return null;

  return (
    <span onClick={onClickUserProfile}>
      <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.email} />
      <Menu show={showUserMenu} onCloseModal={onClickUserProfile} style={{ right: 0, top: 38 }}>
        <ProfileModal>
          <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
          <div>
            <span id="profile-name">{userData.nickname}</span>
            <span id="profile-active">Active</span>
          </div>
        </ProfileModal>
        <LogOutButton onClick={onSignOut}>로그아웃</LogOutButton>
      </Menu>
    </span>
  );
};

export default UserProfile;
