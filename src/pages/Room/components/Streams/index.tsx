import { Box, BoxProps } from '@chakra-ui/core';
import React from 'react';
import LocalStream from '../../../../components/Streams/Local';
import RemoteStreams from '../../../../components/Streams/Remote';
import { User } from '../../../../services/user/useUser';
import useUserMedia from '../../../../services/video/useUserMedia';
import useVideo from '../../../../services/video/useVideo';
import { Wrapper } from './styles';

interface VideoProps extends BoxProps {
  user: User;
  socket: SocketIOClient.Socket;
}

const Video: React.FC<VideoProps> = ({ user, socket, ...rest }) => {
  const localStream = useUserMedia();
  const { remoteStreams } = useVideo({
    currentUserId: user.id,
    localStream,
    socket,
  });

  return (
    <Box width="100%" alignSelf="center" px={3} {...rest}>
      <Wrapper>
        <Box p={3}>
          <LocalStream userMedia={localStream} name={user.name} />
        </Box>
        <Box p={3}>
          <RemoteStreams remoteStreams={remoteStreams} />
        </Box>
      </Wrapper>
    </Box>
  );
};
export default Video;
