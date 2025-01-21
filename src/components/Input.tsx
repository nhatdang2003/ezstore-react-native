import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardTypeOptions } from 'react-native'
import React, { useState } from 'react'
import { ReactNode } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR } from '../constants/color';

interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    type?: 'text' | 'password';
    keyboardType?: KeyboardTypeOptions;
}

const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    leftIcon,
    rightIcon,
    type = 'text',
    keyboardType = 'default'
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const secureTextEntry = isPassword && !showPassword;

    const iconColor = value ? '#333' : '#999';
    const activeIconColor = isFocused ? '#333' : iconColor;

    const styledLeftIcon = leftIcon && React.cloneElement(leftIcon as React.ReactElement, {
        color: activeIconColor
    });

    const styledRightIcon = rightIcon && React.cloneElement(rightIcon as React.ReactElement, {
        color: activeIconColor
    });

    const passwordIcon = isPassword ? (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
                <MaterialCommunityIcons name="eye-outline" size={24} color={activeIconColor} />
            ) : (
                <MaterialCommunityIcons name="eye-off-outline" size={24} color={activeIconColor} />
            )}
        </TouchableOpacity>
    ) : styledRightIcon;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputContainer,
                error && styles.inputContainerError,
                isFocused && styles.inputContainerFocused
            ]}>
                {leftIcon && <View style={styles.leftIcon}>{styledLeftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        leftIcon ? styles.inputWithLeftIcon : null,
                        (rightIcon || isPassword) ? styles.inputWithRightIcon : null,
                    ]}
                    autoCapitalize='none'
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholderTextColor="#999"
                    keyboardType={keyboardType}
                />
                {(passwordIcon || rightIcon) && (
                    <View style={styles.rightIcon}>
                        {isPassword ? passwordIcon : styledRightIcon}
                    </View>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLOR.BACKGROUND,
        borderRadius: 8,
        backgroundColor: COLOR.BACKGROUND,
        minHeight: 48,
        position: 'relative',
    },
    inputContainerError: {
        borderColor: '#ff3333',
    },
    inputContainerFocused: {
        borderColor: '#333',
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: '#333',
    },
    inputWithLeftIcon: {
        paddingLeft: 44,
    },
    inputWithRightIcon: {
        paddingRight: 44,
    },
    leftIcon: {
        position: 'absolute',
        left: 12,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightIcon: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ff3333',
        fontSize: 12,
        marginTop: 4,
    },
})

export default Input