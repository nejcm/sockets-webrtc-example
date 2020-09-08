import { ITheme, theme } from '@chakra-ui/core';

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      900: '#002329',
      800: '#00474f',
      700: '#006d75',
      600: '#08979c',
      500: '#13c2c2',
      400: '#36cfc9',
      300: '#5cdbd3',
      200: '#87e8de',
      100: '#b5f5ec',
      50: '#e6fffb',
    },
  },
};

export default customTheme as ITheme;
