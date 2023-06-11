import { useUnreadChannelChatCount } from '@hooks/useApi';
import { IChannel } from '@typings/db';
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

interface EachChannelProps {
  channel: IChannel;
}

const EachChannel = ({ channel: { name } }: EachChannelProps) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { unreadChannelChatCount, mutateUnreadChannelChatCount } = useUnreadChannelChatCount(name);

  const isCount = useMemo(
    () => unreadChannelChatCount !== undefined && unreadChannelChatCount > 0,
    [unreadChannelChatCount],
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/channel/${name}`) {
      //리프레쉬
      mutateUnreadChannelChatCount();
    }
  }, [mutateUnreadChannelChatCount, location, workspace, name]);

  return (
    <NavLink
      key={`eachChannel-${name}`}
      className={({ isActive }) => (isActive === true ? 'selected' : '')}
      to={`/workspace/${workspace}/channel/${name}`}
    >
      <span className={isCount ? 'bold' : undefined}># {name}</span>
      {isCount ? <span className="count">{unreadChannelChatCount}</span> : null}
    </NavLink>
  );
};

export default EachChannel;
