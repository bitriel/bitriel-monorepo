import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { Iconify } from "react-native-iconify";
// import { getAppIcon, setAppIcon } from "expo-dynamic-app-icon";
import { useState, useEffect } from "react";
import Colors from "~/src/constants/Colors";
import { settingStyles } from "../../index";

const ICONS = [
  {
    name: "Default",
    icon: require("~Assets/icon.png")
  },
  {
    name: "White",
    icon: require("~Assets/icon-white.png")
  }
];

export default function AppIconPage() {
  const [activeIcon, setActiveIcon] = useState("Default");

  // useEffect(() => {
  //   const loadCurrentIconPref = () => {
  //     const icon = getAppIcon();
  //     console.log("🚀 ~ loadCurrentIconPref ~ icon:", icon);
  //     setActiveIcon(icon);
  //   };
  //   loadCurrentIconPref();
  // }, []);

  // const onChangeAppIcon = (icon: string) => {
  //   setAppIcon(icon.toLowerCase());
  //   setActiveIcon(icon);
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={settingStyles.container}>
        <ScrollView contentContainerStyle={settingStyles.content}>
          <View style={[settingStyles.section, { paddingTop: 15 }]}>
            <View style={settingStyles.sectionBody}>
              {/* {ICONS.map((icon) => (
                <TouchableOpacity key={icon.name} className="flex-row p-4 gap-5 justify-between" onPress={() => onChangeAppIcon(icon.name)}>
                  <View className="flex-row">
                    <Image source={icon.icon} style={{ width: 24, height: 24, marginRight: 12 }} />
                    <Text className="text-base font-SpaceGroteskBold text-darkBlue">{icon.name}</Text>
                  </View>

                  {activeIcon.toLowerCase() === icon.name.toLowerCase() && <Iconify icon="solar:check-circle-bold" size={24} color={Colors.yellow} />}
                </TouchableOpacity>
              ))} */}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
