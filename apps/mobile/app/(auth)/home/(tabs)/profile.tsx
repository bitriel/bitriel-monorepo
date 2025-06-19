import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Switch,
    Alert,
    Image,
} from "react-native";
import { router } from "expo-router";
import {
    User,
    Shield,
    Crown,
    Link,
    Wallet,
    KeyRound,
    Network,
    Fingerprint,
    Lock,
    ShieldCheck,
    Bell,
    DollarSign,
    Globe,
    Sun,
    HelpCircle,
    MessageCircle,
    Heart,
    Info,
    LogOut,
    ChevronRight,
    Settings,
    Camera,
    Star,
    CreditCard,
    FileText,
    Phone,
    Mail,
    Edit3,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "~/src/constants/Colors";
import { useMultiWalletStore } from "~/src/store/multiWalletStore";
import { useAuth } from "~/lib/hooks/useAuth";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { useWalletDataListStore } from "~/src/store/walletDataStore";
import helpers from "~/src/helpers";

interface ProfileMenuItem {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ElementType;
    route?: string;
    action?: () => void;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    isDestructive?: boolean;
    showChevron?: boolean;
    isNew?: boolean;
}

const ProfileScreen = () => {
    const { activeWallet } = useMultiWalletStore();
    const { signOut } = useAuth();
    const { user } = useAuth();

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(true);
    const [autoLockEnabled, setAutoLockEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [privacyModeEnabled, setPrivacyModeEnabled] = useState(false);

    // Profile stats
    const [profileStats] = useState({
        totalBalance: "$12,485.67",
        walletCount: 3,
        transactionCount: 124,
        rewardPoints: 1250,
        verificationLevel: "Gold",
        joinDate: "March 2024",
    });

    const handleLogout = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: () => {
                    useWalletDataListStore.getState().clearWalletDataListState;
                    ExpoSecureStoreAdapter.removeAll();
                    signOut();
                    router.navigate({ pathname: "/(public)/welcome" });
                },
            },
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert("Delete Account", "This action cannot be undone. All your data will be permanently deleted.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    // Add account deletion logic here
                    handleLogout();
                },
            },
        ]);
    };

    // Account & Profile Section
    const accountMenuItems: ProfileMenuItem[] = [
        {
            id: "personal-info",
            title: "Personal Information",
            subtitle: "Manage your profile details",
            icon: User,
            route: "/(auth)/home/profile/personal-info",
            showChevron: true,
        },
        {
            id: "kyc",
            title: "Identity Verification",
            subtitle: profileStats.verificationLevel + " • Verified",
            icon: ShieldCheck,
            route: "/(auth)/home/profile/kyc",
            showChevron: true,
        },
        {
            id: "account-tier",
            title: "Account Tier",
            subtitle: `${profileStats.verificationLevel} • Upgrade available`,
            icon: Crown,
            route: "/(auth)/home/profile/tier",
            showChevron: true,
        },
        {
            id: "linked-accounts",
            title: "Connected Accounts",
            subtitle: "Social & email accounts",
            icon: Link,
            route: "/(auth)/home/profile/linked-accounts",
            showChevron: true,
        },
    ];

    // Wallet & Assets Section
    const walletMenuItems: ProfileMenuItem[] = [
        {
            id: "manage-wallets",
            title: "Manage Wallets",
            subtitle: `${profileStats.walletCount} wallets connected`,
            icon: Wallet,
            route: "/(auth)/home/profile/wallets",
            showChevron: true,
        },
        {
            id: "backup-recovery",
            title: "Backup & Recovery",
            subtitle: "Secure your wallet phrases",
            icon: Shield,
            route: "/(auth)/home/profile/backup",
            showChevron: true,
        },
        {
            id: "networks",
            title: "Blockchain Networks",
            subtitle: "Manage supported networks",
            icon: Network,
            route: "/(auth)/home/profile/networks",
            showChevron: true,
        },
        {
            id: "transaction-history",
            title: "Transaction History",
            subtitle: `${profileStats.transactionCount} transactions`,
            icon: FileText,
            route: "/profile/transactions",
            showChevron: true,
        },
    ];

    // Security & Privacy Section
    const securityMenuItems: ProfileMenuItem[] = [
        {
            id: "biometric",
            title: "Biometric Authentication",
            subtitle: "Face ID / Fingerprint",
            icon: Fingerprint,
            hasSwitch: true,
            switchValue: biometricEnabled,
            onSwitchChange: setBiometricEnabled,
        },
        {
            id: "auto-lock",
            title: "Auto-Lock",
            subtitle: "Lock app after inactivity",
            icon: Lock,
            hasSwitch: true,
            switchValue: autoLockEnabled,
            onSwitchChange: setAutoLockEnabled,
        },
        {
            id: "privacy-mode",
            title: "Privacy Mode",
            subtitle: "Hide balances & sensitive info",
            icon: Shield,
            hasSwitch: true,
            switchValue: privacyModeEnabled,
            onSwitchChange: setPrivacyModeEnabled,
        },
        {
            id: "passcode",
            title: "Change Passcode",
            subtitle: "Update your security PIN",
            icon: KeyRound,
            route: "/(auth)/home/profile/passcode",
            showChevron: true,
        },
        {
            id: "2fa",
            title: "Two-Factor Authentication",
            subtitle: "Extra security layer",
            icon: ShieldCheck,
            route: "/profile/2fa",
            showChevron: true,
        },
    ];

    // Preferences Section
    const preferencesMenuItems: ProfileMenuItem[] = [
        {
            id: "notifications",
            title: "Notifications",
            subtitle: "Push notifications & alerts",
            icon: Bell,
            hasSwitch: true,
            switchValue: notificationsEnabled,
            onSwitchChange: setNotificationsEnabled,
        },
        {
            id: "dark-mode",
            title: "Dark Mode",
            subtitle: "Switch to dark theme",
            icon: Sun,
            hasSwitch: true,
            switchValue: darkModeEnabled,
            onSwitchChange: setDarkModeEnabled,
        },
        {
            id: "currency",
            title: "Default Currency",
            subtitle: "USD • United States Dollar",
            icon: DollarSign,
            route: "/profile/currency",
            showChevron: true,
        },
        {
            id: "language",
            title: "Language & Region",
            subtitle: "English (US)",
            icon: Globe,
            route: "/profile/language",
            showChevron: true,
        },
    ];

    // Support & Info Section
    const supportMenuItems: ProfileMenuItem[] = [
        {
            id: "help-center",
            title: "Help Center",
            subtitle: "FAQs & guides",
            icon: HelpCircle,
            route: "/profile/help",
            showChevron: true,
        },
        {
            id: "contact-support",
            title: "Contact Support",
            subtitle: "Get help from our team",
            icon: MessageCircle,
            route: "/profile/support",
            showChevron: true,
        },
        {
            id: "feedback",
            title: "Send Feedback",
            subtitle: "Help us improve",
            icon: Heart,
            route: "/profile/feedback",
            showChevron: true,
        },
        {
            id: "about",
            title: "About Bitriel",
            subtitle: "Version 2.1.0",
            icon: Info,
            route: "/profile/about",
            showChevron: true,
        },
        {
            id: "legal",
            title: "Legal & Privacy",
            subtitle: "Terms, Privacy Policy",
            icon: FileText,
            route: "/profile/legal",
            showChevron: true,
        },
    ];

    const renderProfileHeader = () => (
        <View style={styles.profileHeader}>
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.profileGradient}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        {user?.profile ? (
                            <Image source={{ uri: user.profile }} style={styles.profileAvatar} />
                        ) : (
                            <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
                                <User size={40} color="#8E8E93" />
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={() => router.push("/(auth)/home/profile/edit-photo" as any)}
                        >
                            <Camera size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileDetails}>
                        <Text style={styles.profileName}>{user?.fullname || "User"}</Text>
                        <Text style={styles.profileEmail}>{user?.email || "user@bitriel.com"}</Text>
                        <View style={styles.verificationBadge}>
                            <Crown size={14} color="#FFD700" />
                            <Text style={styles.verificationText}>{profileStats.verificationLevel}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push("/(auth)/home/profile/edit" as any)}
                    >
                        <Edit3 size={18} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profileStats.totalBalance}</Text>
                        <Text style={styles.statLabel}>Total Balance</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profileStats.rewardPoints}</Text>
                        <Text style={styles.statLabel}>Reward Points</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profileStats.walletCount}</Text>
                        <Text style={styles.statLabel}>Wallets</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );

    const renderMenuItem = (item: ProfileMenuItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.action || (() => item.route && router.push(item.route as any))}
        >
            <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                    <item.icon size={20} color={Colors.primary} />
                </View>
                <View style={styles.menuContent}>
                    <View style={styles.menuTitleRow}>
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        {item.isNew && (
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>NEW</Text>
                            </View>
                        )}
                    </View>
                    {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
                </View>
            </View>
            <View style={styles.menuItemRight}>
                {item.hasSwitch ? (
                    <Switch
                        value={item.switchValue}
                        onValueChange={item.onSwitchChange}
                        trackColor={{ false: "#E5E5E7", true: Colors.primary }}
                        thumbColor="#FFFFFF"
                    />
                ) : item.showChevron ? (
                    <ChevronRight size={18} color="#8E8E93" />
                ) : null}
            </View>
        </TouchableOpacity>
    );

    const renderMenuSection = (title: string, items: ProfileMenuItem[], isDangerous = false) => (
        <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={[styles.menuContainer, isDangerous && styles.dangerousSection]}>
                {items.map((item, index) => (
                    <View key={item.id}>
                        {renderMenuItem(item)}
                        {index < items.length - 1 && <View style={styles.menuDivider} />}
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {renderProfileHeader()}

                {renderMenuSection("Account & Profile", accountMenuItems)}
                {renderMenuSection("Wallet & Assets", walletMenuItems)}
                {renderMenuSection("Security & Privacy", securityMenuItems)}
                {renderMenuSection("Preferences", preferencesMenuItems)}
                {renderMenuSection("Support & Information", supportMenuItems)}

                {/* Dangerous Actions */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Account Actions</Text>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.menuIcon, styles.dangerousIcon]}>
                                    <LogOut size={20} color="#FF3B30" />
                                </View>
                                <Text style={[styles.menuTitle, styles.dangerousText]}>Sign Out</Text>
                            </View>
                            <ChevronRight size={18} color="#FF3B30" />
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.menuIcon, styles.dangerousIcon]}>
                                    <User size={20} color="#FF3B30" />
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={[styles.menuTitle, styles.dangerousText]}>Delete Account</Text>
                                    <Text style={styles.menuSubtitle}>Permanently remove your account</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Member since {profileStats.joinDate}</Text>
                    <Text style={styles.footerText}>Bitriel v2.1.0</Text>
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
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        marginBottom: 24,
    },
    profileGradient: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    avatarContainer: {
        position: "relative",
        marginRight: 16,
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: "white",
    },
    avatarPlaceholder: {
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
    },
    cameraButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        marginBottom: 8,
    },
    verificationBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    verificationText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 4,
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        padding: 16,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
    },
    statDivider: {
        width: 1,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        marginHorizontal: 16,
    },
    menuSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    menuContainer: {
        backgroundColor: "white",
        marginHorizontal: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dangerousSection: {
        borderColor: "#FF3B30",
        borderWidth: 1,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    dangerousIcon: {
        backgroundColor: "#FFEBEE",
    },
    menuContent: {
        flex: 1,
    },
    menuTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1A1A1A",
        marginRight: 8,
    },
    dangerousText: {
        color: "#FF3B30",
    },
    menuSubtitle: {
        fontSize: 14,
        color: "#8E8E93",
        marginTop: 2,
    },
    menuItemRight: {
        marginLeft: 12,
    },
    menuDivider: {
        height: 1,
        backgroundColor: "#F2F2F7",
        marginLeft: 68,
    },
    newBadge: {
        backgroundColor: "#34C759",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    newBadgeText: {
        fontSize: 10,
        fontWeight: "600",
        color: "white",
    },
    footer: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    footerText: {
        fontSize: 12,
        color: "#8E8E93",
        marginBottom: 4,
    },
});

export default ProfileScreen;
