import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    TextInput,
    Alert,
    Image,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, Save, Camera, User, Mail, Phone } from "lucide-react-native";
import Colors from "~/src/constants/Colors";
import helpers from "~/src/helpers";

const ProfileEditScreen = () => {
    const user = helpers.activeUser();
    const [formData, setFormData] = useState({
        fullName: user.fullName || "",
        email: "user@bitriel.com",
        phone: "+1 (555) 123-4567",
        bio: "Crypto enthusiast and early adopter of blockchain technology.",
    });

    const handleSave = () => {
        Alert.alert("Success", "Profile updated successfully!");
        router.back();
    };

    const handlePhotoEdit = () => {
        Alert.alert("Change Profile Photo", "Choose an option", [
            { text: "Cancel", style: "cancel" },
            { text: "Take Photo", onPress: () => {} },
            { text: "Choose from Library", onPress: () => {} },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Save size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.photoSection}>
                    <TouchableOpacity onPress={handlePhotoEdit} style={styles.photoContainer}>
                        <Image source={{ uri: user.avatar }} style={styles.profilePhoto} />
                        <View style={styles.cameraOverlay}>
                            <Camera size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.photoText}>Tap to change photo</Text>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <User size={20} color="#8E8E93" />
                            <TextInput
                                style={styles.input}
                                value={formData.fullName}
                                onChangeText={text => setFormData(prev => ({ ...prev, fullName: text }))}
                                placeholder="Enter your full name"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Mail size={20} color="#8E8E93" />
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={text => setFormData(prev => ({ ...prev, email: text }))}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone</Text>
                        <View style={styles.inputContainer}>
                            <Phone size={20} color="#8E8E93" />
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={text => setFormData(prev => ({ ...prev, phone: text }))}
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={styles.textArea}
                            value={formData.bio}
                            onChangeText={text => setFormData(prev => ({ ...prev, bio: text }))}
                            placeholder="Tell us about yourself"
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E7",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
    },
    saveButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    photoSection: {
        alignItems: "center",
        paddingVertical: 32,
    },
    photoContainer: {
        position: "relative",
        marginBottom: 12,
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraOverlay: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "white",
    },
    photoText: {
        fontSize: 14,
        color: "#8E8E93",
    },
    formSection: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F7",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: "#1A1A1A",
    },
    textArea: {
        backgroundColor: "#F2F2F7",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#1A1A1A",
        textAlignVertical: "top",
        minHeight: 100,
    },
});

export default ProfileEditScreen;
