import { Box, BoxProps, useToast } from '@chakra-ui/core';
import React, { useEffect } from 'react';
import LocalStream from '../../../../components/Streams/Local';
import RemoteStreams from '../../../../components/Streams/Remote';
import { User } from '../../../../services/user/useUser';
import useUserMedia from '../../../../services/video/useUserMedia';
import useVideo from '../../../../services/video/useVideo';
import { Wrapper } from './styles';

interface VideoProps extends BoxProps {
  user: User;
}

const Video: React.FC<VideoProps> = ({ user, ...rest }) => {
  const localStream = useUserMedia();
  const { remoteStreams, error } = useVideo({
    currentUserId: user.id,
    localStream,
  });
  const toast = useToast();
  useEffect(() => {
    if (error) {
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

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
