import { useCallback, useEffect, useState } from 'react';
import { User } from '../user/useUser';

export interface Message {
  user?: User;
  message: string;
  [key: string]: unknown;
}

export interface useUserResponse {
  usersCount: number;
  messages: Message[];
  send: (message: string, user: User) => void;
}

export const useMessages = (
  socket: SocketIOClient.Socket | undefined,
): useUserResponse => {
  const [messages, setMessages] = useState<Message[]>([]);
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
    socket?.on('new-message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socket?.on('user-connected', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socket?.on('user-disconnected', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [socket]);

  return { usersCount, messages, send };
};
