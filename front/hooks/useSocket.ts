import { useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

const sockets: Record<string, Socket> = {};
const baseURL = 'http://localhost:3095';

const useSocket = (workspace: string | undefined): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (!workspace) return;
    sockets[workspace].disconnect();
    delete sockets[workspace];
  }, [workspace]);
  if (!workspace) return [undefined, disconnect];
  if (!sockets[workspace]) {
    sockets[workspace] = io(`${baseURL}/ws-${workspace}`, { transports: ['websocket'] });
  }
  return [sockets[workspace], disconnect];
};

export default useSocket;
