import fetcher from '@hooks/fetcher';
import useUser from '@hooks/useUser';
import { IChannel } from '@typings/db';
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

interface EachChannelProps {
  channel: IChannel;
}

const EachChannel = ({ channel }: EachChannelProps) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { myData } = useUser();
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;

  const { data: count, mutate } = useSWR<number>(
    myData ? `/api/workspaces/${workspace}/channels/${channel.name}/unreads?after=${date}` : null,
    fetcher,
  );

  const isCount = useMemo(() => count !== undefined && count > 0, [count]);

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/channel/${channel.name}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, channel]);

  return (
    <NavLink
      key={`eachChannel-${channel.name}`}
      className={({ isActive }) => (isActive === true ? 'selected' : '')}
      to={`/workspace/${workspace}/channel/${channel.name}`}
    >
      <span className={isCount ? 'bold' : undefined}># {channel.name}</span>
      {isCount ? <span className="count">{count}</span> : null}
    </NavLink>
  );
};

export default EachChannel;
