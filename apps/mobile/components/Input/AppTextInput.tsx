import { TextInput, TextInputProps } from "react-native";
import React, { useState } from "react";

const AppTextInput: React.FC<TextInputProps> = ({ ...otherProps }) => {
    return (
        <TextInput
            autoCorrect={false}
            placeholderTextColor={"#626262"}
            className={`
        p-5 bg-offWhite rounded-xl my-2 focus:border-2 focus:border-secondary
      `}
            {...otherProps}
        />
    );
};

export default AppTextInput;
