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
  const {
    data: myData,
    mutate: mutateMyData,
    isLoading: isLoadingMyData,
  } = useSWR<IUser | false>('/api/users', fetcher, options);
  return { myData, mutateMyData, isLoadingMyData };
};

export default useUser;
