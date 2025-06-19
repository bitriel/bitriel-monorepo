import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Dimensions,
} from "react-native";
import { router } from "expo-router";
import {
    ArrowUp,
    ArrowDown,
    QrCode,
    CreditCard,
    Bell,
    Eye,
    TrendingUp,
    ArrowRight,
    BarChart3,
    Grid3X3,
    Image,
    Star,
    FileText,
    ShoppingBag,
    Gift,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "~/src/constants/Colors";
import Balance from "~/components/Balance";
import { useMultiWalletStore } from "~/src/store/multiWalletStore";

const { width } = Dimensions.get("window");

interface QuickActionItem {
    id: string;
    title: string;
    icon: string;
    route: string;
    color: string;
    bgColor: string;
}

interface ServiceGridItem {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    route: string;
    gradient: readonly [string, string, ...string[]];
}

const quickActions: QuickActionItem[] = [
    {
        id: "1",
        title: "Send",
        icon: "solar:arrow-up-bold",
        route: "/home/send",
        color: "#FF6B6B",
        bgColor: "#FFE5E5",
    },
    {
        id: "2",
        title: "Receive",
        icon: "solar:arrow-down-bold",
        route: "/home/receive",
        color: "#4ECDC4",
        bgColor: "#E5F9F6",
    },
    {
        id: "3",
        title: "QR Pay",
        icon: "solar:qr-code-bold",
        route: "/home/qrScanner",
        color: "#45B7D1",
        bgColor: "#E5F3FF",
    },
    {
        id: "4",
        title: "Top Up",
        icon: "solar:card-bold",
        route: "/home/topup",
        color: "#96CEB4",
        bgColor: "#F0FFF4",
    },
];

const ecosystemServices: ServiceGridItem[] = [
    {
        id: "1",
        title: "DeFi Hub",
        subtitle: "Earn & Trade",
        icon: "solar:chart-2-bold-duotone",
        route: "/ecosystem/defi",
        gradient: ["#667eea", "#764ba2"] as const,
    },
    {
        id: "2",
        title: "Mini Apps",
        subtitle: "Games & Tools",
        icon: "solar:widget-3-bold-duotone",
        route: "/ecosystem/miniapps",
        gradient: ["#f093fb", "#f5576c"] as const,
    },
    {
        id: "3",
        title: "NFT Market",
        subtitle: "Discover & Trade",
        icon: "solar:gallery-bold-duotone",
        route: "/ecosystem/nft",
        gradient: ["#4facfe", "#00f2fe"] as const,
    },
    {
        id: "4",
        title: "Loyalty",
        subtitle: "Points & Rewards",
        icon: "solar:star-bold-duotone",
        route: "/rewards",
        gradient: ["#fa709a", "#fee140"] as const,
    },
    {
        id: "5",
        title: "Bills & Pay",
        subtitle: "Utilities & More",
        icon: "solar:bill-list-bold-duotone",
        route: "/ecosystem/bills",
        gradient: ["#a8edea", "#fed6e3"] as const,
    },
    {
        id: "6",
        title: "Marketplace",
        subtitle: "Shop & Services",
        icon: "solar:shop-bold-duotone",
        route: "/ecosystem/marketplace",
        gradient: ["#d299c2", "#fef9d7"] as const,
    },
];

const HomeScreen = () => {
    const { activeWallet } = useMultiWalletStore();

    const renderQuickAction = (item: QuickActionItem) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.quickActionItem, { backgroundColor: item.bgColor }]}
                onPress={() => router.push(item.route as any)}
            >
                {item.id === "1" && <ArrowUp size={24} color={item.color} />}
                {item.id === "2" && <ArrowDown size={24} color={item.color} />}
                {item.id === "3" && <QrCode size={24} color={item.color} />}
                {item.id === "4" && <CreditCard size={24} color={item.color} />}
                <Text style={[styles.quickActionText, { color: item.color }]}>{item.title}</Text>
            </TouchableOpacity>
        );
    };

    const renderServiceCard = (item: ServiceGridItem) => {
        return (
            <TouchableOpacity key={item.id} style={styles.serviceCard} onPress={() => router.push(item.route as any)}>
                <LinearGradient colors={item.gradient} style={styles.serviceGradient}>
                    {item.id === "1" && <BarChart3 size={32} color="white" />}
                    {item.id === "2" && <Grid3X3 size={32} color="white" />}
                    {item.id === "3" && <Image size={32} color="white" />}
                    {item.id === "4" && <Star size={32} color="white" />}
                    {item.id === "5" && <FileText size={32} color="white" />}
                    {item.id === "6" && <ShoppingBag size={32} color="white" />}
                    <View style={styles.serviceTextContainer}>
                        <Text style={styles.serviceTitle}>{item.title}</Text>
                        <Text style={styles.serviceSubtitle}>{item.subtitle}</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Welcome back!</Text>
                        <Text style={styles.userText}>{activeWallet?.name || "User"}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.notificationBtn}
                        onPress={() => router.push("/profile/notifications" as any)}
                    >
                        <Bell size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <LinearGradient
                        colors={["#667eea", "#764ba2"] as const}
                        style={styles.balanceGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.balanceHeader}>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <TouchableOpacity>
                                <Eye size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.balanceValue}>$0.00</Text>
                        <View style={styles.balanceFooter}>
                            <Text style={styles.portfolioText}>Portfolio Performance</Text>
                            <Text style={styles.performanceText}>+12.5% ↗</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActionsGrid}>{quickActions.map(renderQuickAction)}</View>
                </View>

                {/* Ecosystem Services */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Bitriel Ecosystem</Text>
                        <TouchableOpacity onPress={() => router.push("/ecosystem" as any)}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.servicesGrid}>{ecosystemServices.map(renderServiceCard)}</View>
                </View>

                {/* Recent Activity */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <TouchableOpacity onPress={() => router.push("/wallet/transactions" as any)}>
                            <Text style={styles.seeAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.activityCard}>
                        <Text style={styles.noActivityText}>No recent transactions</Text>
                        <Text style={styles.noActivitySubtext}>Your transaction history will appear here</Text>
                    </View>
                </View>

                {/* Rewards Banner */}
                <TouchableOpacity style={styles.rewardsBanner} onPress={() => router.push("/rewards" as any)}>
                    <LinearGradient
                        colors={["#fa709a", "#fee140"] as const}
                        style={styles.rewardsGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.rewardsContent}>
                            <Gift size={40} color="white" />
                            <View style={styles.rewardsText}>
                                <Text style={styles.rewardsTitle}>Earn Rewards!</Text>
                                <Text style={styles.rewardsSubtitle}>
                                    Get points for every transaction and redeem amazing rewards
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
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
        paddingBottom: 100,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "white",
    },
    welcomeText: {
        fontSize: 16,
        color: "#8E8E93",
        fontFamily: "SpaceGrotesk-Regular",
    },
    userText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1C1C1E",
        fontFamily: "SpaceGrotesk-Bold",
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
    },
    balanceCard: {
        margin: 20,
        borderRadius: 20,
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    balanceGradient: {
        padding: 24,
    },
    balanceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    balanceLabel: {
        fontSize: 16,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "SpaceGrotesk-Regular",
    },
    balanceValue: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
        marginVertical: 8,
    },
    balanceFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
    },
    portfolioText: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "SpaceGrotesk-Regular",
    },
    performanceText: {
        fontSize: 14,
        color: "#4ECDC4",
        fontWeight: "bold",
        fontFamily: "SpaceGrotesk-SemiBold",
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1C1C1E",
        fontFamily: "SpaceGrotesk-Bold",
    },
    seeAllText: {
        fontSize: 16,
        color: Colors.primary,
        fontFamily: "SpaceGrotesk-Medium",
    },
    quickActionsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    quickActionItem: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 20,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 8,
        fontFamily: "SpaceGrotesk-SemiBold",
    },
    servicesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    serviceCard: {
        width: (width - 56) / 2,
        marginBottom: 16,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    serviceGradient: {
        padding: 20,
        minHeight: 120,
        justifyContent: "space-between",
    },
    serviceTextContainer: {
        marginTop: 12,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
    },
    serviceSubtitle: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
        marginTop: 4,
        fontFamily: "SpaceGrotesk-Regular",
    },
    activityCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 100,
    },
    noActivityText: {
        fontSize: 16,
        color: "#8E8E93",
        fontFamily: "SpaceGrotesk-Medium",
    },
    noActivitySubtext: {
        fontSize: 14,
        color: "#C7C7CC",
        marginTop: 4,
        fontFamily: "SpaceGrotesk-Regular",
    },
    rewardsBanner: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 24,
    },
    rewardsGradient: {
        padding: 20,
    },
    rewardsContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    rewardsText: {
        flex: 1,
        marginLeft: 16,
    },
    rewardsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
    },
    rewardsSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.9)",
        marginTop: 4,
        fontFamily: "SpaceGrotesk-Regular",
    },
});

export default HomeScreen;
