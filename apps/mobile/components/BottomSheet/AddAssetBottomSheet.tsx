// import { View, Text, TouchableOpacity, TextInput, Keyboard, BackHandler } from "react-native";
// import React, { forwardRef, useCallback, useMemo, useState } from "react";
// import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput } from "@gorhom/bottom-sheet";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Colors from "~/src/constants/Colors";
// import { selEvmConnectContract } from "~/src/services/ethers/selendra/selEvmConnectContract";
// import selendraLogo from "~Assets/logos/Selendralogo.png";
// import { useFocusEffect } from "expo-router";
// import { CustomSelEvmTokenData } from "~/src/interfaces/evmTokenContract";

// interface BottomSheetProps {
//   handleCloseBottomSheet: () => void;
//   mnemonic: string;
//   tokenData: CustomSelEvmTokenData[];
//   setTokenData: React.Dispatch<React.SetStateAction<CustomSelEvmTokenData[]>>;
// }

// type Ref = BottomSheet;

// const AddAssetBottomSheet = forwardRef<Ref, BottomSheetProps>((bottomSheetProp, ref) => {
//   const snapPoints = useMemo(() => ["25%"], []);

//   const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

//   const [tokenAddress, setTokenAddress] = useState("");

//   const handleAddToken = async () => {
//     await selEvmConnectContract(bottomSheetProp.mnemonic, tokenAddress).then((result) => {
//       bottomSheetProp.setTokenData([
//         ...bottomSheetProp.tokenData, // Keep existing tokens if any
//         {
//           contractAddress: result?.contractAddress!,
//           tokenName: result?.tokenName!,
//           tokenSymbol: result?.tokenSymbol!,
//           tokenBalance: result?.tokenBalance!,
//           logo: selendraLogo
//         }
//       ]);
//       setTokenAddress(""); // Reset the value after adding the token
//       bottomSheetProp.handleCloseBottomSheet();
//     });
//   };

//   const handleBottomSheetClose = useCallback(() => {
//     // Clear the text input
//     setTokenAddress("");
//     // Call the handleCloseBottomSheet callback
//     bottomSheetProp.handleCloseBottomSheet();
//   }, [bottomSheetProp]);

//   const [isShowing, setIsShowing] = useState<boolean>(false);

//   useFocusEffect(
//     useCallback(() => {
//       // addEventListener and removeEventListener must refer to the same function
//       const onBackPress = () => {
//         if (isShowing) {
//           handleBottomSheetClose();
//           return true; // TS complains if handler doesn't return a boolean
//         } else {
//           return false;
//         }
//       };
//       BackHandler.addEventListener("hardwareBackPress", onBackPress);
//       return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
//     }, [ref, isShowing])
//   );

//   return (
//     <BottomSheet
//       ref={ref}
//       snapPoints={snapPoints}
//       index={-1}
//       enablePanDownToClose={true}
//       onClose={handleBottomSheetClose}
//       onChange={(idx) => setIsShowing(idx > -1)}
//       backdropComponent={renderBackdrop}
//       handleIndicatorStyle={{ backgroundColor: Colors.secondary }}
//       backgroundStyle={{ backgroundColor: Colors.white }}>
//       <View>
//         <View className="mx-3 items-start">
//           <Text className="font-SpaceGroteskMedium mb-1">Token Address</Text>
//           <BottomSheetTextInput
//             autoCapitalize="none"
//             autoCorrect={false}
//             style={{
//               width: "100%",
//               borderWidth: 1,
//               borderColor: Colors.primary,
//               marginBottom: 4,
//               padding: 12,
//               borderRadius: 8
//             }}
//             multiline={false}
//             placeholder="0x..."
//             value={tokenAddress}
//             onChangeText={setTokenAddress}
//           />
//         </View>

//         <SafeAreaView>
//           <TouchableOpacity className="bg-primary mx-3 p-3 rounded-xl" onPress={handleAddToken}>
//             <Text className="text-base text-center text-secondary font-SpaceGroteskBold">Import</Text>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </View>
//     </BottomSheet>
//   );
// });

// export default AddAssetBottomSheet;
