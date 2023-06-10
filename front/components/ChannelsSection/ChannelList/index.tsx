import useUser from '@hooks/useUser';
import { IChannel } from '@typings/db';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { CollapseButton } from '@components/ChannelsSection/DMList/styles';
import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import EachChannel from '@components/EachChannel';

const ChannelList = () => {
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<Record<string, number | undefined>>({});
  const { myData } = useUser();
  const { workspace } = useParams<{ workspace: string }>();
  const { data: channelData } = useSWR<IChannel[]>(myData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((pre) => !pre);
  }, []);

  const resetCount = useCallback((id: number) => {
    setCountList((list) => {
      return {
        ...list,
        [id]: undefined,
      };
    });
  }, []);

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
        ? channelData?.map((channel) => <EachChannel key={`eachChannel-${channel.name}`} channel={channel} />)
        : null}
    </>
  );
};

export default ChannelList;
