// theme.js
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const darkTheme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "rgb(220, 184, 255)",
    onPrimary: "rgb(71, 12, 122)",
    primaryContainer: "rgb(95, 43, 146)",
    onPrimaryContainer: "rgb(240, 219, 255)",
    secondary: "rgb(208, 193, 218)",
    onSecondary: "rgb(54, 44, 63)",
    secondaryContainer: "rgb(77, 67, 87)",
    onSecondaryContainer: "rgb(237, 221, 246)",
    tertiary: "rgb(243, 183, 190)",
    onTertiary: "rgb(75, 37, 43)",
    tertiaryContainer: "rgb(101, 58, 65)",
    onTertiaryContainer: "rgb(255, 217, 221)",
    background: "rgb(29, 27, 30)",
    onBackground: "rgb(231, 225, 229)",
    surface: "rgb(29, 27, 30)",
    onSurface: "rgb(231, 225, 229)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    outline: "rgb(150, 142, 152)",
  },
};

const lightTheme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: "rgb(120, 69, 172)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(240, 219, 255)",
    onPrimaryContainer: "rgb(44, 0, 81)",
    secondary: "rgb(102, 90, 111)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(237, 221, 246)",
    onSecondaryContainer: "rgb(33, 24, 42)",
    tertiary: "rgb(128, 81, 88)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 217, 221)",
    onTertiaryContainer: "rgb(50, 16, 23)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(29, 27, 30)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(29, 27, 30)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    outline: "rgb(124, 117, 126)",
  },
};

export { darkTheme, lightTheme };
