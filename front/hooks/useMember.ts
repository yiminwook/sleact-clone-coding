import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import useUser from './useUser';
import { IUser } from '@typings/db';

const useMember = (workspace: string | undefined) => {
  const { data: userData } = useUser();

  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };

  const { data, mutate, isLoading, error } = useSWR(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher<IUser[]>(),
    options,
  );
  return { data, mutate, isLoading, error };
};

export default useMember;
