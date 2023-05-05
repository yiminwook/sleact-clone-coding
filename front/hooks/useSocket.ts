import { useCallback } from 'react';
import io from 'socket.io-client';

const sockets: Record<string, SocketIOClient.Socket> = {};

const useSocket = (workspace?: string): [socket: SocketIOClient.Socket | undefined, disconnect: () => void] => {
  const disconnect = useCallback(() => {
    if (!workspace) return;
    sockets[workspace].disconnect();
    delete sockets[workspace];
  }, [workspace]);

  if (!workspace) return [undefined, disconnect];
  sockets[workspace] = io.connect(`/api/ws-${workspace}`);
  sockets[workspace].emit('hello', 'world');
  sockets[workspace].on('message', (data: any) => console.log(data));
  sockets[workspace].on('data', (data: any) => console.log(data));
  sockets[workspace].on('onlineList', (data: any) => console.log(data));
  return [sockets[workspace], disconnect];
};

export default useSocket;
