import React from 'react';
import { ChatZone, Section } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';

interface ChatListProps {
  chatData: IDM[] | undefined;
}

const ChatList = ({ chatData = [] }: ChatListProps) => {
  return (
    <ChatZone>
      {chatData.map((chat) => (
        <Chat key={chat.id} data={chat} />
      ))}
      <Section>chatList</Section>
    </ChatZone>
  );
};

export default ChatList;
