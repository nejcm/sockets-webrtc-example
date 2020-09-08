import styled from '@emotion/styled';
import theme from '../../../../../../config/theme';

export enum MessageType {
  SYSTEM = 'system',
  ME = 'me',
  OTHER = 'other',
}

export const Bubble = styled.div`
  > div:first-of-type {
    padding: 0.5rem;
    white-space: pre-line;
    border-radius: 3px;
  }

  &.${MessageType.ME} {
    color: ${theme.colors.gray['900']};
    text-align: right;
    > div:first-of-type {
      background-color: ${theme.colors.gray['100']};
    }
  }
  &.${MessageType.OTHER} {
    color: #fff;
    > div:first-of-type {
      background-color: ${theme.colors.cyan['600']};
    }
  }
  &.${MessageType.SYSTEM} {
    > div:first-of-type {
      font-size: 0.8rem;
      padding: 0;
    }
  }
`;
