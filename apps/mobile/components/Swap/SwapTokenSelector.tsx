import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";
import { Search, X } from "lucide-react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { TokenBalance } from "@bitriel/wallet-sdk";
import TokenLogo from "../Avatars/TokenLogo";

interface SwapTokenSelectorProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (token: TokenBalance) => void;
    tokens: TokenBalance[];
    type: "from" | "to";
}

export const SwapTokenSelector: React.FC<SwapTokenSelectorProps> = ({ visible, onClose, onSelect, tokens, type }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTokens, setFilteredTokens] = useState<TokenBalance[]>(tokens);
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Bottom sheet snap points
    const snapPoints = useMemo(() => ["90%"], []);

    // Handle sheet changes
    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                onClose();
            }
        },
        [onClose]
    );

    // Backdrop component
    const renderBackdrop = useCallback(() => {
        return <View style={styles.backdrop} />;
    }, []);

    // Control bottom sheet visibility
    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.expand();
            setSearchQuery("");
        } else {
            bottomSheetRef.current?.close();
        }
    }, [visible]);

    // Filter tokens based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredTokens(tokens);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = tokens.filter(
            token =>
                token.token.symbol.toLowerCase().includes(query) ||
                token.token.name.toLowerCase().includes(query) ||
                token.token.address.toLowerCase().includes(query)
        );
        setFilteredTokens(filtered);
    }, [searchQuery, tokens]);

    // Render token item
    const renderToken = useCallback(
        ({ item }: { item: TokenBalance }) => {
            return (
                <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "timing", duration: 300 }}
                >
                    <TouchableOpacity
                        style={styles.tokenItem}
                        onPress={() => {
                            onSelect(item);
                            onClose();
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={styles.tokenItemLeft}>
                            <TokenLogo logoURI={item.token.logoURI} size={36} />
                            <View style={styles.tokenDetails}>
                                <Text style={styles.tokenSymbol}>{item.token.symbol}</Text>
                                <Text style={styles.tokenName}>{item.token.name}</Text>
                            </View>
                        </View>
                        <View style={styles.tokenBalance}>
                            <Text style={styles.balanceText}>{item.formatted}</Text>
                        </View>
                    </TouchableOpacity>
                </MotiView>
            );
        },
        [onSelect, onClose]
    );

    // Extract key for FlatList
    const keyExtractor = useCallback((item: TokenBalance) => item.token.address, []);

    // Render empty list component
    const renderEmptyComponent = useCallback(
        () => (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tokens found</Text>
            </View>
        ),
        []
    );

    const handleClearSearch = () => setSearchQuery("");

    if (!visible) return null;

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={onClose}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.indicator}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Select {type === "from" ? "Source" : "Destination"} Token</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Search size={18} color="#64748b" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name or address"
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                            <X size={18} color="#64748b" />
                        </TouchableOpacity>
                    )}
                </View>

                <BottomSheetFlatList
                    data={filteredTokens}
                    renderItem={renderToken}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyComponent}
                />
            </View>
        </BottomSheet>
    );
};
const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(15, 23, 42, 0.3)",
    },
    sheetBackground: {
        backgroundColor: "rgba(255, 255, 255, 1)",
    },
    indicator: {
        backgroundColor: "#94a3b8",
        width: 40,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#334155",
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "rgba(241, 245, 249, 0.8)",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(241, 245, 249, 0.8)",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(203, 213, 225, 0.5)",
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: "#334155",
    },
    clearButton: {
        padding: 8,
    },
    listContainer: {
        paddingBottom: 24,
    },
    tokenItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(226, 232, 240, 0.7)",
    },
    tokenItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    tokenDetails: {
        flexDirection: "column",
        marginLeft: 8,
    },
    tokenSymbol: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#334155",
    },
    tokenName: {
        fontSize: 14,
        color: "#64748b",
    },
    tokenBalance: {
        alignItems: "flex-end",
    },
    balanceText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#475569",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 16,
        color: "#94a3b8",
        fontWeight: "500",
    },
});
