import { Box, Text } from '@chakra-ui/core';
import React from 'react';
import theme from '../../../../../../config/theme';
import { SocketMessage } from '../../../../../../services/socket/useSocket';
import { Bubble, MessageType } from './styles';

interface MessageProps {
  message: SocketMessage;
  i: number;
  currentUserId: string;
}

const getMessageClass = (id: string, mId: string | undefined): string => {
  if (!mId) return MessageType.SYSTEM;
  if (id === mId) return MessageType.ME;
  return MessageType.OTHER;
};

const MessageComponent: React.FC<MessageProps> = ({
  currentUserId,
  i,
  message,
}) => {
  return (
    <Box key={i} mb={2}>
      <Bubble className={getMessageClass(currentUserId, message.user?.id)}>
        <div>{message.message}</div>
        {message.user ? (
          <Text as="div" fontSize="xs" color={theme.colors.gray['400']}>
            {message.user.name}
          </Text>
        ) : null}
      </Bubble>
    </Box>
  );
};
export default MessageComponent;
