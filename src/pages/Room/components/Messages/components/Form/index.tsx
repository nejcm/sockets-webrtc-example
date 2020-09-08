import { Box, Button, FormControl, Stack, Textarea } from '@chakra-ui/core';
import React from 'react';

interface FormProps {
  onSubmit: React.FormEventHandler;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  return (
    <Box width="100%" py={2}>
      <form onSubmit={onSubmit}>
        <Stack spacing={3}>
          <FormControl as="fieldset">
            <Textarea
              id="message"
              name="message"
              placeholder="Message"
              maxLength={500}
              isRequired={true}
            />
          </FormControl>
          <Button variantColor="brand" px={3} type="submit">
            Send
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
export default Form;
