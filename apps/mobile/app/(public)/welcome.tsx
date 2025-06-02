import React from "react";
import { View, Image, SafeAreaView, Text, StyleSheet, Dimensions } from "react-native";
import { Buttons } from "~/components";
import { router } from "expo-router";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Welcome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("~Assets/artwork.png")} style={styles.artwork} resizeMode="cover" />

      <View style={styles.content}>
        <Image source={require("~Assets/bitriel-logo.png")} style={styles.logo} />
        <Text style={styles.title}>Bitriel Wallet</Text>
        <Text style={styles.description}>Seamless Finance: Explore Crypto Asset Holding and Smart Payment Services{"\n\n"}Join For Free.</Text>

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            <Buttons.DefaultWithIcon
              label="Import Mnemonic"
              icon="long-arrow-right"
              onPress={() =>
                router.push({
                  pathname: "/mnemonic/import"
                })
              }
            />
          </View>
          <Buttons.Transparent
            label="Create Mnemonic"
            onPress={() =>
              router.push({
                pathname: "/mnemonic/create"
              })
            }
          />
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.buttonWrapper}>
            <Buttons.DefaultWithIcon
              label="Login to Custodial Wallet"
              icon="long-arrow-right"
              onPress={() =>
                router.push({
                  pathname: "/(public)/custodial/login"
                })
              }
            />
          </View>
          <Buttons.Transparent
            label="Register Custodial Wallet"
            onPress={() =>
              router.push({
                pathname: "/(public)/custodial/register"
              })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white"
  },
  artwork: {
    width: windowWidth * 0.35,
    height: windowHeight
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 12
  },
  logo: {
    width: 50,
    height: 50
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "black"
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: "gray"
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%"
  },
  buttonWrapper: {
    marginBottom: 10,
    flex: 1
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5"
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
    fontSize: 14
  }
});

export default Welcome;
