import Menu from '@components/Menu';
import ChannelList from '@components/ChannelsSection/ChannelList';
import DMList from '@components/ChannelsSection/DMList';
import { Channels, MenuScroll, WorkspaceModal, WorkspaceName } from '@layouts/Workspace/styles';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';

interface ChannelsSectionProps {
  onSignOut: () => void;
  onCloseModal: () => void;
  onClickCreateChannel: () => void;
  onClickInviteWorkspace: () => void;
}

const ChannelsSection = ({ onClickCreateChannel, onClickInviteWorkspace, onSignOut }: ChannelsSectionProps) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceMenu((pre) => !pre);
  }, []);

  return (
    <Channels>
      <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
      <MenuScroll>
        <Menu show={showWorkspaceMenu} onCloseMenu={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
          <WorkspaceModal>
            <h2>Sleact</h2>
            <button
              onClick={() => {
                toggleWorkspaceModal();
                onClickInviteWorkspace();
              }}
            >
              워크스페이스에 사용자 초대
            </button>
            <button
              onClick={() => {
                toggleWorkspaceModal();
                onClickCreateChannel();
              }}
            >
              채널 만들기
            </button>
            <button onClick={onSignOut}>로그아웃</button>
          </WorkspaceModal>
        </Menu>
        <ChannelList />
        <DMList />
      </MenuScroll>
    </Channels>
  );
};

export default ChannelsSection;
