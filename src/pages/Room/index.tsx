import { Box, Flex } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { settings } from '../../config';
import { useUser } from '../../services/user/useUser';
import Messages from './components/Messages';
import Video from './components/Video';
const ENDPOINT = `${settings.host}:${settings.port}`;

interface RoomProps {}

const Room: React.FC<RoomProps> = () => {
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
            <Messages socket={socket} user={user!} />
          </Flex>
        </Box>
      ) : (
        <>Socket loading or not initialized.</>
      )}
    </>
  );
};

export default Room;
