import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import { IChannel } from '@typings/db';
import useUser from './useUser';

const useMembers = (workspace: string | undefined) => {
  const { data: userData } = useUser();

  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };

  const { data, mutate, isLoading, error } = useSWR(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher<IChannel[]>(),
    options,
  );
  return { data, mutate, isLoading, error };
};

export default useMembers;
