import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAppTheme } from "~/src/context/ThemeProvider";

interface Service {
    id: string;
    name: string;
    icon: string;
    onPress: () => void;
}

interface ServicesListProps {
    services: Service[];
}

const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
    const { getColor } = useAppTheme();

    const renderServiceItem = ({ item }: { item: Service }) => (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                backgroundColor: getColor("surface.primary"),
                marginVertical: 4,
                marginHorizontal: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: getColor("border.primary"),
            }}
            onPress={item.onPress}
        >
            <FontAwesome5 name={item.icon} size={30} color={getColor("secondary.main")} />
            <Text
                style={{
                    marginLeft: 16,
                    fontSize: 16,
                    fontWeight: "600",
                    color: getColor("text.primary"),
                }}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default ServicesList;
