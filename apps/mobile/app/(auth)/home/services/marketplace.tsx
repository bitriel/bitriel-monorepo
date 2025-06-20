import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, TextInput } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, Search, Filter, Star, ShoppingCart, Zap, Shield, Heart } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "~/src/constants/Colors";

interface Product {
    id: string;
    name: string;
    price: number;
    cryptoPrice: number;
    currency: string;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    seller: string;
    acceptsCrypto: boolean;
    discount?: number;
    isNew?: boolean;
    inStock: boolean;
}

interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    productCount: number;
}

const categories: Category[] = [
    {
        id: "electronics",
        name: "Electronics",
        icon: "smartphone",
        color: "#667eea",
        productCount: 156,
    },
    {
        id: "fashion",
        name: "Fashion",
        icon: "shirt",
        color: "#f093fb",
        productCount: 89,
    },
    {
        id: "gaming",
        name: "Gaming",
        icon: "gamepad",
        color: "#4facfe",
        productCount: 67,
    },
    {
        id: "home",
        name: "Home & Garden",
        icon: "home",
        color: "#43e97b",
        productCount: 234,
    },
    {
        id: "books",
        name: "Books",
        icon: "book",
        color: "#fa709a",
        productCount: 123,
    },
    {
        id: "sports",
        name: "Sports",
        icon: "dumbbell",
        color: "#ffecd2",
        productCount: 78,
    },
];

const featuredProducts: Product[] = [
    {
        id: "1",
        name: "iPhone 15 Pro Max",
        price: 1199,
        cryptoPrice: 0.048,
        currency: "BTC",
        rating: 4.8,
        reviews: 234,
        image: "iphone",
        category: "Electronics",
        seller: "Apple Store",
        acceptsCrypto: true,
        discount: 10,
        inStock: true,
    },
    {
        id: "2",
        name: "MacBook Pro M3",
        price: 1999,
        cryptoPrice: 0.081,
        currency: "BTC",
        rating: 4.9,
        reviews: 145,
        image: "macbook",
        category: "Electronics",
        seller: "Apple Store",
        acceptsCrypto: true,
        isNew: true,
        inStock: true,
    },
    {
        id: "3",
        name: "Gaming Chair Pro",
        price: 399,
        cryptoPrice: 15.8,
        currency: "SEL",
        rating: 4.6,
        reviews: 89,
        image: "chair",
        category: "Gaming",
        seller: "ErgoTech",
        acceptsCrypto: true,
        inStock: true,
    },
    {
        id: "4",
        name: "Nike Air Jordan",
        price: 179,
        cryptoPrice: 7.1,
        currency: "SEL",
        rating: 4.7,
        reviews: 156,
        image: "shoes",
        category: "Fashion",
        seller: "Nike",
        acceptsCrypto: true,
        discount: 15,
        inStock: false,
    },
];

const MarketplaceScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>(["1", "3"]);
    const [cartItems, setCartItems] = useState<string[]>([]);

    const toggleFavorite = (productId: string) => {
        setFavorites(prev => (prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]));
    };

    const addToCart = (productId: string) => {
        setCartItems(prev => [...prev, productId]);
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Marketplace</Text>
            <TouchableOpacity style={styles.cartButton}>
                <ShoppingCart size={24} color="white" />
                {cartItems.length > 0 && (
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <Search size={20} color="#8E8E93" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#8E8E93"
                />
            </View>
            <TouchableOpacity style={styles.filterButton}>
                <Filter size={20} color={Colors.primary} />
            </TouchableOpacity>
        </View>
    );

    const renderCategoryCard = (category: Category) => (
        <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, selectedCategory === category.id && styles.selectedCategory]}
            onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
        >
            <LinearGradient colors={[category.color, `${category.color}80`]} style={styles.categoryGradient}>
                <Zap size={24} color="white" />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.productCount} items</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    const renderProductCard = (product: Product) => (
        <TouchableOpacity key={product.id} style={styles.productCard}>
            <View style={styles.productImageContainer}>
                <View style={styles.productImagePlaceholder}>
                    <Zap size={32} color={Colors.primary} />
                </View>

                <View style={styles.productBadges}>
                    {product.isNew && (
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    )}
                    {product.discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{product.discount}% OFF</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(product.id)}>
                    <Heart
                        size={18}
                        color={favorites.includes(product.id) ? "#FF3B30" : "#8E8E93"}
                        fill={favorites.includes(product.id) ? "#FF3B30" : "transparent"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                </Text>
                <Text style={styles.productSeller}>by {product.seller}</Text>

                <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rating}>{product.rating}</Text>
                    <Text style={styles.reviews}>({product.reviews})</Text>
                </View>

                <View style={styles.priceContainer}>
                    <View>
                        <Text style={styles.cryptoPrice}>
                            {product.cryptoPrice} {product.currency}
                        </Text>
                        <Text style={styles.usdPrice}>${product.price}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.addToCartButton, !product.inStock && styles.outOfStockButton]}
                        onPress={() => addToCart(product.id)}
                        disabled={!product.inStock}
                    >
                        <Text style={[styles.addToCartText, !product.inStock && styles.outOfStockText]}>
                            {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderStats = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <View style={styles.statIcon}>
                    <Shield size={20} color={Colors.primary} />
                </View>
                <View>
                    <Text style={styles.statValue}>100%</Text>
                    <Text style={styles.statLabel}>Secure</Text>
                </View>
            </View>

            <View style={styles.statItem}>
                <View style={styles.statIcon}>
                    <Zap size={20} color={Colors.primary} />
                </View>
                <View>
                    <Text style={styles.statValue}>1000+</Text>
                    <Text style={styles.statLabel}>Products</Text>
                </View>
            </View>

            <View style={styles.statItem}>
                <View style={styles.statIcon}>
                    <Star size={20} color={Colors.primary} />
                </View>
                <View>
                    <Text style={styles.statValue}>4.8</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.headerGradient}>
                {renderHeader()}
                {renderStats()}
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderSearchBar()}

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Shop by Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.categoriesContainer}>{categories.map(renderCategoryCard)}</View>
                    </ScrollView>
                </View>

                {/* Featured Products */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Featured Products</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.productsGrid}>{featuredProducts.map(renderProductCard)}</View>
                </View>

                {/* Crypto Benefits */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Pay with Crypto?</Text>
                    <View style={styles.benefitsContainer}>
                        <View style={styles.benefitCard}>
                            <Shield size={32} color={Colors.primary} />
                            <Text style={styles.benefitTitle}>Secure Payments</Text>
                            <Text style={styles.benefitDescription}>
                                All transactions are secured by blockchain technology
                            </Text>
                        </View>

                        <View style={styles.benefitCard}>
                            <Zap size={32} color={Colors.primary} />
                            <Text style={styles.benefitTitle}>Fast Transactions</Text>
                            <Text style={styles.benefitDescription}>Complete purchases in seconds with crypto</Text>
                        </View>

                        <View style={styles.benefitCard}>
                            <Star size={32} color={Colors.primary} />
                            <Text style={styles.benefitTitle}>Exclusive Discounts</Text>
                            <Text style={styles.benefitDescription}>Get special discounts when paying with crypto</Text>
                        </View>
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
    headerGradient: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    cartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    cartBadge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "#FF3B30",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    cartBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    statIcon: {
        marginRight: 8,
    },
    statValue: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    statLabel: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 12,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: -10,
        marginBottom: 20,
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#1A1A1A",
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: "white",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    section: {
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
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 16,
    },
    seeAllText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: "500",
    },
    categoriesContainer: {
        flexDirection: "row",
        paddingRight: 20,
    },
    categoryCard: {
        width: 120,
        height: 100,
        marginRight: 12,
        borderRadius: 12,
        overflow: "hidden",
    },
    selectedCategory: {
        transform: [{ scale: 1.05 }],
    },
    categoryGradient: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryName: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 4,
    },
    categoryCount: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 10,
    },
    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    productCard: {
        width: "48%",
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productImageContainer: {
        position: "relative",
        height: 140,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
    },
    productImagePlaceholder: {
        flex: 1,
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
    },
    productBadges: {
        position: "absolute",
        top: 8,
        left: 8,
    },
    newBadge: {
        backgroundColor: "#34C759",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    newBadgeText: {
        color: "white",
        fontSize: 10,
        fontWeight: "600",
    },
    discountBadge: {
        backgroundColor: "#FF3B30",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: "white",
        fontSize: 10,
        fontWeight: "600",
    },
    favoriteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
        minHeight: 36,
    },
    productSeller: {
        fontSize: 12,
        color: "#8E8E93",
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    rating: {
        fontSize: 12,
        fontWeight: "500",
        color: "#1A1A1A",
        marginLeft: 4,
        marginRight: 4,
    },
    reviews: {
        fontSize: 12,
        color: "#8E8E93",
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    cryptoPrice: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.primary,
        marginBottom: 2,
    },
    usdPrice: {
        fontSize: 12,
        color: "#8E8E93",
    },
    addToCartButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    outOfStockButton: {
        backgroundColor: "#E5E5E7",
    },
    addToCartText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    outOfStockText: {
        color: "#8E8E93",
    },
    benefitsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    benefitCard: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    benefitTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginTop: 12,
        marginBottom: 8,
        textAlign: "center",
    },
    benefitDescription: {
        fontSize: 14,
        color: "#8E8E93",
        textAlign: "center",
        lineHeight: 20,
    },
});

export default MarketplaceScreen;
