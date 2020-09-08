import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/core';
import React from 'react';

export interface RoomLoginProps {
  onSubmit: React.FormEventHandler;
}

const LoginForm: React.FC<RoomLoginProps> = ({ onSubmit }) => {
  return (
    <Box
      width="100%"
      p={6}
      mb={16}
      maxW="sm"
      borderWidth="1px"
      rounded="md"
      overflow="hidden"
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={6}>
          <Heading mt={6} as="h2" textAlign="center">
            Chat
          </Heading>
          <FormControl as="fieldset">
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              minLength={2}
              maxLength={25}
              isRequired={true}
            />
          </FormControl>
          <Button variantColor="brand" px={3} type="submit">
            Join
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginForm;
