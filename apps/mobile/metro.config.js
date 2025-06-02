// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// Get the default configuration from Expo
const defaultConfig = getDefaultConfig(__dirname);

// Apply NativeWind and Reanimated configurations
const combinedConfig = withNativeWind(defaultConfig, {
  input: "./global.css", // Adjust the path to your global styles if needed
});

// Wrap the configuration with Reanimated
module.exports = wrapWithReanimatedMetroConfig(combinedConfig);