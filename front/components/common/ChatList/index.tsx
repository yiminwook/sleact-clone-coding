import React, { useCallback, forwardRef, MutableRefObject, ForwardRefRenderFunction, memo } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/common/ChatList/styles';
import Chat from '@components/common/Chat';
import { positionValues, Scrollbars } from 'react-custom-scrollbars';
import { sortChatList } from '@utils/sortChatList';
import { SWRInfiniteResponse } from 'swr/infinite';

interface ChatListProps {
  chatListData: ReturnType<typeof sortChatList>;
  isReachingEnd: boolean;
  setSize: SWRInfiniteResponse['setSize'];
}

const ChatList: ForwardRefRenderFunction<Scrollbars, ChatListProps> = (
  { chatListData, isReachingEnd, setSize },
  scrollbarRef,
) => {
  const onScroll = useCallback(
    async (values: positionValues) => {
      const currentTarget = (scrollbarRef as MutableRefObject<Scrollbars>).current;
      if (values.scrollTop === 0 && !isReachingEnd) {
        //스크롤이 맨위일때 과거 채팅을 가져온다.
        await setSize((prevSize) => prevSize + 1);
        //스크롤 높이 유지
        currentTarget.scrollTop(currentTarget.getScrollHeight() - values.scrollHeight);
      }
    },
    [isReachingEnd, setSize, scrollbarRef],
  );

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatListData).map(([monthDay, chatData]) => (
          <Section key={`chatListSeaction-${monthDay}`} className={`section-${monthDay}`}>
            <StickyHeader>
              <button>{monthDay}</button>
            </StickyHeader>
            {chatData.map((chat) => (
              <Chat key={`chat-${chat.id}-${chat.createdAt}`} data={chat} />
            ))}
          </Section>
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default memo(forwardRef(ChatList));
