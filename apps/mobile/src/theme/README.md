# 🎨 Bitriel Mobile Theme System

A comprehensive, standalone theme system that supports both light and dark modes with seamless integration between React Native StyleSheet and NativeWind classes.

## 🚀 Features

- **Complete Theme Support**: Light and dark modes with automatic system detection
- **Semantic Color Tokens**: Meaningful color names that adapt to theme context
- **Dual Implementation**: Support for both StyleSheet and NativeWind approaches
- **Type Safety**: Full TypeScript support with intelligent autocomplete
- **Brand Consistency**: Centralized brand color palette with shade variations
- **Status Colors**: Built-in success, warning, danger, and info color systems
- **Backward Compatibility**: Legacy color system still supported during migration

## 📁 File Structure

```
src/
├── constants/
│   └── Colors.ts              # Main color definitions and theme structure
├── hooks/
│   └── useThemeColor.ts       # Theme color hooks and utilities
├── context/
│   └── ThemeProvider.tsx      # Theme provider and context management
└── theme/
    └── README.md             # This documentation
```

## 🎯 Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from "~/src/context/ThemeProvider";

export default function App() {
    return <ThemeProvider defaultTheme="system">{/* Your app content */}</ThemeProvider>;
}
```

### 2. Use semantic colors in components

```tsx
import { useSemanticColor } from "~/src/hooks/useThemeColor";
import { ThemedText, ThemedView } from "~/components";

function MyComponent() {
    const backgroundColor = useSemanticColor("background.card");
    const textColor = useSemanticColor("text.primary");

    return (
        <ThemedView variant="card">
            <ThemedText variant="primary">Hello Theme!</ThemedText>
        </ThemedView>
    );
}
```

### 3. Use NativeWind classes

```tsx
import { useThemeClasses } from "~/src/context/ThemeProvider";

function MyComponent() {
    const classes = useThemeClasses();

    return (
        <View className={classes.background("card")}>
            <Text className={classes.text("primary")}>Hello NativeWind!</Text>
        </View>
    );
}
```

## 🎨 Color System

### Semantic Color Tokens

Our theme system uses semantic color tokens that automatically adapt to light/dark modes:

#### Text Colors

- `text.primary` - Main text color
- `text.secondary` - Secondary/muted text
- `text.tertiary` - Tertiary/disabled text
- `text.accent` - Accent/branded text
- `text.inverse` - Inverse text (for dark backgrounds)
- `text.link` - Link text color

#### Background Colors

- `background.primary` - Main background
- `background.secondary` - Secondary background
- `background.tertiary` - Tertiary background
- `background.card` - Card backgrounds
- `background.surface` - Surface/elevated backgrounds
- `background.inverse` - Inverse background

#### Border Colors

- `border.primary` - Main border color
- `border.secondary` - Secondary border
- `border.accent` - Accent border
- `border.focus` - Focus state border
- `border.error` - Error state border

#### Interactive States

- `interactive.ripple` - Ripple effect color
- `interactive.hover` - Hover state color
- `interactive.pressed` - Pressed state color
- `interactive.focus` - Focus state color

### Brand Colors

Brand colors are available in multiple shades (50-900):

```tsx
import { useBrandColors } from "~/src/context/ThemeProvider";

function BrandShowcase() {
    const brand = useBrandColors();

    return (
        <View style={{ backgroundColor: brand.primary[500] }}>
            <Text style={{ color: brand.secondary[700] }}>Branded Component</Text>
        </View>
    );
}
```

### Status Colors

Built-in status colors with shade variations:

- `success` - Green tones for success states
- `warning` - Yellow/orange tones for warnings
- `danger` - Red tones for errors
- `info` - Blue tones for information

## 🛠 Implementation Methods

### Method 1: StyleSheet Approach

Use semantic colors with React Native StyleSheet:

```tsx
import { useThemeColors, createThemedStyles } from "~/src/hooks/useThemeColor";

// Option A: Using useThemeColors hook
function ComponentA() {
    const colors = useThemeColors();

    return (
        <View style={{ backgroundColor: colors.background.card }}>
            <Text style={{ color: colors.text.primary }}>Content</Text>
        </View>
    );
}

// Option B: Using createThemedStyles helper
const useStyles = createThemedStyles(theme => ({
    container: {
        backgroundColor: theme.background.card,
        padding: 16,
        borderRadius: 8,
    },
    text: {
        color: theme.text.primary,
        fontSize: 16,
    },
}));

function ComponentB() {
    const styles = useStyles();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Content</Text>
        </View>
    );
}
```

### Method 2: NativeWind Approach

Use theme-aware Tailwind classes:

```tsx
import { useThemeClasses } from "~/src/context/ThemeProvider";

function NativeWindComponent() {
    const classes = useThemeClasses();

    return (
        <View className={`${classes.background("card")} p-4 rounded-lg`}>
            <Text className={`${classes.text("primary")} text-base`}>Content with NativeWind</Text>
        </View>
    );
}

// Or use direct Tailwind classes that auto-adapt
function DirectNativeWind() {
    return (
        <View className="bg-theme-card p-4 rounded-lg">
            <Text className="text-theme-primary text-base">Auto-adapting content</Text>
        </View>
    );
}
```

### Method 3: Enhanced Components

Use the enhanced ThemedText and ThemedView components:

```tsx
import { ThemedText, ThemedView } from "~/components";

function EnhancedComponent() {
    return (
        <ThemedView variant="card" style={{ padding: 16, borderRadius: 8 }}>
            <ThemedText variant="primary" type="title">
                Main Title
            </ThemedText>
            <ThemedText variant="secondary" type="default">
                Secondary content
            </ThemedText>
            <ThemedText variant="accent" type="link">
                Accent link
            </ThemedText>
        </ThemedView>
    );
}
```

## 🎛 Theme Control

### Manual Theme Switching

```tsx
import { useAppTheme } from "~/src/context/ThemeProvider";

function ThemeControls() {
    const { mode, isDark, setTheme, toggleTheme } = useAppTheme();

    return (
        <View>
            <Text>Current theme: {mode}</Text>

            <TouchableOpacity onPress={toggleTheme}>
                <Text>Switch to {isDark ? "Light" : "Dark"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTheme("system")}>
                <Text>Use System Theme</Text>
            </TouchableOpacity>
        </View>
    );
}
```

### System Theme Detection

The theme system automatically detects and responds to system theme changes when set to "system" mode.

## 📱 Tailwind Configuration

The Tailwind configuration includes all theme colors and custom utilities:

```js
// tailwind.config.js
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: { primary: { 50: "...", 500: "#FFAC30", ... } },

        // Status colors
        success: { 500: "#60C754", ... },
        warning: { 500: "#D0B715", ... },
        danger: { 500: "#DB4855", ... },
        info: { 500: "#2E78D6", ... },

        // Semantic colors
        text: { primary: "#11181C", ... },
        background: { primary: "#FFFFFF", ... },
        border: { primary: "#E5E5E7", ... },

        // Dark mode variants
        dark: {
          text: { primary: "#ECEDEE", ... },
          background: { primary: "#030003", ... },
          border: { primary: "#48484A", ... },
        },
      },
    },
  },
  plugins: [
    // Custom theme-aware utilities
  ],
};
```

## 🔄 Migration Guide

### From Legacy Colors

The legacy `Colors` object is still available for backward compatibility:

```tsx
// Old approach (still works)
import Colors from "~/src/constants/Colors";
const backgroundColor = Colors.light.background;

// New approach (recommended)
import { useSemanticColor } from "~/src/hooks/useThemeColor";
const backgroundColor = useSemanticColor("background.primary");
```

### Updating Components

1. **Replace direct color usage**:

    ```tsx
    // Before
    <Text style={{ color: "#11181C" }}>

    // After
    <ThemedText variant="primary">
    ```

2. **Use semantic variants**:

    ```tsx
    // Before
    <View style={{ backgroundColor: Colors.white }}>

    // After
    <ThemedView variant="primary">
    ```

3. **Migrate to NativeWind** (optional):

    ```tsx
    // StyleSheet approach
    <View style={{ backgroundColor: colors.background.card }}>

    // NativeWind approach
    <View className={classes.background("card")}>
    ```

## 🎯 Best Practices

1. **Use semantic tokens** instead of direct color values
2. **Prefer ThemedComponents** for simple cases
3. **Use createThemedStyles** for complex styling
4. **Leverage NativeWind** for utility-first approach
5. **Test both themes** during development
6. **Follow naming conventions** for consistency

## 🔍 Examples

See `components/Examples/ThemeShowcase.tsx` for a comprehensive demonstration of all theme features.

## 🤝 Contributing

When adding new colors or features:

1. Add semantic tokens to the theme structure
2. Update Tailwind configuration
3. Add TypeScript types
4. Update this documentation
5. Add examples to the showcase component

---

**Happy theming!** 🎨✨
