import React, { FormEvent, useCallback, useRef } from 'react';
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

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useUser();
  const { data: dmData } = useDM({ workspace, id });
  const { data: chatData, mutate: chatMutate, setSize } = useChat({ workspace, id });
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachedEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    async (e: FormEvent | KeyboardEvent) => {
      e.preventDefault();
      try {
        if (!chat.trim()) return;
        const response = await axios.post<'ok'>(`/api/workspaces/${workspace}/dms/${id}/chats`, {
          content: chat,
        });

        if (response.data !== 'ok') throw new Error('fail to post chats');
        setChat(() => '');
        chatMutate();
      } catch (error) {
        console.error(error);
      }
    },
    [chat, id, workspace, setChat, chatMutate],
  );

  if (!(userData && dmData)) {
    return null;
  }

  const chatListData = sortChatList(chatData ? chatData.flat().reverse() : []);

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
