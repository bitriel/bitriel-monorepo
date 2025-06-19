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
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, TrendingUp, Zap, Shield, DollarSign, BarChart3, Star, ChevronRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "~/src/constants/Colors";

const { width } = Dimensions.get("window");

interface DeFiPool {
    id: string;
    name: string;
    protocol: string;
    apr: number;
    tvl: string;
    risk: "Low" | "Medium" | "High";
    tokens: string[];
    featured?: boolean;
}

interface DeFiStrategy {
    id: string;
    title: string;
    description: string;
    expectedReturn: number;
    risk: string;
    duration: string;
    minAmount: string;
    color: string;
}

const defiPools: DeFiPool[] = [
    {
        id: "1",
        name: "USDC/USDT",
        protocol: "BitrielSwap",
        apr: 12.5,
        tvl: "$2.3M",
        risk: "Low",
        tokens: ["USDC", "USDT"],
        featured: true,
    },
    {
        id: "2",
        name: "SEL/ETH",
        protocol: "UniswapV3",
        apr: 24.8,
        tvl: "$890K",
        risk: "Medium",
        tokens: ["SEL", "ETH"],
        featured: true,
    },
    {
        id: "3",
        name: "BTC/ETH",
        protocol: "SushiSwap",
        apr: 18.2,
        tvl: "$1.5M",
        risk: "Medium",
        tokens: ["BTC", "ETH"],
    },
    {
        id: "4",
        name: "MATIC Staking",
        protocol: "Lido",
        apr: 8.7,
        tvl: "$3.2M",
        risk: "Low",
        tokens: ["MATIC"],
    },
];

const defiStrategies: DeFiStrategy[] = [
    {
        id: "1",
        title: "Conservative Yield",
        description: "Low-risk stable coin farming with automated compound",
        expectedReturn: 8.5,
        risk: "Low",
        duration: "Flexible",
        minAmount: "$100",
        color: "#4CAF50",
    },
    {
        id: "2",
        title: "Balanced Growth",
        description: "Diversified DeFi portfolio with moderate risk",
        expectedReturn: 15.2,
        risk: "Medium",
        duration: "30 days",
        minAmount: "$500",
        color: "#FF9800",
    },
    {
        id: "3",
        title: "High Yield Pro",
        description: "Advanced strategies for experienced users",
        expectedReturn: 28.7,
        risk: "High",
        duration: "90 days",
        minAmount: "$1,000",
        color: "#F44336",
    },
];

const DeFiScreen = () => {
    const [selectedTab, setSelectedTab] = useState<"pools" | "strategies" | "portfolio">("pools");
    const [userStats] = useState({
        totalStaked: "$5,240.00",
        totalEarned: "$324.50",
        activePositions: 3,
        avgAPR: 16.8,
    });

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>DeFi Hub</Text>
            <View style={styles.placeholder} />
        </View>
    );

    const renderUserStats = () => (
        <View style={styles.statsContainer}>
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.statsGradient}>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStats.totalStaked}</Text>
                        <Text style={styles.statLabel}>Total Staked</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStats.totalEarned}</Text>
                        <Text style={styles.statLabel}>Total Earned</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStats.activePositions}</Text>
                        <Text style={styles.statLabel}>Active Positions</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStats.avgAPR}%</Text>
                        <Text style={styles.statLabel}>Avg APR</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );

    const renderTabs = () => (
        <View style={styles.tabsContainer}>
            {[
                { key: "pools", label: "Liquidity Pools" },
                { key: "strategies", label: "Strategies" },
                { key: "portfolio", label: "My Portfolio" },
            ].map(tab => (
                <TouchableOpacity
                    key={tab.key}
                    style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
                    onPress={() => setSelectedTab(tab.key as any)}
                >
                    <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderPoolCard = (pool: DeFiPool) => (
        <TouchableOpacity key={pool.id} style={styles.poolCard}>
            <View style={styles.poolHeader}>
                <View>
                    <Text style={styles.poolName}>{pool.name}</Text>
                    <Text style={styles.poolProtocol}>{pool.protocol}</Text>
                </View>
                {pool.featured && (
                    <View style={styles.featuredBadge}>
                        <Star size={12} color="#FFD700" />
                        <Text style={styles.featuredText}>Featured</Text>
                    </View>
                )}
            </View>

            <View style={styles.poolStats}>
                <View style={styles.poolStat}>
                    <Text style={styles.poolStatValue}>{pool.apr}%</Text>
                    <Text style={styles.poolStatLabel}>APR</Text>
                </View>
                <View style={styles.poolStat}>
                    <Text style={styles.poolStatValue}>{pool.tvl}</Text>
                    <Text style={styles.poolStatLabel}>TVL</Text>
                </View>
                <View style={styles.poolStat}>
                    <View style={[styles.riskBadge, styles[`risk${pool.risk}` as keyof typeof styles]]}>
                        <Text style={styles.riskText}>{pool.risk}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.poolTokens}>
                {pool.tokens.map((token, index) => (
                    <View key={token} style={styles.tokenBadge}>
                        <Text style={styles.tokenText}>{token}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    const renderStrategyCard = (strategy: DeFiStrategy) => (
        <TouchableOpacity key={strategy.id} style={styles.strategyCard}>
            <View style={styles.strategyHeader}>
                <View style={[styles.strategyIcon, { backgroundColor: strategy.color }]}>
                    <BarChart3 size={20} color="white" />
                </View>
                <View style={styles.strategyInfo}>
                    <Text style={styles.strategyTitle}>{strategy.title}</Text>
                    <Text style={styles.strategyDescription}>{strategy.description}</Text>
                </View>
                <ChevronRight size={20} color="#8E8E93" />
            </View>

            <View style={styles.strategyStats}>
                <View style={styles.strategyStat}>
                    <Text style={[styles.strategyStatValue, { color: strategy.color }]}>
                        {strategy.expectedReturn}%
                    </Text>
                    <Text style={styles.strategyStatLabel}>Expected Return</Text>
                </View>
                <View style={styles.strategyStat}>
                    <Text style={styles.strategyStatValue}>{strategy.duration}</Text>
                    <Text style={styles.strategyStatLabel}>Duration</Text>
                </View>
                <View style={styles.strategyStat}>
                    <Text style={styles.strategyStatValue}>{strategy.minAmount}</Text>
                    <Text style={styles.strategyStatLabel}>Min Amount</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderPortfolio = () => (
        <View style={styles.portfolioContainer}>
            <View style={styles.portfolioSummary}>
                <Text style={styles.portfolioTitle}>Your DeFi Portfolio</Text>
                <View style={styles.portfolioValue}>
                    <TrendingUp size={24} color="#4CAF50" />
                    <Text style={styles.portfolioValueText}>{userStats.totalStaked}</Text>
                    <Text style={styles.portfolioGrowth}>+12.4%</Text>
                </View>
            </View>

            <View style={styles.positionsList}>
                {defiPools.slice(0, 2).map(pool => (
                    <TouchableOpacity key={pool.id} style={styles.positionCard}>
                        <View style={styles.positionHeader}>
                            <Text style={styles.positionName}>{pool.name}</Text>
                            <Text style={styles.positionProtocol}>{pool.protocol}</Text>
                        </View>
                        <View style={styles.positionStats}>
                            <View>
                                <Text style={styles.positionAmount}>$1,250.00</Text>
                                <Text style={styles.positionLabel}>Staked</Text>
                            </View>
                            <View style={styles.positionReturns}>
                                <Text style={styles.positionReturnsValue}>+$125.40</Text>
                                <Text style={styles.positionReturnsPercent}>+10.03%</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.headerGradient}>
                {renderHeader()}
                {renderUserStats()}
            </LinearGradient>

            {renderTabs()}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {selectedTab === "pools" && (
                    <View>
                        <Text style={styles.sectionTitle}>Featured Pools</Text>
                        {defiPools.filter(pool => pool.featured).map(renderPoolCard)}

                        <Text style={styles.sectionTitle}>All Pools</Text>
                        {defiPools.filter(pool => !pool.featured).map(renderPoolCard)}
                    </View>
                )}

                {selectedTab === "strategies" && (
                    <View>
                        <Text style={styles.sectionTitle}>Investment Strategies</Text>
                        {defiStrategies.map(renderStrategyCard)}
                    </View>
                )}

                {selectedTab === "portfolio" && renderPortfolio()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    headerGradient: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    placeholder: {
        width: 40,
    },
    statsContainer: {
        marginHorizontal: 20,
    },
    statsGradient: {
        borderRadius: 16,
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    statItem: {
        width: "50%",
        alignItems: "center",
        marginBottom: 16,
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
    },
    tabsContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
        marginTop: -10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#8E8E93",
    },
    activeTabText: {
        color: "white",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 16,
        marginTop: 8,
    },
    poolCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    poolHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    poolName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 2,
    },
    poolProtocol: {
        fontSize: 12,
        color: "#8E8E93",
    },
    featuredBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF3CD",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    featuredText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#856404",
        marginLeft: 4,
    },
    poolStats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    poolStat: {
        alignItems: "center",
    },
    poolStatValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    poolStatLabel: {
        fontSize: 12,
        color: "#8E8E93",
    },
    riskBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    riskLow: {
        backgroundColor: "#E8F5E8",
    },
    riskMedium: {
        backgroundColor: "#FFF3CD",
    },
    riskHigh: {
        backgroundColor: "#FFEBEE",
    },
    riskText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1A1A1A",
    },
    poolTokens: {
        flexDirection: "row",
    },
    tokenBadge: {
        backgroundColor: "#F2F2F7",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
    },
    tokenText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#1A1A1A",
    },
    strategyCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    strategyHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    strategyIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    strategyInfo: {
        flex: 1,
    },
    strategyTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    strategyDescription: {
        fontSize: 14,
        color: "#8E8E93",
        lineHeight: 20,
    },
    strategyStats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    strategyStat: {
        alignItems: "center",
    },
    strategyStatValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    strategyStatLabel: {
        fontSize: 12,
        color: "#8E8E93",
    },
    portfolioContainer: {
        paddingBottom: 40,
    },
    portfolioSummary: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    portfolioTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 16,
    },
    portfolioValue: {
        flexDirection: "row",
        alignItems: "center",
    },
    portfolioValueText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginLeft: 8,
        marginRight: 12,
    },
    portfolioGrowth: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4CAF50",
    },
    positionsList: {
        gap: 16,
    },
    positionCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    positionHeader: {
        marginBottom: 12,
    },
    positionName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 2,
    },
    positionProtocol: {
        fontSize: 12,
        color: "#8E8E93",
    },
    positionStats: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    positionAmount: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 2,
    },
    positionLabel: {
        fontSize: 12,
        color: "#8E8E93",
    },
    positionReturns: {
        alignItems: "flex-end",
    },
    positionReturnsValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4CAF50",
        marginBottom: 2,
    },
    positionReturnsPercent: {
        fontSize: 12,
        color: "#4CAF50",
    },
});

export default DeFiScreen;
