import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import socketIOClient from 'socket.io-client';
import { settings } from '../../config';
const ENDPOINT = `${settings.host}:${settings.port}`;

export interface ContextValue {
  socket: SocketIOClient.Socket | undefined;
}

export const SocketContext = createContext({} as ContextValue);

const useSocket = (): ContextValue => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error(`useSocket must be used within a SocketProvider`);
  return context;
};

export interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | undefined>();

  useEffect(() => {
    const client = socketIOClient(ENDPOINT);
    setSocket(client);
    return () => {
      client.disconnect();
    };
  }, []);

  const value = useMemo(() => ({ socket }), [socket]);
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
