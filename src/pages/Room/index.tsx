import { Box, Flex } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { settings } from '../../config';
import { useUser } from '../../services/user/useUser';
import Chat from './components/Chat';
import Video from './components/Streams';
const ENDPOINT = `${settings.host}:${settings.port}`;

const Room: React.FC = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const { user } = useUser();

  // TODO: Put this into socket provider (react context)
  useEffect(() => {
    const client = socketIOClient(ENDPOINT);
    setSocket(client);
    client.emit('new-user', user);
    return () => {
      console.log('Disconnecting client...');
      client.disconnect();
    };
  }, [user]);

  return (
    <>
      {user && user.id ? null : <Redirect to="/" />}
      {socket ? (
        <Box m="auto" width="100%" minHeight="100vh">
          <Flex direction="row" width="100%">
            <Video socket={socket} user={user!} pr="300px" />
            <Chat socket={socket} user={user!} />
          </Flex>
        </Box>
      ) : (
        <>Socket loading or not initialized.</>
      )}
    </>
  );
};

export default Room;
