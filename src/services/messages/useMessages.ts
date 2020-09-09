import { useCallback, useEffect, useState } from 'react';
import { Actions } from '../socket/actions';
import { SocketMessage, useSocket } from '../socket/useSocket';
import { User } from '../user/useUser';

export interface UseUserResponse {
  usersCount: number;
  messages: SocketMessage[];
  send: (message: string, user: User) => void;
}

export const useMessages = (): UseUserResponse => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [usersCount] = useState<number>(1);

  const send = useCallback(
    (message: string, user: User): void => {
      socket?.emit(Actions.SEND_MESSAGE, message);
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
    socket?.on(Actions.NEW_MESSAGE, (data: SocketMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket?.on(Actions.USER_CONNECTED, (data: SocketMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket?.on(Actions.USER_DISCONNECTED, (data: SocketMessage) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [socket]);

  return { usersCount, messages, send };
};
