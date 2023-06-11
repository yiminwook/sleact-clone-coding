/* eslint-disable react-hooks/exhaustive-deps */
import React, { DragEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Container, DragOver, Header } from '@pages/Channel/styles';
import { useParams } from 'react-router';
import ChatList from '@components/common/ChatList';
import ChatBox from '@components/common/ChatBox';
import { IChat } from '@typings/db';
import useSocket from '@hooks/useSocket';
import useInput from '@hooks/useInput';
import Scrollbars from 'react-custom-scrollbars';
import axios from 'axios';
import InviteChannelModal from '@components/Workspace/Channel/InviteChannelModal';
import { sortChatList } from '@utils/sortChatList';
import {
  useInifiteChannelChat,
  useMydata,
  useWorkspaceChannelData,
  useWorkspaceChannelMemberList,
} from '@hooks/useApi';

const ChannelPage = () => {
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { myData } = useMydata();
  const { workspaceChannelData } = useWorkspaceChannelData();
  const { channelChatData, mutateChannelChatData, isLoadingChannelChatData, setSizeChannelChatData } =
    useInifiteChannelChat();

  const { workspaceChannelMemeberList } = useWorkspaceChannelMemberList();

  const [socket] = useSocket();
  const isEmpty = channelChatData?.[0]?.length === 0;
  const isReachedEnd =
    isEmpty || (channelChatData && channelChatData[channelChatData.length - 1]?.length < 20) || false;

  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const onSubmitForm = useCallback(
    async (e: FormEvent | KeyboardEvent) => {
      e.preventDefault();
      const savedChat = chat?.trim();
      if (!(savedChat && channelChatData && myData && workspaceChannelData)) return;

      try {
        await mutateChannelChatData((prevChatData) => {
          if (prevChatData === undefined || prevChatData.length <= 0) return prevChatData;
          const data: IChat = {
            id: (channelChatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData.id,
            User: myData,
            ChannelId: workspaceChannelData.id,
            Channel: workspaceChannelData,
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
        await mutateChannelChatData();
      }
    },
    [chat, workspaceChannelData, myData, workspace, channelChatData, channel, mutateChannelChatData, setChat],
  );

  const onMessage = useCallback(
    async (data: IChat) => {
      // id는 상대방 아이디
      if (!myData) return;
      //나의 채팅이 아닌경우만
      if (
        (data.Channel.name === channel &&
          (data.content.startsWith('uploads\\') || data.content.startsWith('upload/'))) ||
        data.UserId !== myData.id
      ) {
        //  내가 보낸 이미지는 optimistic ui 적용x
        await mutateChannelChatData((prevChatData) => {
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
    [myData, channel, channelChatData],
  );

  const onDragOver = useCallback(
    (e: DragEvent) => {
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
      await axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData);
    } catch (error) {
      console.error(error);
    } finally {
      await mutateChannelChatData();
      scrollbarRef.current?.scrollToBottom();
      setIsDragOver(() => false);
    }
  }, []);

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

  useEffect(() => {
    //첫화면에서 스크롤바 제일 아래로
    if (!channelChatData || channelChatData.length <= 0) return;
    const timer = setTimeout(() => {
      scrollbarRef.current?.scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [channel, isLoadingChannelChatData]);

  useEffect(() => {
    //로컬스토리지에 시간을 기록
    localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
  }, [workspace, channel, channelChatData]);

  const chatListData = useMemo(() => sortChatList(channelChatData), [channelChatData]);

  if (!(myData && workspaceChannelData)) {
    return null;
  }

  return (
    <Container onDrop={onDragDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{workspaceChannelMemeberList?.length}</span>
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
      <ChatList
        chatListData={chatListData}
        ref={scrollbarRef}
        isReachingEnd={isReachedEnd}
        setSize={setSizeChannelChatData}
      />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
      <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} />
      {isDragOver ? <DragOver ref={dragRef}>업로드</DragOver> : null}
    </Container>
  );
};

export default ChannelPage;
