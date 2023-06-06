import { IChat, IDM } from '@typings/db';
import dayjs from 'dayjs';

export const sortChatList = (chatList?: IDM[][] | IChat[][]) => {
  if (!chatList) return {};
  const chatData = chatList.flat().reverse();
  const sections: Record<string, (IDM | IChat)[]> = {};
  chatData.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });

  return sections;
};
