import { ActivityIndicator, View } from "react-native";
import { BITRIEL_COLORS } from "~/src/constants/Colors";

export default function Page() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={BITRIEL_COLORS.blue[600]} />
        </View>
    );
}
