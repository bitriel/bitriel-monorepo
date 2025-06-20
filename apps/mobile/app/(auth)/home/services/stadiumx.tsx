import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Alert,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { WebView } from "react-native-webview";
import { ArrowLeft, ExternalLink, RefreshCw, Share, Heart, Star, Trophy, MapPin } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "~/src/constants/Colors";

const StadiumXScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("http://stadiumx.asia");
    const [isFavorite, setIsFavorite] = useState(false);
    const webViewRef = useRef<WebView>(null);

    const handleRefresh = () => {
        webViewRef.current?.reload();
    };

    const handleShare = () => {
        Alert.alert("Share StadiumX Asia", "Share this amazing sports platform with your friends!", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Share Link",
                onPress: () => {
                    // In a real app, you would use the Share API
                    Alert.alert("Shared!", "Link shared successfully!");
                },
            },
        ]);
    };

    const handleExternalOpen = () => {
        Alert.alert("Open in Browser", "Do you want to open StadiumX Asia in your default browser?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Open",
                onPress: () => {
                    // In a real app, you would use Linking.openURL
                    Alert.alert("Opened!", "Opening in external browser...");
                },
            },
        ]);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        Alert.alert(
            isFavorite ? "Removed from Favorites" : "Added to Favorites",
            isFavorite ? "StadiumX Asia removed from your favorites" : "StadiumX Asia added to your favorites"
        );
    };

    const renderHeader = () => (
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>StadiumX Asia</Text>
                    <Text style={styles.headerSubtitle}>Sports & Entertainment Hub</Text>
                </View>
                <TouchableOpacity onPress={toggleFavorite} style={styles.headerButton}>
                    <Heart
                        size={24}
                        color={isFavorite ? "#FF3B30" : "white"}
                        fill={isFavorite ? "#FF3B30" : "transparent"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.headerStats}>
                <View style={styles.statItem}>
                    <Trophy size={16} color="white" />
                    <Text style={styles.statText}>Sports Hub</Text>
                </View>
                <View style={styles.statItem}>
                    <Star size={16} color="#FFD700" />
                    <Text style={styles.statText}>4.8 Rating</Text>
                </View>
                <View style={styles.statItem}>
                    <MapPin size={16} color="white" />
                    <Text style={styles.statText}>Asia Pacific</Text>
                </View>
            </View>
        </LinearGradient>
    );

    const renderControls = () => (
        <View style={styles.controls}>
            <TouchableOpacity
                style={[styles.controlButton, !canGoBack && styles.disabledButton]}
                onPress={() => webViewRef.current?.goBack()}
                disabled={!canGoBack}
            >
                <ArrowLeft size={20} color={canGoBack ? Colors.primary : "#8E8E93"} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.controlButton, !canGoForward && styles.disabledButton]}
                onPress={() => webViewRef.current?.goForward()}
                disabled={!canGoForward}
            >
                <ArrowLeft
                    size={20}
                    color={canGoForward ? Colors.primary : "#8E8E93"}
                    style={{ transform: [{ rotate: "180deg" }] }}
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handleRefresh}>
                <RefreshCw size={20} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handleShare}>
                <Share size={20} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handleExternalOpen}>
                <ExternalLink size={20} color={Colors.primary} />
            </TouchableOpacity>
        </View>
    );

    const renderFeatures = () => (
        <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What's on StadiumX Asia</Text>
            <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                    <Trophy size={20} color={Colors.primary} />
                    <Text style={styles.featureText}>Live Sports Events</Text>
                </View>
                <View style={styles.featureItem}>
                    <Star size={20} color={Colors.primary} />
                    <Text style={styles.featureText}>Premium Entertainment</Text>
                </View>
                <View style={styles.featureItem}>
                    <MapPin size={20} color={Colors.primary} />
                    <Text style={styles.featureText}>Venue Information</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            {renderHeader()}
            {renderControls()}

            <View style={styles.webViewContainer}>
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Loading StadiumX Asia...</Text>
                        {renderFeatures()}
                    </View>
                )}

                <WebView
                    ref={webViewRef}
                    source={{ uri: currentUrl }}
                    style={styles.webView}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    onNavigationStateChange={navState => {
                        setCanGoBack(navState.canGoBack);
                        setCanGoForward(navState.canGoForward);
                        setCurrentUrl(navState.url);
                    }}
                    onError={error => {
                        Alert.alert(
                            "Connection Error",
                            "Unable to load StadiumX Asia. Please check your internet connection and try again.",
                            [{ text: "Retry", onPress: handleRefresh }, { text: "OK" }]
                        );
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    allowsBackForwardNavigationGestures={true}
                    userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1 BitrielApp/2.1.0"
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    header: {
        paddingTop: 10,
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerCenter: {
        flex: 1,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
    },
    headerStats: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
        padding: 12,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    statText: {
        color: "white",
        fontSize: 12,
        fontWeight: "500",
        marginLeft: 6,
    },
    controls: {
        flexDirection: "row",
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E7",
        justifyContent: "space-around",
    },
    controlButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
    },
    disabledButton: {
        opacity: 0.5,
    },
    webViewContainer: {
        flex: 1,
        position: "relative",
    },
    webView: {
        flex: 1,
    },
    loadingContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
        paddingHorizontal: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#8E8E93",
        marginBottom: 40,
    },
    featuresContainer: {
        width: "100%",
        backgroundColor: "#F8F9FA",
        borderRadius: 16,
        padding: 20,
    },
    featuresTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 16,
        textAlign: "center",
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    featureText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1A1A1A",
        marginLeft: 12,
    },
});

export default StadiumXScreen;
