import { useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

const sockets: Record<string, Socket> = {};
const baseURL = 'http://localhost:3095'; //프록시 ws 오류 찾아보기

const useSocket = (workspace: string | undefined): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (!workspace) return;
    sockets[workspace].disconnect();
    delete sockets[workspace];
  }, [workspace]);
  if (!workspace) return [undefined, disconnect];
  if (!sockets[workspace]) {
    sockets[workspace] = io(`${baseURL}/ws-${workspace}`);
    console.info('create socket', workspace, sockets[workspace]);
    sockets[workspace].on('connect_error', (err) => {
      console.error(err);
      console.log(`connect_error due to ${err.message}`);
    });
  }
  return [sockets[workspace], disconnect];
};

export default useSocket;
