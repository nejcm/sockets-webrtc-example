import React, { createContext, useContext, useEffect, useState } from 'react';
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
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    const client = socketIOClient(ENDPOINT);
    setSocket(client);
    return () => {
      console.log('Disconnecting client...');
      client?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
