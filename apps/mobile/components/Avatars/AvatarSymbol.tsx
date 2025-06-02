import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  name: string;
}

const CustomAvatar: React.FC<Props> = ({ name }) => {
  // Function to extract initials from the name
  const getInitials = (name: string): string => {
    const nameArray = name.split(" ");
    let initials = nameArray
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
    return initials.slice(0, 3); // Limit to 2 or 3 characters
  };

  return (
    <View style={styles.avatarContainer}>
      <Text style={styles.avatarText}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007bff", // You can change the background color here
    justifyContent: "center",
    alignItems: "center"
  },
  avatarText: {
    color: "#ffffff", // You can change the text color here
    fontSize: 18,
    fontWeight: "bold"
  }
});

export default CustomAvatar;
