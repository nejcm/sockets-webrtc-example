import { Box, Flex } from '@chakra-ui/core';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Actions } from '../../services/socket/actions';
import { SocketProvider, useSocket } from '../../services/socket/useSocket';
import { useUser } from '../../services/user/useUser';
import Chat from './components/Chat';
import Video from './components/Streams';

const Room: React.FC = () => {
  const { socket } = useSocket();
  const { user } = useUser();

  useEffect(() => {
    socket?.emit(Actions.NEW_USER, user);
  }, [user, socket]);

  if (!user || !user.id) {
    return <Redirect to="/" />;
  }
  return (
    <>
      {socket ? (
        <Box m="auto" width="100%" minHeight="100vh">
          <Flex direction="row" width="100%">
            <Video user={user} pr="300px" />
            <Chat user={user} />
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
