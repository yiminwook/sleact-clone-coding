import { useMydata, useUnreadDmChatCount } from '@hooks/useApi';
import { IUser } from '@typings/db';
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

interface EachDmProps {
  member: IUser;
  isOnline: boolean;
}

const EachDm = ({ member: { id, nickname }, isOnline }: EachDmProps) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { myData } = useMydata();
  const { unreadDmChatCount, mutateUnreadDmChatCount } = useUnreadDmChatCount(id);

  const isCount = useMemo(() => unreadDmChatCount !== undefined && unreadDmChatCount > 0, [unreadDmChatCount]);

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dm/${id}`) {
      mutateUnreadDmChatCount();
    }
  }, [mutateUnreadDmChatCount, location, workspace, id, nickname]);

  if (!myData) return null;

  return (
    <NavLink
      key={`eachDm-${id}`}
      className={({ isActive }) => (isActive === true ? 'selected' : '')}
      to={`/workspace/${workspace}/dm/${id}`}
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
      <span className={isCount ? 'bold' : undefined}># {nickname}</span>
      {id === myData.id ? <span> (나)</span> : null}
      {isCount ? <span className="count">{unreadDmChatCount}</span> : null}
    </NavLink>
  );
};

export default EachDm;
