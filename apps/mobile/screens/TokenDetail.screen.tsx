import React, { useCallback, useRef, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView, TouchableOpacity, Dimensions, Platform } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useWalletStore } from "~/src/store/useWalletStore";
import { DetailedBalance } from "@bitriel/wallet-sdk";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// A separate component for the Bottom Sheet to avoid shared value access during main component render
const TransactionHistory = ({ snapPoints, actionButtonsPosition }: { snapPoints: number[]; actionButtonsPosition: number }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Expand sheet to full height after render
  useEffect(() => {
    if (actionButtonsPosition > 0) {
      const timer = setTimeout(() => {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.snapToIndex(0);
        }
      }, 300); // Increased timeout to ensure component is fully mounted
      return () => clearTimeout(timer);
    }
  }, [actionButtonsPosition]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{
        backgroundColor: "#CBD5E1"
      }}
      handleStyle={{
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24
      }}
      backgroundStyle={{
        backgroundColor: "white"
      }}
      style={{
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -3
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            backgroundColor: "white"
          },
          android: {
            elevation: 5,
            backgroundColor: "white"
          }
        })
      }}
      animateOnMount={true}
      enableContentPanningGesture={true}>
      <View style={{ flex: 1, paddingHorizontal: 16, backgroundColor: "white" }}>
        <Text className="text-gray-800 text-2xl font-bold mb-4">History</Text>

        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text className="text-gray-500 text-xs mb-2">YESTERDAY</Text>
          <TransactionItem time="16:32" />

          <Text className="text-gray-500 text-xs mt-4 mb-2">06 MARCH</Text>
          <TransactionItem time="11:53" />

          <Text className="text-gray-500 text-xs mt-4 mb-2">05 MARCH</Text>
          <TransactionItem time="14:22" />
          <TransactionItem time="10:37" />

          <Text className="text-gray-500 text-xs mt-4 mb-2">04 MARCH</Text>
          <TransactionItem time="09:15" />
          <TransactionItem time="14:30" />
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
};

function TransactionItem({ time }: { time: string }) {
  return (
    <View className="flex-row justify-between mb-4">
      <View className="flex-row flex-1">
        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
          <Ionicons name="arrow-up" size={20} color="#6B7280" />
        </View>
        <View className="justify-center flex-1">
          <Text className="text-gray-800 text-base font-medium">Transfer</Text>
          <Text className="text-gray-500 text-sm w-full" numberOfLines={1} ellipsizeMode="middle">
            To: 5DWespGr297i...RLXpJ5xFL8XdLGt
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function TokenDetailScreen() {
  const { getDetailedBalance } = useWalletStore();
  const [balance, setBalance] = useState<DetailedBalance | null>(null);
  const [bottomSheetReady, setBottomSheetReady] = useState(false);

  useEffect(() => {
    getDetailedBalance().then((balance) => {
      setBalance(balance);
    });
  }, []);

  const actionButtonsRef = useRef<View>(null);
  const [actionButtonsPosition, setActionButtonsPosition] = useState(0);
  const insets = useSafeAreaInsets();

  // Calculate initial position for bottom sheet
  const handleActionButtonsLayout = useCallback(() => {
    if (actionButtonsRef.current) {
      actionButtonsRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Add the height of the action buttons to get the bottom position
        setActionButtonsPosition(pageY + height);
      });
    }
  }, []);

  // Calculate snap points dynamically
  const snapPoints = React.useMemo(() => {
    // Calculate percentage of available space for first snap point
    const availableSpace = SCREEN_HEIGHT - actionButtonsPosition;
    const firstSnapPoint = Math.round(availableSpace * 0.8);

    // Second snap point is full screen minus action buttons position
    const secondSnapPoint = Math.round(SCREEN_HEIGHT);

    return [firstSnapPoint, secondSnapPoint];
  }, [actionButtonsPosition, insets.top]);

  // Delay bottom sheet initialization to avoid Reanimated warnings
  useEffect(() => {
    if (actionButtonsPosition > 0) {
      // Wait for next frame to ensure values are stable
      const timer = setTimeout(() => {
        setBottomSheetReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [actionButtonsPosition]);

  const cardShadowStyle = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      backgroundColor: "white"
    },
    android: {
      elevation: 2,
      backgroundColor: "white"
    }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <StatusBar style="dark" />

        {/* Balance & Action Buttons */}
        <View>
          {/* Balance Card */}
          <View className="rounded-3xl p-5 mx-4 mt-5" style={cardShadowStyle}>
            <Text className="text-gray-500 text-lg mb-5">Your balance</Text>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-500 text-lg">Total</Text>
              <Text className="text-gray-800 text-lg font-medium">{balance?.formatted.total}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-500 text-lg">Transferable</Text>
              <Text className="text-gray-800 text-lg font-medium">{balance?.formatted.transferable}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-lg">Locked</Text>
                <TouchableOpacity className="ml-2">
                  <Ionicons name="information-circle" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-800 text-lg font-medium">{balance?.formatted.locked}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View
            ref={actionButtonsRef}
            onLayout={handleActionButtonsLayout}
            className="rounded-3xl mx-4 mt-4 flex-row justify-between p-5"
            style={cardShadowStyle}>
            <TouchableOpacity className="items-center justify-center">
              <Ionicons name="arrow-up" size={24} color="#3B82F6" />
              <Text className="text-gray-800 mt-2 text-sm">Send</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center">
              <Ionicons name="arrow-down" size={24} color="#3B82F6" />
              <Text className="text-gray-800 mt-2 text-sm">Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center">
              <MaterialIcons name="swap-horiz" size={24} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2 text-sm">Swap</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center">
              <FontAwesome5 name="credit-card" size={20} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2 text-sm">Buy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conditionally render bottom sheet only after measurements and data are ready */}
        {bottomSheetReady && <TransactionHistory snapPoints={snapPoints} actionButtonsPosition={actionButtonsPosition} />}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
