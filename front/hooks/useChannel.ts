import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import { IChannel } from '@typings/db';
import useUser from '@hooks/useUser';

/** :workspace 내부의 내가 속해있는 채널 리스트를 가져옴 */
const useChannel = (workspace: string | undefined) => {
  const { data: userData } = useUser();

  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };

  const { data, mutate, isLoading, error } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
    options,
  );
  return { data, mutate, isLoading, error };
};

export default useChannel;
