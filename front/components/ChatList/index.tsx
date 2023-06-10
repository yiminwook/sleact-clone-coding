import React, { useCallback, forwardRef, MutableRefObject, ForwardRefRenderFunction } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { positionValues, Scrollbars } from 'react-custom-scrollbars';
import useChat from '@hooks/useChat';
import { useParams } from 'react-router';
import { sortChatList } from '@utils/sortChatList';

interface ChatListProps {
  chatListData: ReturnType<typeof sortChatList>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList: ForwardRefRenderFunction<Scrollbars, ChatListProps> = (
  { chatListData, isEmpty, isReachingEnd },
  scrollbarRef,
) => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { setSize } = useChat({ workspace, id });

  const onScroll = useCallback(
    async (values: positionValues) => {
      //스크롤이 올라가면 과거 채팅을 가져온다.
      const currentTarget = (scrollbarRef as MutableRefObject<Scrollbars>).current;
      if (values.scrollTop === 0 && !isReachingEnd) {
        // console.log('가장위');
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

export default forwardRef(ChatList);
