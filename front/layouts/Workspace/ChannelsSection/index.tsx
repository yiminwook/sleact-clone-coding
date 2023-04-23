import React, { useCallback, useState } from 'react';
import { Channels, MenuScroll, WorkspaceModal, WorkspaceName } from '@layouts/Workspace/styles';
import Menu from '@components/Menu';
import Channel from './Channel';
import useUser from '@hooks/useUser';
import { useParams } from 'react-router';
import useChannel from '@hooks/useChannel';

interface ChannelsSectionProps {
  onSignOut: () => void;
  onCloseModal: () => void;
  showCreateChannelModal: boolean;
  onClickCreateChannel: () => void;
}

const ChannelsSection = ({ onClickCreateChannel, onSignOut }: ChannelsSectionProps) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const { workspace } = useParams();
  const { data: userData } = useUser();
  const { data: channelData } = useChannel({ workspace, userData });

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
        {channelData?.map((channel, idx) => (
          <Channel key={idx} channelData={channel} />
        ))}
      </MenuScroll>
    </Channels>
  );
};

export default ChannelsSection;
