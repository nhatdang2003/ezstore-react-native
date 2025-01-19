import { Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { ReactNode } from 'react'
import { COLOR } from '../constants/color';

interface CustomButtonProps {
    onPress: () => void;
    children?: ReactNode;
    title?: string;
    variant?: 'filled' | 'outlined' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const CustomButton = ({
    onPress,
    children,
    title,
    variant = 'filled',
    size = 'medium',
    disabled = false,
    style,
    textStyle,
    leftIcon,
    rightIcon
}: CustomButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                styles[variant],
                styles[size],
                pressed && styles.pressed,
                disabled && styles.disabled,
                style,
            ]}
        >
            {({ pressed }) => (
                <>
                    {leftIcon}
                    {children || (
                        <Text
                            style={[
                                styles.text,
                                styles[`${variant}Text`],
                                pressed && styles.pressedText,
                                disabled && styles.disabledText,
                                textStyle
                            ]}
                        >
                            {title}
                        </Text>
                    )}
                    {rightIcon}
                </>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        gap: 8,
    },
    filled: {
        backgroundColor: '#2196F3',
        borderWidth: 0,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minWidth: 80,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        minWidth: 120,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        minWidth: 160,
    },
    pressed: {
        opacity: 0.8,
    },
    disabled: {
        backgroundColor: '#ccc',
        borderColor: '#ccc',
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    filledText: {
        color: '#fff',
    },
    outlinedText: {
        color: '#2196F3',
    },
    ghostText: {
        color: '#2196F3',
    },
    pressedText: {
        opacity: 0.8,
    },
    disabledText: {
        color: '#666',
    },
})

export default CustomButton