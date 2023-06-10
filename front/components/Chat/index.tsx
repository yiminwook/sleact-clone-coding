import { IChat, IDM } from '@typings/db';
import React, { useMemo, memo } from 'react';
import { ChatWrapper } from '@components/Chat/styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

interface ChatProps {
  data: IDM | IChat;
}
const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'http://localhost:3095';

const Chat = ({ data }: ChatProps) => {
  const user = 'Sender' in data ? data.Sender : data.User;

  const { workspace } = useParams<{ workspace: string }>();

  const convertContent = useMemo(() => {
    const { content } = data;
    return content.startsWith('uploads\\') || content.startsWith('upload/') ? (
      <img src={`${BACK_URL}/${content}`} style={{ maxHeight: '200px' }} alt={`${content}`}></img>
    ) : (
      regexifyString({
        input: content,
        pattern: /@\[.+?\]\(\d+?\)|\n/g,
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)\]\((\d+?)\)/);
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }

          return <br key={`${user.nickname}-br-${index}`} />; //줄바꿈 처리
        },
      })
    );
  }, [data.content, workspace]);

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format(' (D일 A h:mm )')}</span>
        </div>
        <p>{convertContent}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
