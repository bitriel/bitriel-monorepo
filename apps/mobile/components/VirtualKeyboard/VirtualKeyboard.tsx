import React, { Component, ReactNode } from "react";
import PropTypes from "prop-types";
import { Text, View, TouchableOpacity, Image, ViewStyle, TextStyle } from "react-native";

import styles from "./VirtualKeyboard.style";

const BACK = "back";
const CLEAR = "clear";
const PRESS_MODE_STRING = "string";

interface VirtualKeyboardProps {
    pressMode?: "string" | "char";
    color?: string;
    onPress: (value: string) => void;
    backspaceImg?: number;
    applyBackspaceTint?: boolean;
    decimal?: boolean;
    decimalSymbol?: string;
    rowStyle?: ViewStyle;
    cellStyle?: ViewStyle;
    textStyle?: TextStyle;
    clearOnLongPress?: boolean;
    style?: ViewStyle;
}

interface VirtualKeyboardState {
    text: string;
}

export default class VirtualKeyboard extends Component<VirtualKeyboardProps, VirtualKeyboardState> {
    static defaultProps: Partial<VirtualKeyboardProps> = {
        pressMode: "string",
        color: "gray",
        backspaceImg: require("./../../assets/icons/backspace.png"),
        applyBackspaceTint: true,
        decimal: false,
        clearOnLongPress: false,
    };

    constructor(props: VirtualKeyboardProps) {
        super(props);
        this.state = {
            text: "",
        };
    }

    renderDecimal(): ReactNode {
        if (this.props.decimal) {
            return this.props.decimalSymbol ? this.Cell(this.props.decimalSymbol) : this.Cell(".");
        } else {
            return <View style={{ flex: 1 }} />;
        }
    }

    render(): ReactNode {
        return (
            <View style={[styles.container, this.props.style]}>
                {this.Row([1, 2, 3])}
                {this.Row([4, 5, 6])}
                {this.Row([7, 8, 9])}
                <View style={[styles.row, this.props.rowStyle]}>
                    {this.renderDecimal()}
                    {this.Cell(0)}
                    {this.Backspace()}
                </View>
            </View>
        );
    }

    Backspace(): ReactNode {
        return (
            <TouchableOpacity
                accessibilityLabel="backspace"
                style={styles.backspace}
                onPress={() => {
                    this.onPress(BACK);
                }}
                onLongPress={() => {
                    if (this.props.clearOnLongPress) this.onPress(CLEAR);
                }}
            >
                <Image
                    source={this.props.backspaceImg}
                    resizeMode="contain"
                    style={this.props.applyBackspaceTint && { tintColor: this.props.color }}
                />
            </TouchableOpacity>
        );
    }

    Row(numbersArray: number[]): ReactNode {
        let cells = numbersArray.map(val => this.Cell(val));
        return <View style={[styles.row, this.props.rowStyle]}>{cells}</View>;
    }

    Cell(symbol: string | number): ReactNode {
        return (
            <TouchableOpacity
                style={[styles.cell, this.props.cellStyle]}
                key={symbol.toString()}
                accessibilityLabel={symbol.toString()}
                onPress={() => {
                    this.onPress(symbol.toString());
                }}
            >
                <Text
                    style={[
                        styles.number,
                        this.props.textStyle,
                        { color: this.props.color, fontFamily: "SpaceGrotesk-Bold" },
                    ]}
                >
                    {symbol}
                </Text>
            </TouchableOpacity>
        );
    }

    onPress(val: string): void {
        if (this.props.pressMode === PRESS_MODE_STRING) {
            let curText = this.state.text;
            if (isNaN(Number(val))) {
                if (val === BACK) {
                    curText = curText.slice(0, -1);
                } else if (val === CLEAR) {
                    curText = "";
                } else {
                    curText += val;
                }
            } else {
                curText += val;
            }
            this.setState({ text: curText });
            this.props.onPress(curText);
        } else {
            this.props.onPress(val);
        }
    }
}
