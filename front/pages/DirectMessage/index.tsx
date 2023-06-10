/* eslint-disable react-hooks/exhaustive-deps */
import React, { DragEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Header, Container, DragOver } from '@pages/DirectMessage/styles';
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
  const { myData } = useUser();
  const { data: dmData } = useDM({ workspace, id });
  const { data: chatData, mutate: chatMutate, setSize, isLoading } = useChat({ workspace, id });
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachedEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const onSubmitForm = useCallback(
    async (e: FormEvent | KeyboardEvent) => {
      e.preventDefault();
      const savedChat = chat?.trim();
      if (!(savedChat && chatData && myData && dmData)) return;

      try {
        await chatMutate((prevChatData) => {
          if (prevChatData === undefined || prevChatData.length <= 0) return prevChatData;
          const data: IDM = {
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
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
    [chat, chatData, myData, dmData, workspace, id, chatMutate, setChat],
  );

  const onMessage = useCallback(
    async (data: IDM) => {
      // id는 상대방 아이디
      if (!myData) return;
      //나의 채팅이 아닌경우만
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
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
    [myData, id, chatMutate, chatData],
  );

  const onDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();

      if (isDragOver) return;
      setIsDragOver(() => true);
    },
    [isDragOver],
  );

  const onDragDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          const item = e.dataTransfer.items[i];
          if (item.kind === 'file') {
            const file = item.getAsFile()!;
            formData.append('image', file);
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const file = e.dataTransfer.files[i];
          formData.append('image', file);
        }
      }

      if (!formData.has('image')) return;
      await axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData);
    } catch (error) {
      console.error(error);
    } finally {
      await chatMutate();
      scrollbarRef.current?.scrollToBottom();
      setIsDragOver(() => false);
    }
  }, []);

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
    const timer = setTimeout(() => {
      scrollbarRef.current?.scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [id, isLoading]);

  const chatListData = useMemo(() => sortChatList(chatData), [chatData]);

  if (!(myData && dmData)) {
    return null;
  }

  return (
    <Container onDrop={onDragDrop} onDragOver={onDragOver}>
      <Header>
        <img src={gravatar.url(dmData.email, { s: '24px', d: 'retro' })} alt={dmData.nickname} />
        <span>{dmData.nickname}</span>
      </Header>
      <ChatList chatListData={chatListData} ref={scrollbarRef} isEmpty={isEmpty} isReachingEnd={isReachedEnd} />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
      {isDragOver ? <DragOver>업로드</DragOver> : null}
    </Container>
  );
};

export default DirectMessage;
