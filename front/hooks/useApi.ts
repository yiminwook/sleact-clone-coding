import { IChannel, IChat, IDM, IUser } from '@typings/db';
import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import { AxiosError } from 'axios';
import useSWRInfinite from 'swr/infinite';
import { useParams } from 'react-router';
import { SWRConfiguration } from 'swr/_internal';

const PAGE_PER_CHAT = 20;

const SWR_DEFAULT_OPTION: SWRConfiguration = {
  dedupingInterval: 60 * 60 * 1000,
  errorRetryInterval: 500,
  errorRetryCount: 3,
};

//userData

/** 로그인시 나의정보 */
export const useMydata = () => {
  const {
    data: myData,
    mutate: mutateMyData,
    isLoading: isLoadingMyData,
    error: errorMyData,
  } = useSWR<IUser | false, AxiosError>('/api/users', fetcher, SWR_DEFAULT_OPTION);
  return { myData, mutateMyData, isLoadingMyData, errorMyData };
};

/** dm받는 상대방데이터 */
export const useDmUser = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const {
    data: dmUserData,
    mutate: mutateDmUserData,
    isLoading: isLoadingDmUserData,
    error: errorDmUser,
  } = useSWR<IUser>(id && workspace ? `/api/workspaces/${workspace}/users/${id}` : null, fetcher, SWR_DEFAULT_OPTION);
  return { dmUserData, mutateDmUserData, isLoadingDmUserData, errorDmUser };
};

//workspace

/** :workspace 내부의 내가 속해있는 채널 리스트를 가져옴 */
export const useWorkspaceChannelList = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const { myData } = useMydata();

  const {
    data: workspaceChannelList = [],
    mutate: mutateWorkspaceChannelList,
    isLoading: isLoadingWorkspaceChannelList,
    error: errorWorkspaceChannelList,
  } = useSWR<IChannel[]>(myData ? `/api/workspaces/${workspace}/channels` : null, fetcher, SWR_DEFAULT_OPTION);
  return {
    workspaceChannelList,
    mutateWorkspaceChannelList,
    isLoadingWorkspaceChannelList,
    errorWorkspaceChannelList,
  };
};

/** :workspace :channel 채널 데이터 */
export const useWorkspaceChannelData = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { myData } = useMydata();

  const {
    data: workspaceChannelData,
    mutate: mutateWorkspaceChannelData,
    isLoading: isLoadingWorkspaceChannelData,
    error: errorWorkspaceChannelData,
  } = useSWR<IChannel>(myData ? `/api/workspaces/${workspace}/channels/${channel}` : null, fetcher, SWR_DEFAULT_OPTION);
  return {
    workspaceChannelData,
    mutateWorkspaceChannelData,
    isLoadingWorkspaceChannelData,
    errorWorkspaceChannelData,
  };
};

/** :workspace :channel 채널 멤버리스트 */
export const useWorkspaceChannelMemberList = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { myData } = useMydata();

  const {
    data: workspaceChannelMemeberList,
    mutate: mutateWorkspaceChannelMemeberList,
    isLoading: isLoadingWorkspaceChannelMemeberList,
    error: errorWorkspaceChannelMemeberList,
  } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
    SWR_DEFAULT_OPTION,
  );
  return {
    workspaceChannelMemeberList,
    mutateWorkspaceChannelMemeberList,
    isLoadingWorkspaceChannelMemeberList,
    errorWorkspaceChannelMemeberList,
  };
};

/** :workspace 내부의 멤버 목록을 가져옴 */
export const useWorkspaceMemberList = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const { myData } = useMydata();

  const {
    data: workspaceMemberList = [],
    mutate: mutateWorkspaceMemberList,
    isLoading: isLoadingWorkspaceMemberList,
    error: errorWorkspaceMemberList,
  } = useSWR<IUser[]>(myData ? `/api/workspaces/${workspace}/members` : null, fetcher, SWR_DEFAULT_OPTION);
  return {
    workspaceMemberList,
    mutateWorkspaceMemberList,
    isLoadingWorkspaceMemberList,
    errorWorkspaceMemberList,
  };
};

/** :channel 내부의 멤버 목록을 가져옴 */
export const useChannelMemeberList = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { myData } = useMydata();
  const { mutate: mutateChannelMemberList } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
    SWR_DEFAULT_OPTION,
  );

  return { mutateChannelMemberList };
};

//unread chat count

export const useUnreadChannelChatCount = (channelName: string) => {
  const { myData } = useMydata();
  const { workspace } = useParams<{ workspace: string }>();
  const date = localStorage.getItem(`${workspace}-${channelName}`) || 0;
  const { data: unreadChannelChatCount, mutate: mutateUnreadChannelChatCount } = useSWR<number>(
    myData ? `/api/workspaces/${workspace}/channels/${channelName}/unreads?after=${date}` : null,
    fetcher,
  );

  return { unreadChannelChatCount, mutateUnreadChannelChatCount };
};

export const useUnreadDmChatCount = (id: number) => {
  const { myData } = useMydata();
  const { workspace } = useParams<{ workspace: string }>();
  const date = localStorage.getItem(`${workspace}-${id}`) || 0;
  const { data: unreadDmChatCount, mutate: mutateUnreadDmChatCount } = useSWR<number>(
    myData ? `/api/workspaces/${workspace}/dms/${id}/unreads?after=${date}` : null,
    fetcher,
  );

  return { unreadDmChatCount, mutateUnreadDmChatCount };
};

//swrInfinite chat 무한 스크롤

/** 채널채팅방 데이터 */
export const useInifiteChannelChat = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const {
    data: channelChatData,
    mutate: mutateChannelChatData,
    isLoading: isLoadingChannelChatData,
    setSize: setSizeChannelChatData,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=${PAGE_PER_CHAT}&page=${index + 1}`,
    fetcher,
  );

  return { channelChatData, mutateChannelChatData, isLoadingChannelChatData, setSizeChannelChatData };
};

/** DM채팅방 데이터 */
export const useInfiniteDmChat = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const {
    data: dmChatData,
    mutate: mutateDmChatData,
    isLoading: isLoadingDmChatData,
    error: errorDmChatData,
    setSize: setSizeDmChatData,
  } = useSWRInfinite<IDM[]>(
    (index) =>
      id && workspace
        ? `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_PER_CHAT}&page=${index + 1}`
        : null,
    fetcher,
    SWR_DEFAULT_OPTION,
  );
  return { chatData: dmChatData, mutateDmChatData, isLoadingDmChatData, errorDmChatData, setSizeDmChatData };
};
