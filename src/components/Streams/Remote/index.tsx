import { AspectRatioBox, Box, BoxProps } from '@chakra-ui/core';
import React, { useEffect, useRef } from 'react';
import theme from '../../../config/theme';
import { RemoteStream } from '../../../services/video/useVideo';
import { Video } from './styles';

interface RemoteStreamsProps extends BoxProps {
  remoteStreams: RemoteStream[];
}

const RemoteStreams: React.FC<RemoteStreamsProps> = ({
  remoteStreams,
  ...rest
}) => {
  const refsArray = useRef([]);

  useEffect(() => {
    remoteStreams.map(
      (streamData) =>
        (refsArray.current[streamData.id].srcObject = streamData.stream),
    );
  }, [remoteStreams]);

  return (
    <Box {...rest}>
      {remoteStreams.map((dataStream) => (
        <AspectRatioBox
          key={dataStream.id}
          ratio={16 / 9}
          backgroundColor={theme.colors.gray['100']}
        >
          <Box>
            <Video
              onContextMenu={(ev) => ev.preventDefault()}
              ref={(ref) => (refsArray.current[dataStream.id] = ref)}
              autoPlay
              playsInline
            />
          </Box>
        </AspectRatioBox>
      ))}
    </Box>
  );
};

export default RemoteStreams;
