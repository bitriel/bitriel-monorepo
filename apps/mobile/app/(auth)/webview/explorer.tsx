import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function ExplorerWebView() {
  return (
    <View className="flex-1">
      <WebView style={{ flex: 1 }} source={{ uri: "https://scan.selendra.org" }} />
    </View>
  );
}
