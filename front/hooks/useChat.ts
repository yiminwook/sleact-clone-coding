import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import { IDM } from '@typings/db';

/** DM채팅방 데이터 */
const useChat = ({ id, workspace, index = 0 }: { id?: string; workspace?: string; index?: number }) => {
  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };

  const { data, mutate, isLoading, error } = useSWR<IDM[]>(
    id && workspace ? `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${20}&page=${index + 1}` : null,
    fetcher,
    options,
  );
  return { data, mutate, isLoading, error };
};

export default useChat;
