import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Platform, AppState } from "react-native";
import { useColorScheme } from "react-native";
import { useRouter, useSegments, usePathname } from "expo-router";
import { StatusBarConfig, StatusBarStyle } from "../hooks/useStatusBar";
import Colors, { StatusBarPresets } from "../constants/Colors";
import { updateStatusBar, type StatusBarState } from "../utils/statusBarUtils";

interface NavigationStatusBarContextType {
    currentStyle: StatusBarStyle;
    currentRoute: string;
    setStatusBarForRoute: (route: string, style: StatusBarStyle, config?: Partial<StatusBarConfig>) => void;
    setTemporaryStatusBar: (style: StatusBarStyle, config?: Partial<StatusBarConfig>) => void;
    clearTemporaryStatusBar: () => void;
    isDark: boolean;
    isTransitioning: boolean;
}

interface RouteStatusBarConfig {
    style: StatusBarStyle;
    config?: Partial<StatusBarConfig>;
}

// Default status bar configurations for different routes
const DEFAULT_ROUTE_CONFIGS: Record<string, RouteStatusBarConfig> = {
    // Public routes
    "/welcome": { style: "custom", config: { backgroundColor: "#1a1a1a", barStyle: "light-content" } },
    "/auth-method": { style: "default" },
    "/passcode": { style: "default" },
    "/mnemonic": { style: "default" },

    // Auth routes - main tabs
    "/(auth)/home/(tabs)/wallet": { style: "default" },
    "/(auth)/home/(tabs)/services": { style: "default" },
    "/(auth)/home/(tabs)/rewards": { style: "default" },
    "/(auth)/home/(tabs)/profile": { style: "default" },

    // Service routes
    "/(auth)/home/services/stadiumx": { style: "primary" },
    "/(auth)/home/services/marketplace": { style: "primary" },
    "/(auth)/home/services/defi": { style: "primary" },

    // Settings and profile routes
    "/(auth)/home/settings": { style: "default" },
    "/(auth)/home/profile": { style: "default" },

    // Scanner and camera routes
    "/(auth)/home/qrScanner": { style: "transparent" },

    // Transaction routes
    "/(auth)/home/send": { style: "default" },
    "/(auth)/home/receive": { style: "default" },
    "/(auth)/home/success": { style: "primary" },
};

const NavigationStatusBarContext = createContext<NavigationStatusBarContextType | undefined>(undefined);

interface NavigationStatusBarProviderProps {
    children: React.ReactNode;
    defaultStyle?: StatusBarStyle;
}

export const NavigationStatusBarProvider: React.FC<NavigationStatusBarProviderProps> = ({
    children,
    defaultStyle = "default",
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const pathname = usePathname();
    const segments = useSegments();

    const [currentStyle, setCurrentStyle] = useState<StatusBarStyle>(defaultStyle);
    const [currentRoute, setCurrentRoute] = useState<string>(pathname);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [routeConfigs, setRouteConfigs] = useState<Record<string, RouteStatusBarConfig>>(DEFAULT_ROUTE_CONFIGS);
    const [temporaryConfig, setTemporaryConfig] = useState<{
        style: StatusBarStyle;
        config?: Partial<StatusBarConfig>;
    } | null>(null);

    // Memoize preset configurations for performance
    const presetConfigs = useMemo(
        () => ({
            default: StatusBarPresets.default(isDark),
            primary: StatusBarPresets.primary,
            transparent: StatusBarPresets.transparent,
        }),
        [isDark]
    );

    // Apply status bar configuration with optimized performance
    const applyStatusBarConfig = useCallback(
        (style: StatusBarStyle, config: Partial<StatusBarConfig> = {}) => {
            setIsTransitioning(true);

            let finalBackgroundColor: string;
            let finalBarStyle: "default" | "light-content" | "dark-content";

            // Use memoized presets for better performance
            if (config.backgroundColor && config.barStyle) {
                finalBackgroundColor = config.backgroundColor;
                finalBarStyle = config.barStyle;
            } else {
                const preset = presetConfigs[style as keyof typeof presetConfigs] || presetConfigs.default;
                finalBackgroundColor = preset.backgroundColor;
                finalBarStyle = preset.barStyle;
            }

            // Use optimized status bar utility for better performance
            const animated = config.animated !== false;
            const animationDuration = animated ? 250 : 0;

            const statusBarState: StatusBarState = {
                backgroundColor: finalBackgroundColor,
                barStyle: finalBarStyle,
                hidden: config.hidden,
                translucent: config.translucent,
            };

            // Apply updates only if needed (utility handles caching)
            const wasUpdated = updateStatusBar(statusBarState, animated);

            // Reset transition state - faster if no update was needed
            setTimeout(() => setIsTransitioning(false), wasUpdated ? animationDuration : 0);
        },
        [presetConfigs]
    );

    // Find the best matching route configuration
    const findRouteConfig = useCallback(
        (route: string): RouteStatusBarConfig => {
            // Exact match first
            if (routeConfigs[route]) {
                return routeConfigs[route];
            }

            // Try to find partial matches (for dynamic routes)
            const routeKeys = Object.keys(routeConfigs).sort((a, b) => b.length - a.length);
            for (const key of routeKeys) {
                if (route.startsWith(key) || route.includes(key)) {
                    return routeConfigs[key];
                }
            }

            // Special pattern matching
            if (route.includes("/services/")) {
                return { style: "primary" };
            }
            if (route.includes("/settings/")) {
                return { style: "default" };
            }
            if (route.includes("/profile/")) {
                return { style: "default" };
            }
            if (route.includes("/(tabs)/")) {
                return { style: "default" };
            }

            // Default fallback
            return { style: defaultStyle };
        },
        [routeConfigs, defaultStyle]
    );

    // Set status bar for specific route
    const setStatusBarForRoute = useCallback(
        (route: string, style: StatusBarStyle, config?: Partial<StatusBarConfig>) => {
            setRouteConfigs(prev => ({
                ...prev,
                [route]: { style, config },
            }));
        },
        []
    );

    // Set temporary status bar (overrides route-based)
    const setTemporaryStatusBar = useCallback(
        (style: StatusBarStyle, config?: Partial<StatusBarConfig>) => {
            setTemporaryConfig({ style, config });
            setCurrentStyle(style);
            applyStatusBarConfig(style, config);
        },
        [applyStatusBarConfig]
    );

    // Clear temporary status bar
    const clearTemporaryStatusBar = useCallback(() => {
        setTemporaryConfig(null);
        // Reapply route-based config
        const routeConfig = findRouteConfig(currentRoute);
        setCurrentStyle(routeConfig.style);
        applyStatusBarConfig(routeConfig.style, routeConfig.config);
    }, [currentRoute, findRouteConfig, applyStatusBarConfig]);

    // Handle route changes
    useEffect(() => {
        const newRoute = pathname;
        setCurrentRoute(newRoute);

        // Only apply route config if no temporary config is active
        if (!temporaryConfig) {
            const routeConfig = findRouteConfig(newRoute);
            setCurrentStyle(routeConfig.style);
            applyStatusBarConfig(routeConfig.style, routeConfig.config);
        }
    }, [pathname, temporaryConfig, findRouteConfig, applyStatusBarConfig]);

    // Apply configuration on theme change with debouncing for performance
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (temporaryConfig) {
                applyStatusBarConfig(temporaryConfig.style, temporaryConfig.config);
            } else {
                const routeConfig = findRouteConfig(currentRoute);
                applyStatusBarConfig(routeConfig.style, routeConfig.config);
            }
        }, 50); // Small debounce to prevent rapid changes

        return () => clearTimeout(timeoutId);
    }, [isDark, temporaryConfig, currentRoute, findRouteConfig, applyStatusBarConfig]);

    // Handle app state changes
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === "active") {
                // Reapply current status bar when app becomes active
                if (temporaryConfig) {
                    applyStatusBarConfig(temporaryConfig.style, temporaryConfig.config);
                } else {
                    const routeConfig = findRouteConfig(currentRoute);
                    applyStatusBarConfig(routeConfig.style, routeConfig.config);
                }
            }
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => subscription?.remove();
    }, [temporaryConfig, currentRoute, findRouteConfig, applyStatusBarConfig]);

    const value: NavigationStatusBarContextType = {
        currentStyle,
        currentRoute,
        setStatusBarForRoute,
        setTemporaryStatusBar,
        clearTemporaryStatusBar,
        isDark,
        isTransitioning,
    };

    return <NavigationStatusBarContext.Provider value={value}>{children}</NavigationStatusBarContext.Provider>;
};

// Hook to use navigation status bar context
export const useNavigationStatusBar = (): NavigationStatusBarContextType => {
    const context = useContext(NavigationStatusBarContext);
    if (!context) {
        throw new Error("useNavigationStatusBar must be used within a NavigationStatusBarProvider");
    }
    return context;
};

// Enhanced hook for easy status bar management
export const useSmartStatusBar = () => {
    const {
        setTemporaryStatusBar,
        clearTemporaryStatusBar,
        setStatusBarForRoute,
        currentStyle,
        currentRoute,
        isDark,
        isTransitioning,
    } = useNavigationStatusBar();

    const setDefault = useCallback(() => setTemporaryStatusBar("default"), [setTemporaryStatusBar]);
    const setPrimary = useCallback(() => setTemporaryStatusBar("primary"), [setTemporaryStatusBar]);
    const setTransparent = useCallback(() => setTemporaryStatusBar("transparent"), [setTemporaryStatusBar]);

    const setCustom = useCallback(
        (backgroundColor: string, barStyle: "light-content" | "dark-content") => {
            setTemporaryStatusBar("custom", { backgroundColor, barStyle });
        },
        [setTemporaryStatusBar]
    );

    // Auto-contrast: automatically choose the right content style based on background
    const setAutoContrast = useCallback(
        (backgroundColor?: string) => {
            if (!backgroundColor) {
                setDefault();
                return;
            }

            // Simple brightness calculation to determine if we need light or dark content
            const hex = backgroundColor.replace("#", "");
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);

            // Calculate relative luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            // Use dark content for light backgrounds, light content for dark backgrounds
            const contentStyle = luminance > 0.5 ? "dark-content" : "light-content";

            setCustom(backgroundColor, contentStyle);
        },
        [setCustom, setDefault]
    );

    return {
        currentStyle,
        currentRoute,
        isDark,
        isTransitioning,

        // Temporary overrides (will be cleared on route change)
        setDefault,
        setPrimary,
        setTransparent,
        setCustom,
        setAutoContrast,
        clearTemporary: clearTemporaryStatusBar,

        // Permanent route configurations
        setForRoute: setStatusBarForRoute,
    };
};
