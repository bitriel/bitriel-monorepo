# Dynamic Status Bar System

This enhanced status bar system provides global dynamic color content status bar management for the Bitriel mobile app with automatic theme detection and smooth transitions.

## Features

- 🎨 **Theme-Aware**: Automatically adapts to light/dark mode
- 🔄 **Dynamic Updates**: Smooth transitions between different status bar styles
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🎯 **Screen-Specific**: Easy per-screen customization
- 🚀 **Performance Optimized**: Efficient re-renders and state management
- 🔧 **Developer Friendly**: Simple hooks and components

## Quick Start

### 1. Basic Usage with Hooks

```tsx
import { useGlobalStatusBar } from "~/src/context/StatusBarProvider";

function MyScreen() {
    const { setDefault, setPrimary, setGradient, setTransparent } = useGlobalStatusBar();

    useEffect(() => {
        // Set status bar style when screen loads
        setDefault(); // or setPrimary(), setGradient(), setTransparent()
    }, [setDefault]);

    return <View>{/* Your screen content */}</View>;
}
```

### 2. Using Status Bar Components

```tsx
import {
    DynamicStatusBar,
    DefaultStatusBar,
    PrimaryStatusBar,
    GradientStatusBar,
    TransparentStatusBar,
} from "~/components/StatusBar/DynamicStatusBar";

// Option 1: Wrapper components
function MyScreen() {
    return (
        <DefaultStatusBar>
            <View>{/* Your content */}</View>
        </DefaultStatusBar>
    );
}

// Option 2: Custom configuration
function MyScreen() {
    return (
        <DynamicStatusBar style="custom" backgroundColor="#FF6B6B" barStyle="light-content">
            <View>{/* Your content */}</View>
        </DynamicStatusBar>
    );
}
```

### 3. Higher-Order Component

```tsx
import { withDynamicStatusBar } from "~/components/StatusBar/DynamicStatusBar";

const MyScreen = () => <View>{/* Your content */}</View>;

export default withDynamicStatusBar(MyScreen, { style: "primary" });
```

## Available Styles

### Preset Styles

| Style         | Description                      | Use Case                           |
| ------------- | -------------------------------- | ---------------------------------- |
| `default`     | Theme-aware (light/dark)         | Most screens, follows system theme |
| `primary`     | Orange background with dark text | Branding screens, onboarding       |
| `gradient`    | Blue gradient with light text    | Profile, special sections          |
| `transparent` | Transparent with light text      | Image backgrounds, media           |

### Custom Style

```tsx
const { setCustom } = useGlobalStatusBar();

// Custom color and content style
setCustom("#FF6B6B", "light-content");
```

## Complete Example

```tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useGlobalStatusBar } from "~/src/context/StatusBarProvider";

export default function ExampleScreen() {
    const { setDefault, setPrimary, setGradient, setTransparent, setCustom, currentStyle, isDark } =
        useGlobalStatusBar();

    const [screenMode, setScreenMode] = useState<"default" | "primary" | "gradient" | "transparent" | "custom">(
        "default"
    );

    // Set initial status bar
    useEffect(() => {
        setDefault();
    }, [setDefault]);

    const handleStyleChange = (style: typeof screenMode) => {
        setScreenMode(style);

        switch (style) {
            case "default":
                setDefault();
                break;
            case "primary":
                setPrimary();
                break;
            case "gradient":
                setGradient();
                break;
            case "transparent":
                setTransparent();
                break;
            case "custom":
                setCustom("#FF6B6B", "light-content");
                break;
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#000" : "#fff" }}>
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginVertical: 20,
                    color: isDark ? "#fff" : "#000",
                }}
            >
                Status Bar Demo
            </Text>

            <Text
                style={{
                    textAlign: "center",
                    marginBottom: 20,
                    color: isDark ? "#ccc" : "#666",
                }}
            >
                Current Style: {currentStyle} | Theme: {isDark ? "Dark" : "Light"}
            </Text>

            {["default", "primary", "gradient", "transparent", "custom"].map(style => (
                <TouchableOpacity
                    key={style}
                    onPress={() => handleStyleChange(style as typeof screenMode)}
                    style={{
                        backgroundColor: screenMode === style ? "#FFAC30" : isDark ? "#333" : "#f0f0f0",
                        padding: 15,
                        margin: 10,
                        borderRadius: 10,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: screenMode === style ? "#000" : isDark ? "#fff" : "#000",
                            fontWeight: screenMode === style ? "bold" : "normal",
                            textTransform: "capitalize",
                        }}
                    >
                        {style} Style
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}
```

## Screen-Specific Examples

### Welcome Screen (Dark Background)

```tsx
useEffect(() => {
    setCustom("#1a1a1a", "light-content");
}, [setCustom]);
```

### Profile Screen (Gradient)

```tsx
useEffect(() => {
    setGradient();
}, [setGradient]);
```

### Settings Screen (Default)

```tsx
useEffect(() => {
    setDefault();
}, [setDefault]);
```

### Media/Camera Screen (Transparent)

```tsx
useEffect(() => {
    setTransparent();
}, [setTransparent]);
```

## Configuration

### Colors Configuration

Edit `~/src/constants/Color.ts` to customize status bar colors:

```tsx
export const StatusBarPresets = {
    default: (isDark: boolean) => ({
        backgroundColor: isDark ? "#030003" : "#FFFFFF",
        barStyle: isDark ? "light-content" : "dark-content",
    }),
    primary: {
        backgroundColor: "#FFAC30", // Your brand color
        barStyle: "dark-content",
    },
    gradient: {
        backgroundColor: "#667eea", // Your gradient color
        barStyle: "light-content",
    },
    transparent: {
        backgroundColor: "transparent",
        barStyle: "light-content",
    },
};
```

## Advanced Usage

### With Navigation Focus

```tsx
import { useFocusEffect } from "@react-navigation/native";

function MyScreen() {
    const { setPrimary } = useGlobalStatusBar();

    useFocusEffect(
        useCallback(() => {
            setPrimary();
        }, [setPrimary])
    );

    return <View>{/* content */}</View>;
}
```

### Conditional Status Bar

```tsx
function MyScreen() {
    const { setDefault, setPrimary } = useGlobalStatusBar();
    const [isSpecialMode, setIsSpecialMode] = useState(false);

    useEffect(() => {
        if (isSpecialMode) {
            setPrimary();
        } else {
            setDefault();
        }
    }, [isSpecialMode, setPrimary, setDefault]);

    return <View>{/* content */}</View>;
}
```

## Migration Guide

### From Old Manual StatusBar

**Before:**

```tsx
import { StatusBar } from "react-native";

function MyScreen() {
    return (
        <View>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            {/* content */}
        </View>
    );
}
```

**After:**

```tsx
import { useGlobalStatusBar } from "~/src/context/StatusBarProvider";

function MyScreen() {
    const { setDefault } = useGlobalStatusBar();

    useEffect(() => {
        setDefault();
    }, [setDefault]);

    return <View>{/* content - no manual StatusBar needed */}</View>;
}
```

## Best Practices

1. **Set status bar in useEffect**: Always set status bar style in useEffect to ensure it applies when the screen loads.

2. **Use preset styles**: Prefer preset styles (`default`, `primary`, `gradient`, `transparent`) over custom ones for consistency.

3. **Theme-aware defaults**: Use `default` style for most screens to automatically adapt to light/dark mode.

4. **Consistent transitions**: The system handles smooth transitions automatically - avoid manual StatusBar calls.

5. **Screen-specific styles**: Choose styles that match your screen's visual design:
    - Light backgrounds → `default` or `primary`
    - Dark/gradient backgrounds → `gradient` or `transparent`
    - Brand screens → `primary`

## Troubleshooting

### Status bar not changing

- Ensure you're calling the hook inside the StatusBarProvider
- Check that you're setting the style in useEffect
- Verify the import path is correct

### Flickering between screens

- Use the same style for similar screens
- Consider using useFocusEffect for navigation-based changes

### Android-specific issues

- Make sure you're not manually setting StatusBar elsewhere
- Check that translucent is set correctly for transparent styles
