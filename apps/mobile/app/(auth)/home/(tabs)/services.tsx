import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    TextInput,
} from "react-native";
import { router } from "expo-router";
import {
    Search,
    Star,
    DollarSign,
    ShoppingBag,
    Gamepad2,
    Settings,
    ChevronUp,
    ChevronDown,
    Zap,
    Shield,
    Smartphone,
    CreditCard,
    MapPin,
    Music,
    Palette,
    Calculator,
    BarChart3,
    Code,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "~/src/constants/Colors";

const { width } = Dimensions.get("window");

interface ServiceCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    gradient: readonly [string, string, ...string[]];
    services: Service[];
}

interface Service {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    route: string;
    isNew?: boolean;
    isFavorite?: boolean;
    isPopular?: boolean;
}

const serviceCategories: ServiceCategory[] = [
    {
        id: "financial",
        title: "Financial Services",
        description: "Banking, Trading & Payment Solutions",
        icon: "solar:wallet-money-bold-duotone",
        color: "#667eea",
        gradient: ["#667eea", "#764ba2"] as const,
        services: [
            {
                id: "defi",
                title: "DeFi Hub",
                subtitle: "Decentralized finance tools",
                icon: "solar:chart-2-bold-duotone",
                route: "/(auth)/home/services/defi",
                isNew: true,
                isPopular: true,
            },
            {
                id: "trading",
                title: "Advanced Trading",
                subtitle: "Professional trading platform",
                icon: "solar:graph-up-bold-duotone",
                route: "/(auth)/home/services/trading",
                isPopular: true,
            },
            {
                id: "lending",
                title: "Crypto Lending",
                subtitle: "Earn interest on crypto",
                icon: "solar:hand-money-bold-duotone",
                route: "/services/lending",
            },
            {
                id: "savings",
                title: "High-Yield Savings",
                subtitle: "Secure crypto savings",
                icon: "solar:safe-2-bold-duotone",
                route: "/services/savings",
            },
            {
                id: "payments",
                title: "Payment Gateway",
                subtitle: "Accept crypto payments",
                icon: "solar:card-bold-duotone",
                route: "/services/payments",
            },
        ],
    },
    {
        id: "lifestyle",
        title: "Lifestyle & Commerce",
        description: "Shopping, Bills & Daily Services",
        icon: "solar:shop-bold-duotone",
        color: "#f093fb",
        gradient: ["#f093fb", "#f5576c"] as const,
        services: [
            {
                id: "marketplace",
                title: "Marketplace",
                subtitle: "Shop with cryptocurrency",
                icon: "solar:shop-2-bold-duotone",
                route: "/(auth)/home/services/marketplace",
                isPopular: true,
            },
            {
                id: "bills",
                title: "Bill Payments",
                subtitle: "Pay utilities seamlessly",
                icon: "solar:bill-list-bold-duotone",
                route: "/services/bills",
            },
            {
                id: "prepaid",
                title: "Mobile Top-up",
                subtitle: "Instant mobile recharge",
                icon: "solar:phone-bold-duotone",
                route: "/services/prepaid",
            },
            {
                id: "travel",
                title: "Travel Booking",
                subtitle: "Hotels, flights & experiences",
                icon: "solar:plane-bold-duotone",
                route: "/services/travel",
            },
            {
                id: "food",
                title: "Food Delivery",
                subtitle: "Order food with crypto",
                icon: "solar:hamburger-bold-duotone",
                route: "/services/food",
                isNew: true,
            },
        ],
    },
    {
        id: "entertainment",
        title: "Entertainment & Media",
        description: "Gaming, NFTs & Digital Content",
        icon: "solar:gameboy-bold-duotone",
        color: "#4facfe",
        gradient: ["#4facfe", "#00f2fe"] as const,
        services: [
            {
                id: "games",
                title: "Web3 Gaming",
                subtitle: "Play-to-earn games",
                icon: "solar:gameboy-bold-duotone",
                route: "/(auth)/home/services/games",
                isNew: true,
                isPopular: true,
            },
            {
                id: "nft",
                title: "NFT Marketplace",
                subtitle: "Create, buy & sell NFTs",
                icon: "solar:gallery-bold-duotone",
                route: "/services/nft",
            },
            {
                id: "streaming",
                title: "Content Streaming",
                subtitle: "Premium streaming services",
                icon: "solar:play-bold-duotone",
                route: "/services/streaming",
            },
            {
                id: "events",
                title: "Event Tickets",
                subtitle: "Secure event ticketing",
                icon: "solar:ticket-bold-duotone",
                route: "/services/events",
            },
            {
                id: "music",
                title: "Music Platform",
                subtitle: "Decentralized music streaming",
                icon: "solar:music-note-4-bold-duotone",
                route: "/services/music",
                isNew: true,
            },
            {
                id: "stadiumx",
                title: "StadiumX Asia",
                subtitle: "Sports & entertainment platform",
                icon: "solar:stadium-bold-duotone",
                route: "/(auth)/home/services/stadiumx",
                isNew: true,
                isPopular: true,
            },
        ],
    },
    {
        id: "business",
        title: "Business & Tools",
        description: "APIs, Analytics & Developer Services",
        icon: "solar:widget-3-bold-duotone",
        color: "#fa709a",
        gradient: ["#fa709a", "#fee140"] as const,
        services: [
            {
                id: "analytics",
                title: "Portfolio Analytics",
                subtitle: "Advanced portfolio insights",
                icon: "solar:chart-square-bold-duotone",
                route: "/services/analytics",
                isPopular: true,
            },
            {
                id: "dev-tools",
                title: "Developer Tools",
                subtitle: "Build on Bitriel platform",
                icon: "solar:code-bold-duotone",
                route: "/services/dev-tools",
            },
            {
                id: "api",
                title: "API Services",
                subtitle: "Integrate our APIs",
                icon: "solar:server-bold-duotone",
                route: "/services/api",
            },
            {
                id: "business",
                title: "Business Solutions",
                subtitle: "Enterprise crypto solutions",
                icon: "solar:buildings-bold-duotone",
                route: "/services/business",
            },
            {
                id: "calculator",
                title: "Crypto Calculator",
                subtitle: "Price & yield calculator",
                icon: "solar:calculator-bold-duotone",
                route: "/services/calculator",
            },
        ],
    },
];

const ServicesScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredServices = serviceCategories
        .flatMap(category => category.services)
        .filter(
            service =>
                service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const popularServices = serviceCategories
        .flatMap(category => category.services)
        .filter(service => service.isPopular);

    const newServices = serviceCategories.flatMap(category => category.services).filter(service => service.isNew);

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
                <Search size={20} color="#8E8E93" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search services..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#8E8E93"
                />
            </View>
        </View>
    );

    const renderServiceBadges = (service: Service) => (
        <View style={styles.serviceBadges}>
            {service.isNew && (
                <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                </View>
            )}
            {service.isPopular && (
                <View style={styles.popularBadge}>
                    <Star size={10} color="#FFD700" />
                    <Text style={styles.popularBadgeText}>Popular</Text>
                </View>
            )}
        </View>
    );

    const renderCategoryHeader = (category: ServiceCategory) => (
        <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
        >
            <LinearGradient colors={category.gradient} style={styles.categoryIcon}>
                <Settings size={24} color="white" />
            </LinearGradient>
            <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
            </View>
            {selectedCategory === category.id ? (
                <ChevronUp size={20} color="#8E8E93" />
            ) : (
                <ChevronDown size={20} color="#8E8E93" />
            )}
        </TouchableOpacity>
    );

    const renderServiceGrid = (services: Service[]) => (
        <View style={styles.serviceGrid}>
            {services.map((service, index) => (
                <TouchableOpacity
                    key={service.id}
                    style={[styles.serviceCard, { marginRight: index % 2 === 0 ? 8 : 0 }]}
                    onPress={() => router.push(service.route as any)}
                >
                    <View style={styles.serviceCardHeader}>
                        <View style={styles.serviceIconContainer}>
                            <Zap size={20} color={Colors.primary} />
                        </View>
                        {renderServiceBadges(service)}
                    </View>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderQuickAccessSection = () => {
        // Custom order for Quick Access: StadiumX, Marketplace, DeFi Hub, then others
        const quickAccessOrder = ["stadiumx", "marketplace", "defi"];
        const allServices = serviceCategories.flatMap(category => category.services);

        const orderedQuickAccess = [
            ...quickAccessOrder
                .map(id => allServices.find(service => service.id === id))
                .filter((service): service is Service => Boolean(service)),
            ...popularServices.filter(service => !quickAccessOrder.includes(service.id)),
        ].slice(0, 5);

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Access</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickAccessContainer}>
                    {orderedQuickAccess.map(service => (
                        <TouchableOpacity
                            key={service.id}
                            style={styles.quickAccessCard}
                            onPress={() => router.push(service.route as any)}
                        >
                            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.quickAccessGradient}>
                                <Zap size={24} color="white" />
                                <Text style={styles.quickAccessTitle}>{service.title}</Text>
                                {(service.isPopular || service.isNew) && (
                                    <Star size={12} color="#FFD700" style={styles.quickAccessStar} />
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    const renderNewServicesSection = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Services</Text>
                <TouchableOpacity onPress={() => router.push("/services/new" as any)}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {newServices.map(service => (
                    <TouchableOpacity
                        key={service.id}
                        style={styles.newServiceCard}
                        onPress={() => router.push(service.route as any)}
                    >
                        <View style={styles.newServiceIcon}>
                            <Zap size={18} color={Colors.primary} />
                        </View>
                        <Text style={styles.newServiceTitle}>{service.title}</Text>
                        <Text style={styles.newServiceSubtitle}>{service.subtitle}</Text>
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Services</Text>
                <Text style={styles.headerSubtitle}>Discover what you can do with Bitriel</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {renderSearchBar()}

                {!searchQuery && (
                    <>
                        {renderQuickAccessSection()}
                        {renderNewServicesSection()}
                    </>
                )}

                {searchQuery ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Search Results</Text>
                        {renderServiceGrid(filteredServices)}
                    </View>
                ) : (
                    serviceCategories.map(category => (
                        <View key={category.id} style={styles.categorySection}>
                            {renderCategoryHeader(category)}
                            {selectedCategory === category.id && renderServiceGrid(category.services)}
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#8E8E93",
    },
    scrollContent: {
        paddingBottom: 20,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F7",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#1A1A1A",
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1A1A1A",
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    seeAllText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: "500",
    },
    quickAccessContainer: {
        paddingLeft: 20,
    },
    quickAccessCard: {
        width: 120,
        height: 100,
        marginRight: 12,
        borderRadius: 12,
        overflow: "hidden",
    },
    quickAccessGradient: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    quickAccessTitle: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 8,
    },
    quickAccessStar: {
        position: "absolute",
        top: 8,
        right: 8,
    },
    newServiceCard: {
        width: 140,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        marginLeft: 20,
        borderWidth: 1,
        borderColor: "#F2F2F7",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    newServiceIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    newServiceTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    newServiceSubtitle: {
        fontSize: 12,
        color: "#8E8E93",
        marginBottom: 8,
    },
    categorySection: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#FFFFFF",
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 2,
    },
    categoryDescription: {
        fontSize: 14,
        color: "#8E8E93",
    },
    serviceGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    serviceCard: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#F2F2F7",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    serviceCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    serviceIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
    },
    serviceBadges: {
        alignItems: "flex-end",
    },
    serviceTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    serviceSubtitle: {
        fontSize: 12,
        color: "#8E8E93",
        lineHeight: 16,
    },
    newBadge: {
        backgroundColor: "#34C759",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    newBadgeText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    popularBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF3CD",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    popularBadgeText: {
        fontSize: 10,
        fontWeight: "500",
        color: "#856404",
        marginLeft: 2,
    },
});

export default ServicesScreen;
