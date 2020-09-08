import { Box, Flex } from '@chakra-ui/core';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { SocketProvider, useSocket } from '../../services/socket/useSocket';
import { useUser } from '../../services/user/useUser';
import Chat from './components/Chat';
import Video from './components/Streams';

const Room: React.FC = () => {
  const { socket } = useSocket();
  const { user } = useUser();

  useEffect(() => {
    socket?.emit('new-user', user);
  }, [user, socket]);

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

const RoomProvider: React.FC = () => (
  <SocketProvider>
    <Room />
  </SocketProvider>
);
export default RoomProvider;
