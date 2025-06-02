import React, { useState } from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Switch, Alert, Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";
import { settingStyles } from "../index";

export default function SecurityPage() {
  const [form, setForm] = useState({
    security: false
  });

  const checkDeviceForSecurity = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert("Error", "Your device does not support biometric authentication.");
      return false;
    }
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert("Error", "No biometric authentication methods are set up on this device.");
      return false;
    }
    return true;
  };

  const handleAndroidFingerprint = async () => {
    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Fingerprint",
      fallbackLabel: "Enter Password"
    });
    return success;
  };

  const handleIOSFaceID = async () => {
    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Face ID"
    });
    return success;
  };

  const handleSecurityToggle = async () => {
    const isDeviceSecure = await checkDeviceForSecurity();
    if (!isDeviceSecure) return;

    let success = false;
    if (Platform.OS === "android") {
      success = await handleAndroidFingerprint();
    } else if (Platform.OS === "ios") {
      success = await handleIOSFaceID();
    }

    if (success) {
      setForm((form) => ({ ...form, security: !form.security }));
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={settingStyles.container}>
        <ScrollView contentContainerStyle={settingStyles.content}>
          <View style={[settingStyles.section, { paddingTop: 15 }]}>
            <View style={settingStyles.sectionBody}>
              <View style={[settingStyles.rowWrapper, settingStyles.rowFirst, settingStyles.rowLast]}>
                <TouchableOpacity onPress={handleSecurityToggle} style={settingStyles.row}>
                  <Text style={settingStyles.rowLabel}>
                    {Platform.OS === "android" ? "Use Fingerprint Authentication" : "Use Face ID Authentication"}
                  </Text>

                  <View style={settingStyles.rowSpacer} />

                  <Switch onValueChange={handleSecurityToggle} style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }} value={form.security} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
