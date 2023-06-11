/* eslint-disable react-hooks/exhaustive-deps */
import React, { DragEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Header, Container, DragOver } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import ChatBox from '@components/common/ChatBox';
import ChatList from '@components/common/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { sortChatList } from '@utils/sortChatList';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';
import { IDM } from '@typings/db';
import { useInfiniteDmChat, useDmUser, useMydata } from '@hooks/useApi';

const DirectMessage = () => {
  //id는 상대방
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { myData } = useMydata();
  const { dmUserData } = useDmUser();
  const { chatData, mutateDmChatData, isLoadingDmChatData, setSizeDmChatData } = useInfiniteDmChat();
  const [socket] = useSocket();
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachedEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const onSubmitForm = useCallback(
    async (e: FormEvent | KeyboardEvent) => {
      e.preventDefault();
      const savedChat = chat?.trim();
      if (!(savedChat && chatData && myData && dmUserData)) return;

      try {
        await mutateDmChatData((prevChatData) => {
          if (prevChatData === undefined || prevChatData.length <= 0) return prevChatData;
          const data: IDM = {
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: dmUserData.id,
            Receiver: dmUserData,
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
        await mutateDmChatData();
      }
    },
    [chat, chatData, myData, dmUserData, workspace, id, mutateDmChatData, setChat],
  );

  const onMessage = useCallback(
    async (data: IDM) => {
      // id는 상대방 아이디
      if (!myData) return;
      //나의 채팅이 아닌경우만
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        await mutateDmChatData((prevChatData) => {
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
    [myData, id, mutateDmChatData, chatData],
  );

  const onDragOver = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDragOver) return;
      setIsDragOver(() => true);
    },
    [isDragOver],
  );

  const onDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragRef.current === e.target) {
        //dragOver가 타겟일때만 닫히게
        setIsDragOver(() => false);
      }
    },
    [dragRef],
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
      await mutateDmChatData();
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
  }, [id, isLoadingDmChatData]);

  useEffect(() => {
    //로컬스토리지에 시간을 기록
    localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
  }, [workspace, id, chatData]);

  const chatListData = useMemo(() => sortChatList(chatData), [chatData]);

  if (!(myData && dmUserData)) {
    return null;
  }

  return (
    <Container onDrop={onDragDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
      <Header>
        <img src={gravatar.url(dmUserData.email, { s: '24px', d: 'retro' })} alt={dmUserData.nickname} />
        <span>{dmUserData.nickname}</span>
      </Header>
      <ChatList
        chatListData={chatListData}
        ref={scrollbarRef}
        isReachingEnd={isReachedEnd}
        setSize={setSizeDmChatData}
      />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
      {isDragOver ? <DragOver ref={dragRef}>업로드</DragOver> : null}
    </Container>
  );
};

export default DirectMessage;
