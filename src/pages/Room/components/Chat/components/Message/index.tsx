import { Box, Text } from '@chakra-ui/core';
import React from 'react';
import theme from '../../../../../../config/theme';
import { Message } from '../../../../../../services/messages/useMessages';
import { Bubble, MessageType } from './styles';

interface MessageProps {
  message: Message;
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
      <Bubble className={getMessageClass(currentUserId, message.from?.id)}>
        <div>{message.message}</div>
        {message.from ? (
          <Text as="div" fontSize="xs" color={theme.colors.gray['400']}>
            {message.from.name}
          </Text>
        ) : null}
      </Bubble>
    </Box>
  );
};
export default MessageComponent;
