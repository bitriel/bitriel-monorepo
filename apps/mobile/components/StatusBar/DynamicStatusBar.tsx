import React from "react";
import { StatusBar as RNStatusBar, Platform } from "react-native";
import { StatusBarStyle, StatusBarConfig, useStatusBar } from "../../src/hooks/useStatusBar";

interface DynamicStatusBarProps extends StatusBarConfig {
    children?: React.ReactNode;
}

export const DynamicStatusBar: React.FC<DynamicStatusBarProps> = ({ children, ...config }) => {
    const { isDark, currentConfig } = useStatusBar(config);

    // For Expo managed workflow, we can also use expo-status-bar
    if (Platform.OS === "web") {
        return <>{children}</>;
    }

    return (
        <>
            <RNStatusBar
                backgroundColor={currentConfig.backgroundColor}
                barStyle={currentConfig.barStyle || (isDark ? "light-content" : "dark-content")}
                hidden={currentConfig.hidden || false}
                translucent={currentConfig.translucent || false}
                animated={currentConfig.animated !== false}
            />
            {children}
        </>
    );
};

// Preset components for common use cases
export const DefaultStatusBar: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <DynamicStatusBar style="default">{children}</DynamicStatusBar>
);

export const PrimaryStatusBar: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <DynamicStatusBar style="primary">{children}</DynamicStatusBar>
);

export const GradientStatusBar: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <DynamicStatusBar style="gradient">{children}</DynamicStatusBar>
);

export const TransparentStatusBar: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <DynamicStatusBar style="transparent" translucent>
        {children}
    </DynamicStatusBar>
);

// Higher-order component for wrapping screens with status bar
export const withDynamicStatusBar = <P extends object>(
    Component: React.ComponentType<P>,
    statusBarConfig?: StatusBarConfig
) => {
    const WrappedComponent: React.FC<P> = props => (
        <DynamicStatusBar {...statusBarConfig}>
            <Component {...props} />
        </DynamicStatusBar>
    );

    WrappedComponent.displayName = `withDynamicStatusBar(${Component.displayName || Component.name})`;
    return WrappedComponent;
};
