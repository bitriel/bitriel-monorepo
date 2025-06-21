# 🎨 Theme Toggle Components Guide

This guide shows you how to use the theme toggle components in your Expo mobile app.

## 🚀 Quick Start

### 1. Simple Toggle Switch

For a basic theme toggle anywhere in your app:

```tsx
import { ThemeToggle } from "~/components/ThemeToggle";

function MyComponent() {
    return (
        <View>
            <ThemeToggle size="medium" showLabel={true} />
        </View>
    );
}
```

### 2. Settings Page Integration

For a complete theme settings experience:

```tsx
import { ThemeSettings } from "~/components/ThemeSettings";

function SettingsScreen() {
    return (
        <ScrollView>
            <ThemeSettings />
        </ScrollView>
    );
}
```

## 📱 Components Available

### ThemeToggle

A beautiful animated toggle switch for quick theme switching.

**Props:**

- `size`: "small" | "medium" | "large" (default: "medium")
- `showLabel`: boolean (default: true) - Shows current theme name
- `style`: ViewStyle - Custom container styles
- `labelStyle`: TextStyle - Custom label styles

**Usage Examples:**

```tsx
// Header toggle (no label)
<ThemeToggle size="small" showLabel={false} />

// Settings row toggle
<ThemeToggle size="medium" showLabel={true} />

// Prominent feature toggle
<ThemeToggle size="large" showLabel={true} />
```

### ThemeSettings

A comprehensive theme settings component with multiple options.

**Features:**

- Quick toggle switch
- Theme option selection (Light/Dark/System)
- Live preview of theme changes
- Animated transitions

**Usage:**

```tsx
import { ThemeSettings } from "~/components/ThemeSettings";

function AppearanceSettings() {
    return <ThemeSettings />;
}
```

## 🎯 Integration Examples

### 1. Navigation Header

```tsx
import { ThemeToggle } from "~/components/ThemeToggle";

function HeaderRight() {
    return (
        <View style={{ paddingRight: 16 }}>
            <ThemeToggle size="small" showLabel={false} />
        </View>
    );
}
```

### 2. Settings List Item

```tsx
import { ThemeToggle } from "~/components/ThemeToggle";
import { ThemedView, ThemedText } from "~/components";

function SettingsItem() {
    return (
        <ThemedView variant="card" style={styles.settingsRow}>
            <View style={styles.settingsInfo}>
                <ThemedText variant="primary">Dark Mode</ThemedText>
                <ThemedText variant="secondary">Switch themes</ThemedText>
            </View>
            <ThemeToggle size="medium" showLabel={false} />
        </ThemedView>
    );
}
```

### 3. Floating Action Button

```tsx
import { ThemeToggle } from "~/components/ThemeToggle";
import { useAppTheme } from "~/src/context/ThemeProvider";

function FloatingThemeButton() {
    const { isDark, toggleTheme } = useAppTheme();

    return (
        <TouchableOpacity
            style={[styles.fab, { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" }]}
            onPress={toggleTheme}
        >
            <Ionicons name={isDark ? "sunny" : "moon"} size={24} color={isDark ? "#FFD700" : "#FF6B35"} />
        </TouchableOpacity>
    );
}
```

### 4. Profile Screen

```tsx
import { ThemeToggle } from "~/components/ThemeToggle";
import { useAppTheme } from "~/src/context/ThemeProvider";

function ProfileScreen() {
    const { mode, isDark } = useAppTheme();

    return (
        <ScrollView>
            {/* Profile info */}

            <ThemedView variant="card" style={styles.preferenceCard}>
                <ThemedText variant="primary">Appearance</ThemedText>
                <ThemedText variant="secondary">Currently using {isDark ? "dark" : "light"} theme</ThemedText>
                <ThemeToggle size="large" showLabel={true} />
            </ThemedView>
        </ScrollView>
    );
}
```

## 🎛 Advanced Usage

### Custom Theme Control

If you need more control over theme switching:

```tsx
import { useAppTheme } from "~/src/context/ThemeProvider";

function CustomThemeControl() {
    const { mode, isDark, setTheme, toggleTheme } = useAppTheme();

    return (
        <View>
            <Text>Current: {mode}</Text>

            <TouchableOpacity onPress={() => setTheme("light")}>
                <Text>Light Theme</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTheme("dark")}>
                <Text>Dark Theme</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTheme("system")}>
                <Text>System Theme</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleTheme}>
                <Text>Toggle Theme</Text>
            </TouchableOpacity>
        </View>
    );
}
```

### Theme-Aware Styling

```tsx
import { useThemeColors, createThemedStyles } from "~/src/hooks/useThemeColor";

const useStyles = createThemedStyles(theme => ({
    toggleContainer: {
        backgroundColor: theme.background.card,
        borderColor: theme.border.primary,
        padding: 16,
        borderRadius: 12,
    },
    toggleLabel: {
        color: theme.text.primary,
        fontSize: 16,
    },
}));

function ThemedToggleContainer() {
    const styles = useStyles();

    return (
        <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Theme Settings</Text>
            <ThemeToggle size="medium" showLabel={true} />
        </View>
    );
}
```

## 🎨 Styling Options

### Custom Toggle Styles

```tsx
<ThemeToggle
    size="medium"
    showLabel={true}
    style={{
        marginVertical: 8,
        paddingHorizontal: 16,
    }}
    labelStyle={{
        fontSize: 16,
        fontFamily: "SpaceGroteskBold",
        color: "#FFAC30",
    }}
/>
```

### Theme-Aware Containers

```tsx
// Using semantic variants
<ThemedView variant="card">
    <ThemeToggle size="large" />
</ThemedView>;

// Using direct theme colors
const colors = useThemeColors();
<View style={{ backgroundColor: colors.background.surface }}>
    <ThemeToggle size="medium" />
</View>;
```

## ✨ Features

- **Smooth Animations**: Spring-based animations for natural feel
- **Multiple Sizes**: Small, medium, and large variants
- **Auto Icons**: Sun/moon icons that change with theme
- **System Detection**: Automatically follows system preferences
- **Accessibility**: Proper touch targets and feedback
- **Type Safety**: Full TypeScript support

## 🎯 Best Practices

1. **Use appropriate sizes**: Small for headers, medium for lists, large for featured controls
2. **Hide labels when space is limited**: Use `showLabel={false}` in tight spaces
3. **Provide context**: Add explanatory text near toggle switches
4. **Test both themes**: Always verify your UI works in both light and dark modes
5. **Use system theme**: Default to system preference for better user experience

---

**Happy theming!** 🌙☀️
