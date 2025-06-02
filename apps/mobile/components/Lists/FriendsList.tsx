import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AddNew from "../Buttons/AddNew";
import Avatar from "../Avatars/Menu";
import { User } from "~/src/helpers/interfaces";

interface Props {
  list: Array<User>;
}

const FriendsList: React.FC<Props> = ({ list }) => {
  return (
    <View>
      <FlatList
        contentContainerStyle={{
          alignItems: "center",
          paddingLeft: 13,
          marginBottom: 40
        }}
        data={list}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View>
            {index === 0 ? (
              <AddNew key={item.fullName} onPress={() => {}} />
            ) : (
              <TouchableOpacity key={item.id} className="bg-offWhite mx-2 justify-center items-center px-2 py-5 rounded-lg">
                <Avatar uri={item.avatar} />
                <Text className="mt-3 text-darkBlue font-SpaceGroteskRegular">{item.fullName}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default FriendsList;
