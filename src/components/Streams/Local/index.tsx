import { AspectRatioBox, Box, BoxProps } from '@chakra-ui/core';
import React, { useEffect } from 'react';
import theme from '../../../config/theme';
import useStream from '../../../services/video/useStream';
import { Name, Overlay, Video } from './styles';

interface LocalStreamProps extends BoxProps {
  userMedia: MediaStream | undefined;
  name: string;
}

const LocalStream: React.FC<LocalStreamProps> = ({
  userMedia,
  name,
  ...rest
}) => {
  const { setStream, videoRef, play } = useStream();

  useEffect(() => {
    if (userMedia) setStream(userMedia);
  }, [userMedia, setStream]);

  return (
    <Box {...rest}>
      <AspectRatioBox ratio={16 / 9} backgroundColor={theme.colors.gray['100']}>
        <Box>
          <Video
            onContextMenu={(ev) => ev.preventDefault()}
            ref={videoRef}
            onCanPlay={play}
            autoPlay
            playsInline
            muted
          />
          <Overlay>
            <Name>{name}</Name>
          </Overlay>
        </Box>
      </AspectRatioBox>
    </Box>
  );
};

export default LocalStream;
