import { AspectRatioBox, Box, BoxProps } from '@chakra-ui/core';
import React from 'react';
import theme from '../../../../config/theme';
import { User } from '../../../../services/user/useUser';
import { Wrapper } from './styles';

interface VideoProps extends BoxProps {
  user: User;
  socket: SocketIOClient.Socket;
}

const Video: React.FC<VideoProps> = ({ user, socket, ...rest }) => {
  return (
    <Box width="100%" alignSelf="center" px={3} {...rest}>
      <Wrapper>
        <Box p={3}>
          <AspectRatioBox
            ratio={16 / 9}
            backgroundColor={theme.colors.gray['100']}
          >
            <span>{user.id}</span>
          </AspectRatioBox>
        </Box>
        <Box p={3}>
          <AspectRatioBox
            ratio={16 / 9}
            backgroundColor={theme.colors.gray['100']}
          >
            <span>Guest</span>
          </AspectRatioBox>
        </Box>
      </Wrapper>
    </Box>
  );
};
export default Video;
