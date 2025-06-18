import React from "react";
import { Stack, router } from "expo-router";
import { TouchableOpacity, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";

const PublicLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerBackTitle: "Back",
                headerBackButtonMenuEnabled: false,
                headerBackTitleStyle: { fontFamily: "SpaceGrotesk-SemiBold" },
                headerTitleStyle: { fontFamily: "SpaceGrotesk-SemiBold" },
            }}
        >
            <Stack.Screen
                name="welcome/index"
                options={{
                    headerShown: false,
                    animation: "slide_from_bottom",
                }}
            />

            <Stack.Screen
                name="mnemonic/create"
                options={({ route }) => ({
                    title: "Create Mnemonic",
                    headerShown: true,
                    animation: "slide_from_right",
                    presentation: "modal",
                    headerLeft:
                        (route.params as any)?.fromWalletManagement === "true"
                            ? () => (
                                  <TouchableOpacity
                                      onPress={() => router.back()}
                                      style={{
                                          paddingLeft: 16,
                                          flexDirection: "row",
                                          alignItems: "center",
                                          paddingVertical: 8,
                                      }}
                                  >
                                      <ArrowLeft size={20} color="#007AFF" />
                                      <Text
                                          style={{
                                              fontSize: 16,
                                              color: "#007AFF",
                                              fontWeight: "600",
                                              marginLeft: 4,
                                          }}
                                      >
                                          Back
                                      </Text>
                                  </TouchableOpacity>
                              )
                            : undefined,
                })}
            />

            <Stack.Screen
                name="mnemonic/import"
                options={({ route }) => ({
                    title: "Import Mnemonic",
                    headerShown: true,
                    animation: "slide_from_right",
                    presentation: "modal",
                    headerLeft:
                        (route.params as any)?.fromWalletManagement === "true"
                            ? () => (
                                  <TouchableOpacity
                                      onPress={() => router.back()}
                                      style={{
                                          paddingLeft: 16,
                                          flexDirection: "row",
                                          alignItems: "center",
                                          paddingVertical: 8,
                                      }}
                                  >
                                      <ArrowLeft size={20} color="#007AFF" />
                                      <Text
                                          style={{
                                              fontSize: 16,
                                              color: "#007AFF",
                                              fontWeight: "600",
                                              marginLeft: 4,
                                          }}
                                      >
                                          Back
                                      </Text>
                                  </TouchableOpacity>
                              )
                            : undefined,
                })}
            />

            <Stack.Screen
                name="passcode/index"
                options={{
                    title: "PIN",
                    headerShown: true,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="auth-method/index"
                options={{
                    title: "Authentication Method",
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />
        </Stack>
    );
};

export default PublicLayout;
