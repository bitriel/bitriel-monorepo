import { parseTransactionAmount } from "@bitriel/wallet-sdk";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TextStyle, TouchableWithoutFeedback, Keyboard, ViewStyle } from "react-native";
import Animated, {
  LinearTransition,
  SlideInDown,
  SlideOutDown,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  Easing
} from "react-native-reanimated";

function formatNumberWithCommas(num: string) {
  // Handle empty or special cases
  if (!num || num === "") return [{ value: "0", key: "digit-0" }];
  if (num === ".")
    return [
      { value: "0", key: "digit-0" },
      { value: ".", key: "decimal" }
    ];

  // Handle decimal numbers properly
  const parts = num.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] || "";

  const result: { value: string; key: string }[] = [];

  // Handle integer part
  if (!integerPart || integerPart === "") {
    result.push({ value: "0", key: "digit-0" });
  } else {
    // Add digits with commas
    const digits = integerPart.split("");
    digits.forEach((digit, index) => {
      // Add comma every 3 digits from the right
      if (index > 0 && (digits.length - index) % 3 === 0) {
        result.push({ value: ",", key: `comma-${index}` });
      }
      result.push({ value: digit, key: `digit-${index}` });
    });
  }

  // Add decimal part if exists
  if (decimalPart !== "" || num.endsWith(".")) {
    result.push({ value: ".", key: "decimal" });
    decimalPart.split("").forEach((digit, index) => {
      result.push({ value: digit, key: `decimal-${index}` });
    });
  }

  return result;
}

type AnimatedInputProps = {
  style?: TextStyle;
  onChangeText?: (text: string) => void;
  initialValue?: string | number;
  autoFocus?: boolean;
  maxDecimals?: number;
};

export default function AnimatedInput({ style, onChangeText, initialValue = "0", autoFocus = true, maxDecimals = 8 }: AnimatedInputProps) {
  const [amount, setAmount] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const cursorOpacity = useSharedValue(0);

  const fontSize = style?.fontSize ?? 32;
  const animationDuration = 300;

  // Handle initial value
  useEffect(() => {
    const initValue = String(initialValue);
    if (initValue === "0") {
      setAmount("");
    } else {
      setAmount(initValue);
    }
  }, [initialValue]);

  // Cursor animation
  useEffect(() => {
    if (isFocused) {
      cursorOpacity.value = withRepeat(
        withSequence(withTiming(1, { duration: 500, easing: Easing.linear }), withTiming(0, { duration: 500, easing: Easing.linear })),
        -1,
        true
      );
    } else {
      cursorOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isFocused]);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value
  }));

  const handleFocus = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const handleChangeText = (text: string) => {
    // Remove leading zeros unless it's a decimal
    let sanitizedText = text;
    if (text.length > 1 && text.startsWith("0") && !text.startsWith("0.")) {
      sanitizedText = text.replace(/^0+/, "");
    }

    // Validate input format
    const regex = new RegExp(`^\\d*\\.?\\d{0,${maxDecimals}}$`);
    if (regex.test(sanitizedText)) {
      setAmount(sanitizedText);
      onChangeText?.(sanitizedText || "0");

      // Ensure cursor stays at the end
      requestAnimationFrame(() => {
        inputRef.current?.setNativeProps({
          selection: { start: sanitizedText.length, end: sanitizedText.length }
        });
      });
    }
  };

  const formattedNumbers = React.useMemo(() => {
    return formatNumberWithCommas(amount);
  }, [amount]);

  const baseTextStyle: TextStyle = {
    color: style?.color || "#000",
    fontWeight: "bold",
    textAlign: "right",
    fontFamily: style?.fontFamily
  };

  return (
    <TouchableWithoutFeedback onPress={handleFocus}>
      <Animated.View
        style={{
          height: fontSize * 1.2,
          width: "100%",
          justifyContent: "flex-end"
        }}>
        <Animated.View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            overflow: "hidden",
            paddingRight: 4,
            minHeight: fontSize * 1.2
          }}>
          {formattedNumbers.map((formattedNumber) => (
            <Animated.Text
              layout={LinearTransition.duration(animationDuration)}
              key={formattedNumber.key}
              entering={SlideInDown.duration(animationDuration).withInitialValues({
                originY: fontSize / 2
              })}
              exiting={SlideOutDown.duration(animationDuration).withInitialValues({
                transform: [{ translateY: -fontSize / 2 }]
              })}
              style={[baseTextStyle, style, { fontSize }]}>
              {formattedNumber.value}
            </Animated.Text>
          ))}

          {/* Animated cursor */}
          <Animated.View
            style={[
              {
                width: 2,
                height: fontSize * 0.8,
                backgroundColor: style?.color || "#000",
                marginLeft: 2
              } as ViewStyle,
              cursorStyle
            ]}
          />

          <TextInput
            ref={inputRef}
            returnKeyType="done"
            selectionColor="transparent"
            keyboardType="decimal-pad"
            value={amount}
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                opacity: 0,
                textAlign: "right"
              }
            ]}
            autoFocus={autoFocus}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
          />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
