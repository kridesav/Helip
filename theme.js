// theme.js
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const darkTheme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: 'orange',
    secondary: '#f1c40f',
    tertiary: '#a1b2c3',
    danger: '#FFC5CB'
  },
};

const lightTheme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'orange',
    secondary: '#f1c40f',
    tertiary: '#a1b2c3',
    danger: '#FFC5CB'
  },
};

export { darkTheme, lightTheme };
