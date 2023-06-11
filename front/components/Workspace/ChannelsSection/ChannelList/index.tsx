import React, { useCallback, useState } from 'react';
import { CollapseButton } from '@components/Workspace/ChannelsSection/DMList/styles';
import EachChannel from '@components/Workspace/ChannelsSection/ChannelList/EachChannel';
import { useMydata, useWorkspaceChannelList } from '@hooks/useApi';

const ChannelList = () => {
  const [channelCollapse, setChannelCollapse] = useState(false);
  // const [countList, setCountList] = useState<Record<string, number | undefined>>({});
  const { myData } = useMydata();
  const { workspaceChannelList } = useWorkspaceChannelList();

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((pre) => !pre);
  }, []);

  // const resetCount = useCallback((id: number) => {
  //   setCountList((list) => {
  //     return {
  //       ...list,
  //       [id]: undefined,
  //     };
  //   });
  // }, []);

  if (!myData) return null;

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      {!channelCollapse
        ? workspaceChannelList.map((channel) => <EachChannel key={`eachChannel-${channel.name}`} channel={channel} />)
        : null}
    </>
  );
};

export default ChannelList;
