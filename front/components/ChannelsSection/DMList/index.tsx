import useMember from '@hooks/useMember';
import useUser from '@hooks/useUser';
import { IDM, IUser } from '@typings/db';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { CollapseButton } from '@components/ChannelsSection/DMList/styles';
import useSocket from '@hooks/useSocket';

const DMList = () => {
  const { workspace } = useParams();

  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<Record<string, number>>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const [socket, disconnect] = useSocket(workspace);

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
    // setCountList(() => ({}));
  }, [workspace]);

  useEffect(() => {
    if (!socket) return;
    socket.on('onlineList', (data: number[]) => {
      setOnlineList(() => data);
    });
    // socket.on('dm', onMessage);
    // console.log('socket on dm', socket.hasListeners('dm'), socket);
    return () => {
      // socket.off('dm', onMessage);
      // console.log('socket off dm', socket.hasListeners('dm'));
      socket.off('onlineList');
    };
  }, [socket]);

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
        <CollapseItemList onlineList={onlineList} counList={countList} onClickFunc={resetCount} />
      ) : null}
    </>
  );
};

export default DMList;

interface CollapseItemListProps {
  onlineList: number[];
  counList: Record<string, number>;
  onClickFunc: (id: number) => void;
}

const CollapseItemList = ({ onlineList, counList, onClickFunc }: CollapseItemListProps) => {
  const { workspace } = useParams();
  const { data: memberData } = useMember(workspace);

  if (!memberData) return null;

  return (
    <>
      {memberData.map((member) => (
        <CollapseItem
          key={member.id}
          member={member}
          onlineList={onlineList}
          counList={counList}
          onClickFunc={onClickFunc}
        />
      ))}
    </>
  );
};

interface CollapseItemProps extends CollapseItemListProps {
  member: IUser;
}

const CollapseItem = ({ member, onlineList, counList, onClickFunc }: CollapseItemProps) => {
  const { workspace } = useParams();
  const { data: userData } = useUser();
  const isOnline = onlineList.includes(member.id);
  // const count = counList[member.id] ?? 0;

  if (!userData) return null;

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
      {member.id === userData.id && <span> (나)</span>}
    </NavLink>
  );
};
