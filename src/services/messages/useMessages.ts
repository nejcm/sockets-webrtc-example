import { useCallback, useEffect, useState } from 'react';
import { SocketMessage } from '../socket/useSocket';
import { User } from '../user/useUser';

export interface UseUserResponse {
  usersCount: number;
  messages: SocketMessage[];
  send: (message: string, user: User) => void;
}

export const useMessages = (
  socket: SocketIOClient.Socket | undefined,
): UseUserResponse => {
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [usersCount] = useState<number>(1);

  const send = useCallback(
    (message: string, user: User): void => {
      socket?.emit('send-message', message);
      setMessages((prev) => [
        ...prev,
        {
          user,
          message,
        },
      ]);
    },
    [socket],
  );

  useEffect(() => {
    socket?.on('new-message', (data: SocketMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket?.on('user-connected', (data: SocketMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket?.on('user-disconnected', (data: SocketMessage) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [socket]);

  return { usersCount, messages, send };
};
