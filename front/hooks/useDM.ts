import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import { IUser } from '@typings/db';

/** dm받는 상대방데이터 */
const useDM = ({ id, workspace }: { id?: string; workspace?: string }) => {
  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };

  const { data, mutate, isLoading, error } = useSWR<IUser>(
    id && workspace ? `/api/workspaces/${workspace}/users/${id}` : null,
    fetcher,
    options,
  );
  return { data, mutate, isLoading, error };
};

export default useDM;
