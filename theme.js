// theme.js
import { MD3DarkTheme } from 'react-native-paper';

const theme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: 'orange',
    secondary: '#f1c40f',
    tertiary: '#a1b2c3',
  },
};

export default theme;
