import { IUser } from '@typings/db';
import useSWR from 'swr';
import fetcher from '@hooks/fetcher';

const useUser = () => {
  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };
  const { data, mutate, isLoading } = useSWR('/api/users', fetcher<IUser | false>(), options);
  return { data, mutate, isLoading };
};

export default useUser;
