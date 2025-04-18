import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        background: "transparent",
        text: "#000000",
        primary: "#4CAF50",
        onPrimary: "#FFFFFF",
        placeholder: "#000000",
    },
}

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        background: "transparent",
        text: "#ffffff",
        primary: "#1E88E5",
        onPrimary: "#FFFFFF",
        placeholder: "#000000",
    },
}
