import React, { useCallback, useRef } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface ChatListProps {
  chatData: IDM[] | undefined;
}

const ChatList = ({ chatData = [] }: ChatListProps) => {
  const scrollbarRef = useRef<Scrollbars>(null);
  const onScroll = useCallback(() => {
    //스크롤이 올라가면 과거 채팅을 가져온다.
  }, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        <Section>
          <StickyHeader>
            <button>"date"</button>
          </StickyHeader>
          {chatData.map((chat) => (
            <Chat key={chat.id} data={chat} />
          ))}
        </Section>
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
