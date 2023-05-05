import React, { FormEvent, useCallback } from 'react';
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

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useUser();

  const { data: dmData } = useDM({ workspace, id });
  const { data: chatData, mutate: chatMutate } = useChat({ workspace, id });
  const [chat, onChangeChat, setChat] = useInput('');

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

  return (
    <Container>
      <Header>
        <img src={gravatar.url(dmData.email, { s: '24px', d: 'retro' })} alt={dmData.nickname} />
        <span>{dmData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default DirectMessage;
