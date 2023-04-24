import Menu from '@components/Menu';
import useChannel from '@hooks/useChannel';
import useUser from '@hooks/useUser';
import Channel from '@layouts/Workspace/ChannelsSection/Channel';
import DMList from '@layouts/Workspace/ChannelsSection/DMList';
import { Channels, MenuScroll, WorkspaceModal, WorkspaceName } from '@layouts/Workspace/styles';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import useChannel from '@hooks/useChannel';

interface ChannelsSectionProps {
  onSignOut: () => void;
  onCloseModal: () => void;
  onClickCreateChannel: () => void;
  onClickInviteWorkspace: () => void;
}

const ChannelsSection = ({ onClickCreateChannel, onClickInviteWorkspace, onSignOut }: ChannelsSectionProps) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const { workspace } = useParams();
  const { data: userData } = useUser();
  const { data: channelData } = useChannel(workspace);

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
        <DMList userData={userData} />
        {channelData?.map((channel, idx) => (
          <Channel key={idx} channelData={channel} />
        ))}
      </MenuScroll>
    </Channels>
  );
};

export default ChannelsSection;
