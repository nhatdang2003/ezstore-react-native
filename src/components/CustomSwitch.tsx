import React, { useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const CustomSwitch = ({ value, onValueChange }: CustomSwitchProps) => {
    const translateX = useState(new Animated.Value(value ? 20 : 0))[0];

    const toggleSwitch = () => {
        Animated.spring(translateX, {
            toValue: value ? 0 : 20,
            useNativeDriver: true,
        }).start();
        onValueChange(!value);
    };

    return (
        <Pressable
            onPress={toggleSwitch}
            style={[
                styles.switchContainer,
                { backgroundColor: value ? '#000' : '#E9E9EA' }
            ]}
        >
            <Animated.View
                style={[
                    styles.switchThumb,
                    {
                        transform: [{ translateX }],
                        backgroundColor: value ? '#fff' : '#fff'
                    }
                ]}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    // Switch styles
    switchContainer: {
        width: 50,
        height: 30,
        borderRadius: 15,
        padding: 5,
        justifyContent: 'center',
    },
    switchThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
})

export default CustomSwitch