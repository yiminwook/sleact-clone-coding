import fetcher from '@hooks/fetcher';
import useUser from '@hooks/useUser';
import { IUser } from '@typings/db';
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

interface EachDmProps {
  member: IUser;
  isOnline: boolean;
}

const EachDm = ({ member, isOnline }: EachDmProps) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { myData } = useUser();
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    myData ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher,
  );

  const isCount = useMemo(() => count !== undefined && count > 0, [count]);

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dm/${member.id}`) {
      mutate();
    }
  }, [mutate, location.pathname, workspace, member]);

  if (!myData) return null;

  return (
    <NavLink
      key={`eachDm-${member.id}`}
      className={({ isActive }) => (isActive === true ? 'selected' : '')}
      to={`/workspace/${workspace}/dm/${member.id}`}
    >
      <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
          isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
        }`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      ></i>
      <span className={isCount ? 'bold' : undefined}># {member.nickname}</span>
      {member.id === myData.id ? <span> (나)</span> : null}
      {isCount ? <span className="count">{count}</span> : null}
    </NavLink>
  );
};

export default EachDm;
