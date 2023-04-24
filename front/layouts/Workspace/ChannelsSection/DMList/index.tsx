import useMember from '@hooks/useMember';
import { IDM, IUser } from '@typings/db';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { CollapseButton } from './styles';

interface DMListProps {
  userData?: IUser | false;
}

const DMList = ({ userData }: DMListProps) => {
  if (!userData) return null;

  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<Record<string, number>>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const { workspace } = useParams();
  const { data: memberData } = useMember(workspace);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((pre) => !pre);
  }, []);

  const resetCount = useCallback((id: number) => {
    setCountList((list) => {
      return {
        ...list,
        [id]: 0,
      };
    });
  }, []);

  const onMessage = (data: IDM) => {
    setCountList((list) => {
      let count = list[data.SenderId] ?? 0;
      return {
        ...list,
        [data.SenderId]: count + 1,
      };
    });
  };

  useEffect(() => {
    setOnlineList(() => []);
    setCountList(() => ({}));
  }, [workspace]);

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
        <span>Direct Messages</span>
      </h2>
      {!channelCollapse ? (
        <CollapseItemList
          user={userData}
          member={memberData}
          onlineList={onlineList}
          counList={countList}
          workspace={workspace}
          onClickFunc={resetCount}
        />
      ) : null}
    </>
  );
};

export default DMList;

interface CollapseItemListProps {
  user: IUser;
  member: IUser[] | undefined;
  workspace: string | undefined;
  onlineList: number[];
  counList: Record<string, number>;
  onClickFunc: (id: number) => void;
}

const CollapseItemList = ({ user, member, workspace, onlineList, counList, onClickFunc }: CollapseItemListProps) => {
  if (!member) return null;

  return (
    <>
      {member.map((member) => (
        <CollapseItem
          key={member.id}
          user={user}
          member={member}
          onlineList={onlineList}
          counList={counList}
          workspace={workspace}
          onClickFunc={onClickFunc}
        />
      ))}
    </>
  );
};

interface CollapseItemProps extends Omit<CollapseItemListProps, 'member'> {
  member: IUser;
}

const CollapseItem = ({ user, member, workspace, onlineList, counList, onClickFunc }: CollapseItemProps) => {
  const isOnline = onlineList.includes(member.id);
  const count = counList[member.id] ?? 0;

  return (
    <NavLink
      className={({ isActive }) => (isActive === true ? 'selected' : '')}
      to={`/workspace/${workspace}/dm/${member.id}`}
      onClick={() => onClickFunc(member.id)}
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
      />
      <span>{member.nickname}</span>
      {member.id === user?.id && <span> (나)</span>}
    </NavLink>
  );
};
