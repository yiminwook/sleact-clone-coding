import React, { useCallback, useState } from 'react';
import { Channels, MenuScroll, WorkspaceModal, WorkspaceName } from '@layouts/Workspace/styles';
import Menu from '@components/Menu';

interface ChannelsSectionProps {
  onSignOut: () => void;
  onCloseModal: () => void;
  showCreateChannelModal: boolean;
  onClickCreateChannel: () => void;
}

const ChannelsSection = ({ onClickCreateChannel, onSignOut }: ChannelsSectionProps) => {
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
                onClickCreateChannel();
              }}
            >
              채널 만들기
            </button>
            <button onClick={onSignOut}>로그아웃</button>
          </WorkspaceModal>
        </Menu>
      </MenuScroll>
    </Channels>
  );
};

export default ChannelsSection;
