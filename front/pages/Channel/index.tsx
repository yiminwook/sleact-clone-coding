import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import { useParams } from 'react-router';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useSWR from 'swr';
import { IChannel, IUser, IChat } from '@typings/db';
import fetcher from '@hooks/fetcher';
import useUser from '@hooks/useUser';
import useSocket from '@hooks/useSocket';
import useInput from '@hooks/useInput';
import Scrollbars from 'react-custom-scrollbars';
import axios from 'axios';
import useSWRInfinite from 'swr/infinite';
import InviteChannelModal from '@components/InviteChannelModal';
import { sortChatList } from '@utils/sortChatList';

const ChannelPage = () => {
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: userData } = useUser();
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const {
    data: chatData,
    mutate: chatMutate,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const {
    data: channelMembersData,
    mutate: channelMutate,
    isLoading,
  } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null, fetcher);

  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachedEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    async (e: FormEvent | KeyboardEvent) => {
      e.preventDefault();
      const savedChat = chat?.trim();
      if (!(savedChat && chatData && userData && channelData)) return;

      try {
        await chatMutate((prevChatData) => {
          if (prevChatData === undefined || prevChatData.length <= 0) return prevChatData;
          const data: IChat = {
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: userData.id,
            User: userData,
            ChannelId: channelData.id,
            Channel: channelData,
            createdAt: new Date(),
          };
          return [[data, ...prevChatData[0]]];
        }, false);

        setChat(() => '');
        setTimeout(() => {
          scrollbarRef.current?.scrollToBottom();
        }, 50);

        const response = await axios.post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
          content: chat,
        });

        if (response.data !== 'ok') throw new Error('fail to post chats');
      } catch (error) {
        console.error(error);
      } finally {
        await channelMutate();
      }
    },
    [chat, channelData, userData, workspace, chatData, channel, channelMutate, setChat],
  );

  const onMessage = useCallback(
    async (data: IChat) => {
      // id는 상대방 아이디
      if (!userData) return;
      //나의 채팅이 아닌경우만
      if (data.Channel.name === channel && data.UserId !== userData.id) {
        await chatMutate((prevChatData) => {
          if (prevChatData === undefined || prevChatData.length <= 0) return prevChatData;
          return [[data, ...prevChatData[0]]];
        }, false);

        const currentTarget = scrollbarRef.current;

        if (
          currentTarget &&
          currentTarget.getScrollHeight() - currentTarget.getClientHeight() - currentTarget.getScrollTop() < 150
        ) {
          setTimeout(() => {
            currentTarget?.scrollToBottom();
          }, 50);
        }
      }
    },
    [userData, channel, chatMutate],
  );

  const inviteChannel = useCallback(() => {
    setShowInviteChannelModal(() => true);
  }, [showInviteChannelModal]);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(() => false);
  }, [showInviteChannelModal]);

  useEffect(() => {
    if (!socket) return;
    socket.on('message', onMessage);

    return () => {
      socket.off('message', onMessage);
    };
  }, [socket, onMessage]);

  //첫화면에서 스크롤바 제일 아래로
  useEffect(() => {
    if (!chatData || chatData.length <= 0) return;
    console.log('스크롤바 아래로');
    const timer = setTimeout(() => {
      scrollbarRef.current?.scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [channel, isLoading]);

  const chatListData = useMemo(() => sortChatList(chatData), [chatData]);

  if (!(userData && channelData)) {
    return null;
  }

  return (
    <Container>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            onClick={inviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true"></i>
          </button>
        </div>
      </Header>
      <ChatList chatListData={chatListData} ref={scrollbarRef} isEmpty={isEmpty} isReachingEnd={isReachedEnd} />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
      <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} />
    </Container>
  );
};

export default ChannelPage;
