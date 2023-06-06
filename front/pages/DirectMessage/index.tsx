/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { Header, Container } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import useUser from '@hooks/useUser';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import useDM from '@hooks/useDM';
import useChat from '@hooks/useChat';
import { sortChatList } from '@utils/sortChatList';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';
import { IDM } from '@typings/db';

const DirectMessage = () => {
  //id는 상대방
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useUser();
  const { data: dmData } = useDM({ workspace, id });
  const { data: chatData, mutate: chatMutate, setSize, isLoading } = useChat({ workspace, id });
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachedEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    async (e: FormEvent | KeyboardEvent) => {
      e.preventDefault();
      const savedChat = chat?.trim();
      if (!(savedChat && chatData && userData && dmData)) return;

      try {
        await chatMutate((prevChatData) => {
          if (prevChatData === undefined || prevChatData.length <= 0) return prevChatData;
          const data: IDM = {
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: userData.id,
            Sender: userData,
            ReceiverId: dmData.id,
            Receiver: dmData,
            createdAt: new Date(),
          };
          return [[data, ...prevChatData[0]]];
        }, false);
        setChat(() => '');
        setTimeout(() => {
          scrollbarRef.current?.scrollToBottom();
        }, 50);
        const response = await axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
          content: chat,
        });

        if (response.data !== 'ok') throw new Error('fail to post chats');
      } catch (error) {
        console.error(error);
      } finally {
        await chatMutate();
      }
    },
    [chat, chatData, userData, dmData, workspace, id, chatMutate, setChat],
  );

  const onMessage = useCallback(
    async (data: IDM) => {
      // id는 상대방 아이디
      if (!userData) return;
      //나의 채팅이 아닌경우만
      if (data.SenderId === Number(id) && userData.id !== Number(id)) {
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
    [userData, id, chatMutate, chatData],
  );

  useEffect(() => {
    if (!socket) return;
    socket.on('dm', onMessage);

    return () => {
      socket.off('dm', onMessage);
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
  }, [id, isLoading]);

  const chatListData = useMemo(() => sortChatList(chatData), [chatData]);

  if (!(userData && dmData)) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(dmData.email, { s: '24px', d: 'retro' })} alt={dmData.nickname} />
        <span>{dmData.nickname}</span>
      </Header>
      <ChatList chatListData={chatListData} ref={scrollbarRef} isEmpty={isEmpty} isReachingEnd={isReachedEnd} />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default DirectMessage;
