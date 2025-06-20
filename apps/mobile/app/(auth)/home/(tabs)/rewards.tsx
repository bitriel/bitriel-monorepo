import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Dimensions,
    FlatList,
} from "react-native";
import { router } from "expo-router";
import { Gift, Star, Check, Clock, Crown, Plus, Share } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "~/src/constants/Colors";

const { width } = Dimensions.get("window");

interface RewardItem {
    id: string;
    title: string;
    subtitle: string;
    points: number;
    category: string;
    image?: string;
    isLimited?: boolean;
    discount?: number;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    maxProgress: number;
    reward: number;
    completed: boolean;
}

const rewardCategories = ["All", "Vouchers", "Cashback", "Digital", "Physical", "Crypto"];

const mockRewards: RewardItem[] = [
    {
        id: "1",
        title: "Starbucks Gift Card",
        subtitle: "$10 Coffee Voucher",
        points: 500,
        category: "Vouchers",
        discount: 20,
    },
    {
        id: "2",
        title: "Netflix Premium",
        subtitle: "1 Month Subscription",
        points: 1200,
        category: "Digital",
        isLimited: true,
    },
    {
        id: "3",
        title: "1 SEL Token",
        subtitle: "Native chain token",
        points: 100,
        category: "Crypto",
    },
    {
        id: "4",
        title: "Grab Ride Voucher",
        subtitle: "$5 Transportation Credit",
        points: 300,
        category: "Vouchers",
    },
    {
        id: "5",
        title: "Cashback Boost",
        subtitle: "2% extra cashback for 1 week",
        points: 800,
        category: "Cashback",
        isLimited: true,
    },
    {
        id: "6",
        title: "iPhone 15 Case",
        subtitle: "Premium protection case",
        points: 2500,
        category: "Physical",
    },
];

const mockAchievements: Achievement[] = [
    {
        id: "1",
        title: "First Transaction",
        description: "Complete your first transaction",
        icon: "solar:wallet-money-bold-duotone",
        progress: 1,
        maxProgress: 1,
        reward: 50,
        completed: true,
    },
    {
        id: "2",
        title: "Transaction Streak",
        description: "Make transactions for 7 consecutive days",
        icon: "solar:fire-bold-duotone",
        progress: 5,
        maxProgress: 7,
        reward: 200,
        completed: false,
    },
    {
        id: "3",
        title: "Referral Master",
        description: "Refer 5 friends to Bitriel",
        icon: "solar:users-group-rounded-bold-duotone",
        progress: 2,
        maxProgress: 5,
        reward: 500,
        completed: false,
    },
    {
        id: "4",
        title: "DeFi Explorer",
        description: "Use 3 different DeFi services",
        icon: "solar:chart-2-bold-duotone",
        progress: 1,
        maxProgress: 3,
        reward: 300,
        completed: false,
    },
];

const RewardsScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [userPoints] = useState(1500);
    const [userTier] = useState("Gold");
    const [currentTab, setCurrentTab] = useState<"rewards" | "achievements" | "history">("rewards");

    const filteredRewards =
        selectedCategory === "All" ? mockRewards : mockRewards.filter(reward => reward.category === selectedCategory);

    const renderRewardCard = ({ item }: { item: RewardItem }) => (
        <TouchableOpacity style={styles.rewardCard} onPress={() => router.push(`/rewards/details/${item.id}` as any)}>
            <View style={styles.rewardHeader}>
                <View style={styles.rewardImagePlaceholder}>
                    <Gift size={24} color={Colors.primary} />
                </View>
                <View style={styles.rewardBadges}>
                    {item.isLimited && (
                        <View style={styles.limitedBadge}>
                            <Text style={styles.limitedText}>LIMITED</Text>
                        </View>
                    )}
                    {item.discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{item.discount}% OFF</Text>
                        </View>
                    )}
                </View>
            </View>
            <Text style={styles.rewardTitle}>{item.title}</Text>
            <Text style={styles.rewardSubtitle}>{item.subtitle}</Text>
            <View style={styles.rewardFooter}>
                <View style={styles.pointsContainer}>
                    <Star size={16} color="#FFD700" />
                    <Text style={styles.pointsText}>{item.points} points</Text>
                </View>
                <TouchableOpacity
                    style={[styles.redeemButton, { opacity: userPoints >= item.points ? 1 : 0.5 }]}
                    disabled={userPoints < item.points}
                >
                    <Text style={styles.redeemButtonText}>Redeem</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderAchievement = (achievement: Achievement) => (
        <TouchableOpacity key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementHeader}>
                {/* Achievement icon placeholder */}
                {achievement.completed && (
                    <View style={styles.completedBadge}>
                        <Check size={20} color="#4CAF50" />
                    </View>
                )}
            </View>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${(achievement.progress / achievement.maxProgress) * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {achievement.progress}/{achievement.maxProgress}
                </Text>
            </View>
            <View style={styles.rewardInfo}>
                <Star size={14} color="#FFD700" />
                <Text style={styles.rewardPointsText}>+{achievement.reward} points</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Rewards Center</Text>
                <TouchableOpacity onPress={() => router.push("/rewards/history" as any)}>
                    <Clock size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Points & Tier Card */}
                <View style={styles.pointsCard}>
                    <LinearGradient
                        colors={["#667eea", "#764ba2"] as const}
                        style={styles.pointsGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.pointsHeader}>
                            <View>
                                <Text style={styles.pointsLabel}>Your Points</Text>
                                <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
                            </View>
                            <View style={styles.tierBadge}>
                                <Crown size={16} color="#FFD700" />
                                <Text style={styles.tierText}>{userTier}</Text>
                            </View>
                        </View>

                        <View style={styles.pointsActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => router.push("/rewards/earn" as any)}
                            >
                                <Plus size={20} color="white" />
                                <Text style={styles.actionButtonText}>Earn More</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => router.push("/rewards/referral" as any)}
                            >
                                <Share size={20} color="white" />
                                <Text style={styles.actionButtonText}>Refer Friends</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.nextTierProgress}>
                            <Text style={styles.nextTierText}>2,500 points to Platinum tier</Text>
                            <View style={styles.tierProgressBar}>
                                <View style={[styles.tierProgressFill, { width: "60%" }]} />
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    {[
                        { key: "rewards", label: "Rewards", icon: "solar:gift-bold-duotone" },
                        { key: "achievements", label: "Achievements", icon: "solar:medal-star-bold-duotone" },
                        { key: "history", label: "History", icon: "solar:clock-circle-bold-duotone" },
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tab, currentTab === tab.key && styles.activeTab]}
                            onPress={() => setCurrentTab(tab.key as any)}
                        >
                            {tab.key === "rewards" && (
                                <Gift size={20} color={currentTab === tab.key ? Colors.primary : "#8E8E93"} />
                            )}
                            {tab.key === "achievements" && (
                                <Star size={20} color={currentTab === tab.key ? Colors.primary : "#8E8E93"} />
                            )}
                            {tab.key === "history" && (
                                <Clock size={20} color={currentTab === tab.key ? Colors.primary : "#8E8E93"} />
                            )}
                            <Text style={[styles.tabText, currentTab === tab.key && styles.activeTabText]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Content based on selected tab */}
                {currentTab === "rewards" && (
                    <>
                        {/* Category Filter */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryScroll}
                            contentContainerStyle={styles.categoryContainer}
                        >
                            {rewardCategories.map(category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategory === category && styles.activeCategoryChip,
                                    ]}
                                    onPress={() => setSelectedCategory(category)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            selectedCategory === category && styles.activeCategoryChipText,
                                        ]}
                                    >
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Rewards Grid */}
                        <FlatList
                            data={filteredRewards}
                            renderItem={renderRewardCard}
                            keyExtractor={item => item.id}
                            numColumns={2}
                            columnWrapperStyle={styles.rewardRow}
                            contentContainerStyle={styles.rewardsGrid}
                            scrollEnabled={false}
                        />
                    </>
                )}

                {currentTab === "achievements" && (
                    <View style={styles.achievementsContainer}>
                        {mockAchievements.map(achievement => (
                            <View key={achievement.id}>{renderAchievement(achievement)}</View>
                        ))}
                    </View>
                )}

                {currentTab === "history" && (
                    <View style={styles.historyContainer}>
                        <Text style={styles.emptyText}>No redemption history yet</Text>
                        <Text style={styles.emptySubtext}>
                            Start earning and redeeming rewards to see your history here
                        </Text>
                    </View>
                )}
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
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E7",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1C1C1E",
        fontFamily: "SpaceGrotesk-Bold",
    },
    scrollContent: {
        paddingBottom: 100,
    },
    pointsCard: {
        margin: 20,
        borderRadius: 20,
        overflow: "hidden",
    },
    pointsGradient: {
        padding: 24,
    },
    pointsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    pointsLabel: {
        fontSize: 16,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "SpaceGrotesk-Regular",
    },
    pointsValue: {
        fontSize: 36,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
    },
    tierBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    tierText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
    },
    pointsActions: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
        fontFamily: "SpaceGrotesk-SemiBold",
    },
    nextTierProgress: {
        gap: 8,
    },
    nextTierText: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "SpaceGrotesk-Regular",
    },
    tierProgressBar: {
        height: 6,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 3,
        overflow: "hidden",
    },
    tierProgressFill: {
        height: "100%",
        backgroundColor: "#4ECDC4",
        borderRadius: 3,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },
    activeTab: {
        backgroundColor: "#F2F2F7",
    },
    tabText: {
        fontSize: 14,
        color: "#8E8E93",
        fontFamily: "SpaceGrotesk-Medium",
    },
    activeTabText: {
        color: Colors.primary,
        fontFamily: "SpaceGrotesk-SemiBold",
    },
    categoryScroll: {
        marginBottom: 20,
    },
    categoryContainer: {
        paddingHorizontal: 20,
        gap: 12,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "white",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E5E5E7",
    },
    activeCategoryChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryChipText: {
        fontSize: 14,
        color: "#8E8E93",
        fontFamily: "SpaceGrotesk-Medium",
    },
    activeCategoryChipText: {
        color: "white",
        fontFamily: "SpaceGrotesk-SemiBold",
    },
    rewardsGrid: {
        paddingHorizontal: 20,
    },
    rewardRow: {
        justifyContent: "space-between",
    },
    rewardCard: {
        width: (width - 56) / 2,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    rewardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    rewardImagePlaceholder: {
        width: 48,
        height: 48,
        backgroundColor: "#F2F2F7",
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    rewardBadges: {
        gap: 4,
    },
    limitedBadge: {
        backgroundColor: "#FF4B55",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    limitedText: {
        fontSize: 8,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
    },
    discountBadge: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        fontSize: 8,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
    },
    rewardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1C1C1E",
        marginBottom: 4,
        fontFamily: "SpaceGrotesk-Bold",
    },
    rewardSubtitle: {
        fontSize: 12,
        color: "#8E8E93",
        marginBottom: 12,
        fontFamily: "SpaceGrotesk-Regular",
    },
    rewardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pointsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    pointsText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1C1C1E",
        fontFamily: "SpaceGrotesk-SemiBold",
    },
    redeemButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    redeemButtonText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
    },
    achievementsContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
    achievementCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
    },
    achievementHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    completedBadge: {
        backgroundColor: "#E8F5E8",
        borderRadius: 20,
        padding: 4,
    },
    achievementTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1C1C1E",
        marginBottom: 4,
        fontFamily: "SpaceGrotesk-Bold",
    },
    achievementDescription: {
        fontSize: 14,
        color: "#8E8E93",
        marginBottom: 16,
        fontFamily: "SpaceGrotesk-Regular",
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: "#F2F2F7",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#8E8E93",
        fontFamily: "SpaceGrotesk-SemiBold",
    },
    rewardInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    rewardPointsText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFD700",
        fontFamily: "SpaceGrotesk-SemiBold",
    },
    historyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#8E8E93",
        textAlign: "center",
        marginBottom: 8,
        fontFamily: "SpaceGrotesk-Bold",
    },
    emptySubtext: {
        fontSize: 14,
        color: "#C7C7CC",
        textAlign: "center",
        lineHeight: 20,
        fontFamily: "SpaceGrotesk-Regular",
    },
});

export default RewardsScreen;
