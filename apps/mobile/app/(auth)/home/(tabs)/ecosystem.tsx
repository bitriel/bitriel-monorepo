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
    TextInput,
} from "react-native";
import { router } from "expo-router";
import { Search, Star, DollarSign, ShoppingBag, Gamepad2, Settings, ChevronUp, ChevronDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "~/src/constants/Colors";

const { width } = Dimensions.get("window");

interface EcosystemCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    gradient: readonly [string, string, ...string[]];
    services: EcosystemService[];
}

interface EcosystemService {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    route: string;
    isNew?: boolean;
    isFavorite?: boolean;
}

const ecosystemCategories: EcosystemCategory[] = [
    {
        id: "financial",
        title: "Financial Services",
        description: "DeFi, Trading & Investment Tools",
        icon: "solar:wallet-money-bold-duotone",
        color: "#667eea",
        gradient: ["#667eea", "#764ba2"] as const,
        services: [
            {
                id: "defi",
                title: "DeFi Hub",
                subtitle: "Earn, stake & trade",
                icon: "solar:chart-2-bold-duotone",
                route: "/ecosystem/defi",
                isNew: true,
            },
            {
                id: "trading",
                title: "Advanced Trading",
                subtitle: "Pro trading tools",
                icon: "solar:graph-up-bold-duotone",
                route: "/ecosystem/trading",
            },
            {
                id: "lending",
                title: "Lending",
                subtitle: "Lend & borrow crypto",
                icon: "solar:hand-money-bold-duotone",
                route: "/ecosystem/lending",
            },
            {
                id: "savings",
                title: "Crypto Savings",
                subtitle: "High yield accounts",
                icon: "solar:safe-2-bold-duotone",
                route: "/ecosystem/savings",
            },
        ],
    },
    {
        id: "marketplace",
        title: "Marketplace & Services",
        description: "Shop, Pay Bills & More",
        icon: "solar:shop-bold-duotone",
        color: "#f093fb",
        gradient: ["#f093fb", "#f5576c"] as const,
        services: [
            {
                id: "marketplace",
                title: "Marketplace",
                subtitle: "Shop with crypto",
                icon: "solar:shop-2-bold-duotone",
                route: "/ecosystem/marketplace",
            },
            {
                id: "bills",
                title: "Bill Payments",
                subtitle: "Pay utilities & more",
                icon: "solar:bill-list-bold-duotone",
                route: "/ecosystem/bills",
            },
            {
                id: "prepaid",
                title: "Mobile Top-up",
                subtitle: "Prepaid & postpaid",
                icon: "solar:phone-bold-duotone",
                route: "/ecosystem/prepaid",
            },
            {
                id: "travel",
                title: "Travel & Booking",
                subtitle: "Hotels, flights & more",
                icon: "solar:plane-bold-duotone",
                route: "/ecosystem/travel",
            },
        ],
    },
    {
        id: "entertainment",
        title: "Entertainment & Gaming",
        description: "Games, NFTs & Digital Content",
        icon: "solar:gameboy-bold-duotone",
        color: "#4facfe",
        gradient: ["#4facfe", "#00f2fe"] as const,
        services: [
            {
                id: "games",
                title: "Web3 Games",
                subtitle: "Play to earn",
                icon: "solar:gameboy-bold-duotone",
                route: "/ecosystem/games",
                isNew: true,
            },
            {
                id: "nft",
                title: "NFT Marketplace",
                subtitle: "Buy, sell & trade NFTs",
                icon: "solar:gallery-bold-duotone",
                route: "/ecosystem/nft",
            },
            {
                id: "streaming",
                title: "Streaming",
                subtitle: "Music & video",
                icon: "solar:play-bold-duotone",
                route: "/ecosystem/streaming",
            },
            {
                id: "events",
                title: "Events & Tickets",
                subtitle: "Concerts, sports & more",
                icon: "solar:ticket-bold-duotone",
                route: "/ecosystem/events",
            },
        ],
    },
    {
        id: "tools",
        title: "Tools & Utilities",
        description: "Mini Apps & Developer Tools",
        icon: "solar:widget-3-bold-duotone",
        color: "#fa709a",
        gradient: ["#fa709a", "#fee140"] as const,
        services: [
            {
                id: "miniapps",
                title: "Mini Apps",
                subtitle: "Lightweight tools",
                icon: "solar:widget-3-bold-duotone",
                route: "/ecosystem/miniapps",
            },
            {
                id: "analytics",
                title: "Portfolio Analytics",
                subtitle: "Track & analyze",
                icon: "solar:chart-square-bold-duotone",
                route: "/ecosystem/analytics",
            },
            {
                id: "dev-tools",
                title: "Developer Tools",
                subtitle: "Build on Bitriel",
                icon: "solar:code-bold-duotone",
                route: "/ecosystem/dev-tools",
            },
            {
                id: "api",
                title: "API Access",
                subtitle: "Integrate our services",
                icon: "solar:server-bold-duotone",
                route: "/ecosystem/api",
            },
        ],
    },
];

const EcosystemScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredCategories = selectedCategory
        ? ecosystemCategories.filter(cat => cat.id === selectedCategory)
        : ecosystemCategories;

    const renderCategoryHeader = (category: EcosystemCategory) => (
        <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
        >
            <LinearGradient colors={category.gradient} style={styles.categoryGradient}>
                <View style={styles.categoryContent}>
                    <View style={styles.categoryHeader}>
                        {category.id === "financial" && <DollarSign size={28} color="white" />}
                        {category.id === "marketplace" && <ShoppingBag size={28} color="white" />}
                        {category.id === "entertainment" && <Gamepad2 size={28} color="white" />}
                        {category.id === "tools" && <Settings size={28} color="white" />}
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                    </View>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                    <View style={styles.categoryFooter}>
                        <Text style={styles.serviceCount}>{category.services.length} services</Text>
                        {selectedCategory === category.id ? (
                            <ChevronUp size={16} color="rgba(255,255,255,0.8)" />
                        ) : (
                            <ChevronDown size={16} color="rgba(255,255,255,0.8)" />
                        )}
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    const renderServiceGrid = (services: EcosystemService[]) => (
        <View style={styles.servicesGrid}>
            {services.map(service => (
                <TouchableOpacity
                    key={service.id}
                    style={styles.serviceCard}
                    onPress={() => router.push(service.route as any)}
                >
                    <View style={styles.serviceHeader}>
                        {/* <Icon placeholder - service icons disabled temporarily /> */}
                        {service.isNew && (
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>NEW</Text>
                            </View>
                        )}
                        {service.isFavorite && <Star size={16} color="#FFD700" />}
                    </View>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bitriel Ecosystem</Text>
                <TouchableOpacity onPress={() => router.push("/ecosystem/favorites" as any)}>
                    <Star size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search size={20} color="#8E8E93" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search ecosystem services..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#8E8E93"
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>25+</Text>
                        <Text style={styles.statLabel}>Services</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>50K+</Text>
                        <Text style={styles.statLabel}>Users</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>$10M+</Text>
                        <Text style={styles.statLabel}>Volume</Text>
                    </View>
                </View>

                {/* Categories */}
                {filteredCategories.map(category => (
                    <View key={category.id} style={styles.categorySection}>
                        {renderCategoryHeader(category)}
                        {selectedCategory === category.id && renderServiceGrid(category.services)}
                    </View>
                ))}

                {/* All Categories View */}
                {!selectedCategory && (
                    <View style={styles.allServicesSection}>
                        <Text style={styles.sectionTitle}>All Services</Text>
                        {ecosystemCategories.map(category => (
                            <View key={`all-${category.id}`}>{renderServiceGrid(category.services)}</View>
                        ))}
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        marginHorizontal: 20,
        marginVertical: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#1C1C1E",
        fontFamily: "SpaceGrotesk-Regular",
    },
    scrollContent: {
        paddingBottom: 100,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 4,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.primary,
        fontFamily: "SpaceGrotesk-Bold",
    },
    statLabel: {
        fontSize: 12,
        color: "#8E8E93",
        marginTop: 4,
        fontFamily: "SpaceGrotesk-Regular",
    },
    categorySection: {
        marginBottom: 16,
    },
    categoryCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    categoryGradient: {
        padding: 20,
    },
    categoryContent: {
        gap: 12,
    },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
    },
    categoryDescription: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "SpaceGrotesk-Regular",
    },
    categoryFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    serviceCount: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "SpaceGrotesk-Regular",
    },
    servicesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    serviceCard: {
        width: (width - 56) / 2,
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    serviceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    newBadge: {
        backgroundColor: "#FF4B55",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    newBadgeText: {
        fontSize: 8,
        fontWeight: "bold",
        color: "white",
        fontFamily: "SpaceGrotesk-Bold",
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1C1C1E",
        marginBottom: 4,
        fontFamily: "SpaceGrotesk-Bold",
    },
    serviceSubtitle: {
        fontSize: 12,
        color: "#8E8E93",
        fontFamily: "SpaceGrotesk-Regular",
    },
    allServicesSection: {
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1C1C1E",
        marginBottom: 16,
        paddingHorizontal: 20,
        fontFamily: "SpaceGrotesk-Bold",
    },
});

export default EcosystemScreen;
