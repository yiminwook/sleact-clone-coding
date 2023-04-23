import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import { IChannel } from '@typings/db';
import useUser from './useUser';

interface useChannelProps {
  workspace: string | undefined;
  userData: ReturnType<typeof useUser>['data'];
}

const useChannel = ({ workspace, userData }: useChannelProps) => {
  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };
  const { data, mutate, isLoading, error } = useSWR(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher<IChannel[]>(),
    options,
  );
  return { data, mutate, isLoading, error };
};

export default useChannel;
