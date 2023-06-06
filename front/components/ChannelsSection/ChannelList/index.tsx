import useChannel from '@hooks/useChannel';
import useUser from '@hooks/useUser';
import { IChannel } from '@typings/db';
import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { CollapseButton } from '@components/ChannelsSection/DMList/styles';

const ChannelList = () => {
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<Record<string, number | undefined>>({});

  const location = useLocation();

  const { data: userData } = useUser();

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

  if (!userData) return null;

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
      {!channelCollapse ? <CollapseItemList /> : null}
    </>
  );
};

export default ChannelList;

interface CollapseItemListProps {}

const CollapseItemList = ({}: CollapseItemListProps) => {
  const { workspace } = useParams();
  const { data: channelData } = useChannel(workspace);

  if (!channelData) return null;

  return (
    <>
      {channelData.map((channel) => (
        <CollapseItem key={channel.id} channel={channel} />
      ))}
    </>
  );
};

interface CollapseItemProps {
  channel: IChannel;
}

const CollapseItem = ({ channel }: CollapseItemProps) => {
  const { workspace } = useParams();
  return (
    <NavLink
      className={({ isActive }) => (isActive === true ? 'selected' : '')}
      to={`workspace/${workspace}/channel/${channel.name}`}
    >
      <span># {channel.name}</span>
    </NavLink>
  );
};
