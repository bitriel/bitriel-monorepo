import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "~/src/constants/Colors";
import { ServicesItem } from "~/src/data/DataService";
import { router } from "expo-router";

interface Props {
    list: Array<ServicesItem>;
}

const ServicesList: React.FC<Props> = ({ list }) => {
    const handleServicePress = (route: string) => {
        // Use the router to push the specified route
        router.push(route as never);
    };

    return (
        <FlatList
            contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
            }}
            scrollEnabled={false}
            data={list}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    className="w-16 items-center mx-4 mb-5"
                    onPress={() => handleServicePress(item.route)}
                >
                    <View className="bg-offWhite w-16 h-16 justify-center items-center rounded-2xl mb-3">
                        <FontAwesome5 name={item.icon} size={30} color={Colors.secondary} />
                    </View>
                    <Text className="text-center text-xs text-secondary font-SpaceGroteskRegular capitalize">
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )}
            numColumns={4}
        />
    );
};

export default ServicesList;
