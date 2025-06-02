import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router, Stack } from "expo-router";
import { useCustodialAuthStore } from "~/src/store/useCustodialAuthStore";
import { Iconify } from "react-native-iconify";
import Colors from "~/src/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApi } from "~/src/api/userApi";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";

export default function CustodialRegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, isLoading, error, clearError } = useCustodialAuthStore();

    useEffect(() => {
        return () => clearError();
    }, []);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }

        try {
            await register(email, password);

            // Fetch user data to get private key
            const userData = await authApi.getCurrentUser();

            if (userData.privateKey) {
                // Save private key as mnemonic for non-custodial wallet
                await ExpoSecureStoreAdapter.setItem("wallet_mnemonic", userData.privateKey);

                // Navigate to passcode screen
                router.replace({
                    pathname: "/(public)/passcode",
                    params: {
                        modeTypeParam: "set",
                        fromParam: "custodial",
                        mnemonicParam: userData.privateKey,
                        isDualWallet: "true",
                    },
                });
            } else {
                // If no private key, just use custodial wallet
                router.replace({
                    pathname: "/(public)/passcode",
                    params: {
                        modeTypeParam: "set",
                        fromParam: "custodial",
                    },
                });
            }
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Iconify icon="solar:arrow-left-bold" size={24} color={Colors.darkBlue} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Register</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            autoCapitalize="words"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                secureTextEntry={!showPassword}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <Iconify icon="solar:eye-closed-bold" size={24} color={Colors.darkBlue} />
                                ) : (
                                    <Iconify icon="solar:eye-bold" size={24} color={Colors.darkBlue} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm your password"
                                secureTextEntry={!showConfirmPassword}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <Iconify icon="solar:eye-closed-bold" size={24} color={Colors.darkBlue} />
                                ) : (
                                    <Iconify icon="solar:eye-bold" size={24} color={Colors.darkBlue} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? "Creating Account..." : "Create Account"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/(public)/custodial/login")} disabled={isLoading}>
                        <Text style={[styles.linkText, isLoading && styles.linkTextDisabled]}>
                            Already have an account? Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.blackText,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontFamily: "SpaceGrotesk-Bold",
        color: Colors.darkBlue,
    },
    form: {
        padding: 16,
        gap: 16,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontFamily: "SpaceGrotesk-Medium",
        color: Colors.darkBlue,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.blackText,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: "SpaceGrotesk-Regular",
        backgroundColor: Colors.white,
    },
    passwordContainer: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
    },
    passwordInput: {
        flex: 1,
        paddingRight: 40,
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
        padding: 4,
    },
    button: {
        backgroundColor: Colors.yellow,
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: Colors.blackText,
        fontSize: 16,
        fontFamily: "SpaceGrotesk-SemiBold",
    },
    linkText: {
        color: Colors.yellow,
        fontSize: 14,
        fontFamily: "SpaceGrotesk-Medium",
        textAlign: "center",
        marginTop: 16,
    },
    linkTextDisabled: {
        opacity: 0.7,
    },
});
