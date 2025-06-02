// MiniBrowser.tsx
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { Iconify } from "react-native-iconify";

interface MiniBrowserProps {
    initialUrl: string;
    onUrlChange: (url: string) => void;
}

const MiniBrowser: React.FC<MiniBrowserProps> = ({ initialUrl, onUrlChange }) => {
    const [url, setUrl] = useState<string>(initialUrl);
    const [inputUrl, setInputUrl] = useState<string>(initialUrl);
    const [loading, setLoading] = useState<boolean>(false);
    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [canGoForward, setCanGoForward] = useState<boolean>(false);
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
        setUrl(initialUrl);
        setInputUrl(initialUrl);
    }, [initialUrl]);

    const formatUrl = (url: string) => {
        let formattedUrl = url.trim().toLowerCase();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }
        return formattedUrl;
    };

    const handleGoPress = () => {
        const formattedUrl = formatUrl(inputUrl);
        if (formattedUrl !== url) {
            setUrl(formattedUrl);
            setInputUrl(formattedUrl);
            onUrlChange(formattedUrl); // Notify parent about the URL change
        }
    };

    const handleBackPress = () => {
        if (webViewRef.current && canGoBack) {
            webViewRef.current.goBack();
        }
    };

    const handleForwardPress = () => {
        if (webViewRef.current && canGoForward) {
            webViewRef.current.goForward();
        }
    };

    const handleReloadPress = () => {
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
    };

    const handleNavigationStateChange = (navState: WebViewNavigation) => {
        const newUrl = navState.url;
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
        if (newUrl !== url) {
            setUrl(newUrl);
            setInputUrl(newUrl);
            onUrlChange(newUrl); // Notify parent about the URL change
        }
    };

    const handleWebViewError = () => {
        const urlWithoutWWW = url.replace(/^https?:\/\/(?:www\.)?/i, "https://");
        const googleSearchUrl = "https://www.google.com/search?q=" + encodeURIComponent(urlWithoutWWW);
        setUrl(googleSearchUrl);
        setInputUrl(googleSearchUrl);
        onUrlChange(googleSearchUrl); // Notify parent about the URL change
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} disabled={!webViewRef.current?.goBack}>
                    <Iconify
                        icon="solar:alt-arrow-left-line-duotone"
                        size={24}
                        color={!webViewRef.current?.goBack ? "gray" : "black"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForwardPress} disabled={!webViewRef.current?.goForward}>
                    <Iconify
                        icon="solar:alt-arrow-right-line-duotone"
                        size={24}
                        color={!webViewRef.current?.goForward ? "gray" : "black"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReloadPress}>
                    <Iconify icon="solar:refresh-bold" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={inputUrl}
                    onChangeText={setInputUrl}
                    onSubmitEditing={handleGoPress}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity onPress={handleGoPress}>
                    <Iconify icon="solar:alt-arrow-right-line-duotone" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={styles.webview}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onError={handleWebViewError} // Handle WebView errors
                onNavigationStateChange={handleNavigationStateChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#eee",
    },
    input: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 10,
    },
    webview: {
        flex: 1,
    },
});

export default MiniBrowser;
