import TabManager from "~/components/WebView/TabManager";
import { StyleSheet, SafeAreaView } from "react-native";

export default function WebViewScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <TabManager />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
