import { IDM } from '@typings/db';
import React from 'react';
import { ChatWrapper } from '@components/Chat/styles';
import gravatar from 'gravatar';

interface ChatProps {
  data: IDM;
}
const Chat = ({ data }: ChatProps) => {
  const user = data.Sender;
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{data.createdAt}</span>
        </div>
      </div>
      <p>{data.content}</p>
    </ChatWrapper>
  );
};

export default Chat;
