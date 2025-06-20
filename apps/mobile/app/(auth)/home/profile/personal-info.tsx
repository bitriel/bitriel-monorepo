import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Alert,
    Switch,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, Save, Edit3, Mail, Phone, MapPin, Calendar, User, Camera } from "lucide-react-native";
import Colors from "~/src/constants/Colors";
import helpers from "~/src/helpers";

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    city: string;
    country: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
}

const PersonalInfoScreen = () => {
    const user = helpers.activeUser();
    const [isEditing, setIsEditing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const [userInfo, setUserInfo] = useState<UserInfo>({
        firstName: user.fullName?.split(" ")[0] || "",
        lastName: user.fullName?.split(" ").slice(1).join(" ") || "",
        email: "user@bitriel.com",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "1990-01-15",
        address: "123 Crypto Street",
        city: "San Francisco",
        country: "United States",
        isEmailVerified: true,
        isPhoneVerified: false,
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
    });

    const handleInputChange = (field: keyof UserInfo, value: string) => {
        setUserInfo(prev => ({
            ...prev,
            [field]: value,
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        Alert.alert("Save Changes", "Are you sure you want to save these changes?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Save",
                onPress: () => {
                    // Here you would typically call an API to save the changes
                    setIsEditing(false);
                    setHasChanges(false);
                    Alert.alert("Success", "Your information has been updated successfully.");
                },
            },
        ]);
    };

    const handleVerifyEmail = () => {
        Alert.alert("Verify Email", "We'll send a verification link to your email address.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Send",
                onPress: () => {
                    Alert.alert("Email Sent", "Verification email has been sent to your inbox.");
                },
            },
        ]);
    };

    const handleVerifyPhone = () => {
        Alert.alert("Verify Phone", "We'll send a verification code to your phone number.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Send",
                onPress: () => {
                    Alert.alert("SMS Sent", "Verification code has been sent to your phone.");
                },
            },
        ]);
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Personal Information</Text>
            <TouchableOpacity
                onPress={isEditing ? handleSave : () => setIsEditing(true)}
                style={[styles.actionButton, hasChanges && styles.saveButton]}
            >
                {isEditing ? (
                    <Save size={24} color={hasChanges ? "white" : Colors.primary} />
                ) : (
                    <Edit3 size={24} color={Colors.primary} />
                )}
            </TouchableOpacity>
        </View>
    );

    const renderInputField = (
        label: string,
        value: string,
        field: keyof UserInfo,
        placeholder: string,
        icon: React.ReactNode,
        keyboardType: any = "default"
    ) => (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>{icon}</View>
                <TextInput
                    style={[styles.textInput, !isEditing && styles.disabledInput]}
                    value={value}
                    onChangeText={text => handleInputChange(field, text)}
                    placeholder={placeholder}
                    placeholderTextColor="#8E8E93"
                    editable={isEditing}
                    keyboardType={keyboardType}
                />
            </View>
        </View>
    );

    const renderVerificationStatus = (label: string, isVerified: boolean, onVerify: () => void) => (
        <View style={styles.verificationContainer}>
            <View style={styles.verificationInfo}>
                <Text style={styles.verificationLabel}>{label}</Text>
                <View style={styles.verificationStatus}>
                    <View style={[styles.statusIndicator, isVerified ? styles.verified : styles.unverified]} />
                    <Text style={[styles.statusText, isVerified ? styles.verifiedText : styles.unverifiedText]}>
                        {isVerified ? "Verified" : "Not Verified"}
                    </Text>
                </View>
            </View>
            {!isVerified && (
                <TouchableOpacity onPress={onVerify} style={styles.verifyButton}>
                    <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderNotificationSettings = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            <View style={styles.card}>
                <View style={styles.notificationItem}>
                    <View style={styles.notificationInfo}>
                        <Text style={styles.notificationLabel}>Email Notifications</Text>
                        <Text style={styles.notificationDescription}>Receive updates via email</Text>
                    </View>
                    <Switch
                        value={notifications.emailNotifications}
                        onValueChange={value => setNotifications(prev => ({ ...prev, emailNotifications: value }))}
                        trackColor={{ false: "#E5E5E7", true: Colors.primary }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.notificationItem}>
                    <View style={styles.notificationInfo}>
                        <Text style={styles.notificationLabel}>SMS Notifications</Text>
                        <Text style={styles.notificationDescription}>Receive updates via SMS</Text>
                    </View>
                    <Switch
                        value={notifications.smsNotifications}
                        onValueChange={value => setNotifications(prev => ({ ...prev, smsNotifications: value }))}
                        trackColor={{ false: "#E5E5E7", true: Colors.primary }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.notificationItem}>
                    <View style={styles.notificationInfo}>
                        <Text style={styles.notificationLabel}>Push Notifications</Text>
                        <Text style={styles.notificationDescription}>Receive app notifications</Text>
                    </View>
                    <Switch
                        value={notifications.pushNotifications}
                        onValueChange={value => setNotifications(prev => ({ ...prev, pushNotifications: value }))}
                        trackColor={{ false: "#E5E5E7", true: Colors.primary }}
                        thumbColor="#FFFFFF"
                    />
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <View style={styles.card}>
                        {renderInputField(
                            "First Name",
                            userInfo.firstName,
                            "firstName",
                            "Enter your first name",
                            <User size={20} color="#8E8E93" />
                        )}
                        {renderInputField(
                            "Last Name",
                            userInfo.lastName,
                            "lastName",
                            "Enter your last name",
                            <User size={20} color="#8E8E93" />
                        )}
                        {renderInputField(
                            "Date of Birth",
                            userInfo.dateOfBirth,
                            "dateOfBirth",
                            "YYYY-MM-DD",
                            <Calendar size={20} color="#8E8E93" />
                        )}
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <View style={styles.card}>
                        {renderInputField(
                            "Email Address",
                            userInfo.email,
                            "email",
                            "Enter your email",
                            <Mail size={20} color="#8E8E93" />,
                            "email-address"
                        )}
                        {renderVerificationStatus("Email Verification", userInfo.isEmailVerified, handleVerifyEmail)}

                        <View style={styles.divider} />

                        {renderInputField(
                            "Phone Number",
                            userInfo.phone,
                            "phone",
                            "Enter your phone number",
                            <Phone size={20} color="#8E8E93" />,
                            "phone-pad"
                        )}
                        {renderVerificationStatus("Phone Verification", userInfo.isPhoneVerified, handleVerifyPhone)}
                    </View>
                </View>

                {/* Address Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Address Information</Text>
                    <View style={styles.card}>
                        {renderInputField(
                            "Street Address",
                            userInfo.address,
                            "address",
                            "Enter your address",
                            <MapPin size={20} color="#8E8E93" />
                        )}
                        {renderInputField(
                            "City",
                            userInfo.city,
                            "city",
                            "Enter your city",
                            <MapPin size={20} color="#8E8E93" />
                        )}
                        {renderInputField(
                            "Country",
                            userInfo.country,
                            "country",
                            "Enter your country",
                            <MapPin size={20} color="#8E8E93" />
                        )}
                    </View>
                </View>

                {renderNotificationSettings()}

                {/* Data Export */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Management</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.actionItem}>
                            <Text style={styles.actionText}>Export Personal Data</Text>
                            <Text style={styles.actionDescription}>Download a copy of your personal information</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.actionItem}>
                            <Text style={[styles.actionText, styles.dangerousAction]}>Delete Personal Data</Text>
                            <Text style={styles.actionDescription}>Permanently delete your personal information</Text>
                        </TouchableOpacity>
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
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    saveButton: {
        backgroundColor: Colors.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 12,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F7",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#1A1A1A",
    },
    disabledInput: {
        color: "#8E8E93",
    },
    verificationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 8,
        marginBottom: 12,
    },
    verificationInfo: {
        flex: 1,
    },
    verificationLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    verificationStatus: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    verified: {
        backgroundColor: "#4CAF50",
    },
    unverified: {
        backgroundColor: "#FF9800",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "500",
    },
    verifiedText: {
        color: "#4CAF50",
    },
    unverifiedText: {
        color: "#FF9800",
    },
    verifyButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    verifyButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: "white",
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E5E7",
        marginVertical: 16,
    },
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    notificationInfo: {
        flex: 1,
    },
    notificationLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    notificationDescription: {
        fontSize: 14,
        color: "#8E8E93",
    },
    actionItem: {
        paddingVertical: 16,
    },
    actionText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    dangerousAction: {
        color: "#FF3B30",
    },
    actionDescription: {
        fontSize: 14,
        color: "#8E8E93",
    },
});

export default PersonalInfoScreen;
