import { StatusBar, Platform } from "react-native";

// Cache to prevent unnecessary status bar updates
let lastStatusBarState = {
    backgroundColor: "",
    barStyle: "",
    hidden: false,
    translucent: false,
};

export interface StatusBarState {
    backgroundColor: string;
    barStyle: "default" | "light-content" | "dark-content";
    hidden?: boolean;
    translucent?: boolean;
}

// Optimized status bar update function
export const updateStatusBar = (newState: StatusBarState, animated: boolean = true): boolean => {
    // Check if update is actually needed
    const needsUpdate =
        lastStatusBarState.backgroundColor !== newState.backgroundColor ||
        lastStatusBarState.barStyle !== newState.barStyle ||
        lastStatusBarState.hidden !== (newState.hidden || false) ||
        lastStatusBarState.translucent !== (newState.translucent || false);

    if (!needsUpdate) {
        return false; // No update needed
    }

    // Update cache
    lastStatusBarState = {
        backgroundColor: newState.backgroundColor,
        barStyle: newState.barStyle,
        hidden: newState.hidden || false,
        translucent: newState.translucent || false,
    };

    // Apply updates efficiently
    const applyUpdates = () => {
        StatusBar.setBarStyle(newState.barStyle, animated);

        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(newState.backgroundColor, animated);
            if (newState.translucent !== undefined) {
                StatusBar.setTranslucent(newState.translucent);
            }
        }

        if (newState.hidden !== undefined) {
            StatusBar.setHidden(newState.hidden, animated ? "slide" : "none");
        }
    };

    // Use requestAnimationFrame for smooth updates
    if (animated && Platform.OS === "android") {
        requestAnimationFrame(applyUpdates);
    } else {
        applyUpdates();
    }

    return true; // Update was applied
};

// Reset cache (useful for development)
export const resetStatusBarCache = () => {
    lastStatusBarState = {
        backgroundColor: "",
        barStyle: "",
        hidden: false,
        translucent: false,
    };
};
