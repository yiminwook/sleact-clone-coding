import useSWR from 'swr';
import fetcher from './fetcher';

export type WorkSpaceType = {
  id: number;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  WorkspaceId: number;
  UserId: number;
};

export interface userDataType {
  id: number;
  nickname: string;
  email: string;
  WorkSpaces: WorkSpaceType[];
}

const useUser = () => {
  const options = {
    dedupingInterval: 60 * 60 * 1000,
    errorRetryInterval: 500,
    errorRetryCount: 3,
  };
  const { data, mutate, isLoading } = useSWR('/api/users', fetcher<userDataType | boolean>(), options);
  return { data, mutate, isLoading };
};

export default useUser;
