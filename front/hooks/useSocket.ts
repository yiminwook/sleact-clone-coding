import { handleToastError } from '@utils/handleToast';
import { useCallback } from 'react';
import { useParams } from 'react-router';
import io, { Socket } from 'socket.io-client';

const sockets: Record<string, Socket> = {};
const baseURL = 'http://localhost:3095'; //프록시 ws 오류 찾아보기

const useSocket = (): [Socket | undefined, () => void] => {
  const { workspace } = useParams<{ workspace: string }>();

  const disconnect = useCallback(() => {
    if (!workspace) return;
    sockets[workspace].disconnect();
    delete sockets[workspace];
  }, [workspace]);
  if (!workspace) return [undefined, disconnect];
  if (!sockets[workspace]) {
    sockets[workspace] = io(`${baseURL}/ws-${workspace}`);
    console.info('create socket', workspace, sockets[workspace]);
    sockets[workspace].on('connect_error', (error) => {
      handleToastError(error);
    });
  }
  return [sockets[workspace], disconnect];
};

export default useSocket;
