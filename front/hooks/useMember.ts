import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import useUser from '@hooks/useUser';
import { IUser } from '@typings/db';

/** :workspace 내부의 멤버 목록을 가져옴 */
const useMember = (workspace: string | undefined) => {
  const { myData } = useUser();

  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };

  const { data, mutate, isLoading, error } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
    options,
  );
  return { data, mutate, isLoading, error };
};

export default useMember;
