import { useCallback, useEffect, useState } from 'react';
import { Actions } from '../socket/actions';
import { SocketMessage, useSocket } from '../socket/useSocket';
import { User } from '../user/useUser';

export interface Message {
  from?: User;
  message: string;
}

export interface UseUserResponse {
  usersCount: number;
  messages: Message[];
  send: (message: string, user: User) => void;
}

export const useMessages = (): UseUserResponse => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [usersCount] = useState<number>(1);

  const send = useCallback(
    (message: string, user: User): void => {
      socket?.emit(Actions.SEND_MESSAGE, message);
      setMessages((prev) => [
        ...prev,
        {
          from: user,
          message,
        },
      ]);
    },
    [socket],
  );

  useEffect(() => {
    socket?.on(Actions.NEW_MESSAGE, ({ user, message }: SocketMessage) => {
      const msg = { from: user, message };
      setMessages((prev) => [...prev, msg]);
    });

    socket?.on(Actions.USER_CONNECTED, ({ message }: SocketMessage) => {
      const msg = { message };
      setMessages((prev) => [...prev, msg]);
    });

    socket?.on(Actions.USER_DISCONNECTED, ({ message }: SocketMessage) => {
      const msg = { message };
      setMessages((prev) => [...prev, msg]);
    });
  }, [socket]);

  return { usersCount, messages, send };
};
