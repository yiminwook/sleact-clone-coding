import React, { useCallback, useRef } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';
import { sortChatList } from '@utils/sortChatList';

interface ChatListProps {
  chatListData: ReturnType<typeof sortChatList>;
}

const ChatList = ({ chatListData }: ChatListProps) => {
  const scrollbarRef = useRef<Scrollbars>(null);
  const onScroll = useCallback(() => {
    //스크롤이 올라가면 과거 채팅을 가져온다.
  }, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatListData).map(([monthDay, chatData]) => (
          <Section key={monthDay} className={`section-${monthDay}`}>
            <StickyHeader>
              <button>{monthDay}</button>
            </StickyHeader>
            {chatData.map((chat) => (
              <Chat key={chat.id} data={chat} />
            ))}
          </Section>
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
