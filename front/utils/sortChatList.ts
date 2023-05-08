import { IDM } from '@typings/db';
import dayjs from 'dayjs';

export const sortChatList = (chatList?: IDM[]) => {
  if (!chatList) return {};
  const sections: Record<string, IDM[]> = {};
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });

  return sections;
};
