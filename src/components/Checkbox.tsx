import { Pressable, StyleSheet, ViewStyle, Text, View } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR } from '../constants/color';

interface CheckboxProps {
    checked: boolean;
    onCheck: (checked: boolean) => void;
    size?: number;
    disabled?: boolean;
    style?: ViewStyle;
    checkedColor?: string;
    uncheckedColor?: string;
    label?: string;
}

const Checkbox = ({
    checked,
    onCheck,
    size = 24,
    disabled = false,
    style,
    checkedColor = COLOR.PRIMARY,
    uncheckedColor = COLOR.PRIMARY,
    label,
}: CheckboxProps) => {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => !disabled && onCheck(!checked)}
                style={[styles.checkbox, { opacity: disabled ? 0.5 : 1 }, style]}
                disabled={disabled}
            >
                <MaterialCommunityIcons
                    name={checked ? "checkbox-outline" : "checkbox-blank-outline"}
                    size={size}
                    color={checked ? checkedColor : uncheckedColor}
                />
            </Pressable>
            {label && (
                <Text style={[styles.label]}>
                    {label}
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    checkbox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16
    }
})

export default Checkbox