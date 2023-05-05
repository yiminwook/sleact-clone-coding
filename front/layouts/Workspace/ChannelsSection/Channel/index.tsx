import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import { Container, Header } from '@pages/Channel/styles';
import { IChannel } from '@typings/db';
import React, { FormEvent, useCallback } from 'react';

interface ChannelProps {
  channelData: IChannel;
}

const Channel = ({ channelData }: ChannelProps) => {
  const [chat, onChangeChat] = useInput('');
  const onSubmitForm = useCallback((e: FormEvent) => {}, []);
  return (
    <Container>
      <Header></Header>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
