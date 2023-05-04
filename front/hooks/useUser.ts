import { IUser } from '@typings/db';
import useSWR from 'swr';
import fetcher from '@hooks/fetcher';

/** 로그인시 유저정보 */
const useUser = () => {
  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };
  const { data, mutate, isLoading } = useSWR<IUser | false>('/api/users', fetcher, options);
  return { data, mutate, isLoading };
};

export default useUser;
