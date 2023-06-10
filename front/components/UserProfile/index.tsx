import React, { MouseEvent, useCallback, useState } from 'react';
import gravatar from 'gravatar';
import { LogOutButton, ProfileImg, ProfileModal } from '@layouts/Workspace/styles';
import useUser from '@hooks/useUser';
import Menu from '@components/Menu';

interface UserProfileProps {
  onSignOut: () => void;
}

const UserProfile = ({ onSignOut }: UserProfileProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { myData } = useUser();

  const toggleUserProfile = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setShowUserMenu((pre) => !pre);
  }, []);

  if (!myData) return null;

  return (
    <span onClick={toggleUserProfile}>
      <ProfileImg src={gravatar.url(myData.email, { s: '28px', d: 'retro' })} alt={myData.nickname} />
      <Menu show={showUserMenu} onCloseMenu={toggleUserProfile} style={{ right: 0, top: 38 }}>
        <ProfileModal>
          <img src={gravatar.url(myData.email, { s: '28px', d: 'retro' })} alt={myData.nickname} />
          <div>
            <span id="profile-name">{myData.nickname}</span>
            <span id="profile-active">Active</span>
          </div>
        </ProfileModal>
        <LogOutButton onClick={onSignOut}>로그아웃</LogOutButton>
      </Menu>
    </span>
  );
};

export default UserProfile;
