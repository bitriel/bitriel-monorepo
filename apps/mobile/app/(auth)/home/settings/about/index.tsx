import { router } from "expo-router";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Switch, Image } from "react-native";
import { Iconify } from "react-native-iconify";
import { settingStyles } from "../index";
import * as Linking from "expo-linking";

export default function AboutPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={settingStyles.container}>
        <ScrollView contentContainerStyle={settingStyles.content}>
          <View className="items-center m-5">
            <Image source={require("~Assets/bitriel-logo.png")} style={{ width: 100, height: 100 }} />

            <Text className="mt-3 text-center font-SpaceGroteskSemiBold text-lg text-black">Version 1.0.0 (3)</Text>
          </View>

          <View style={settingStyles.section}>
            <View style={settingStyles.sectionBody}>
              <View style={[settingStyles.rowWrapper, settingStyles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("https://www.privacypolicies.com/live/0f9d68c7-f846-447d-92ba-5d4d84a68d5a");
                  }}
                  style={settingStyles.row}>
                  <Text style={settingStyles.rowLabel}>Privacy Policy</Text>

                  <View style={settingStyles.rowSpacer} />

                  <Iconify color="#bcbcbc" icon="solar:alt-arrow-right-line-duotone" size={19} />
                </TouchableOpacity>
              </View>

              <View style={[settingStyles.rowWrapper, settingStyles.rowLast]}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("https://www.bitriel.com");
                  }}
                  style={settingStyles.row}>
                  <Text style={settingStyles.rowLabel}>Visit Website</Text>

                  <View style={settingStyles.rowSpacer} />

                  <Iconify color="#bcbcbc" icon="solar:alt-arrow-right-line-duotone" size={19} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
