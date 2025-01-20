import React, { useState } from 'react'
import { View, Text, StyleSheet, Platform, Modal, Pressable } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Ionicons } from '@expo/vector-icons'
import { COLOR } from '../constants/color';

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

const Select = ({
    value,
    onChange,
    options,
    label,
    placeholder = 'Select an option',
    error,
    disabled = false
}: SelectProps) => {

    return (
        <Picker
            style={styles.picker}
            selectedValue={value}
            onValueChange={(itemValue, itemIndex) =>
                onChange(itemValue)
            }>
            {options.map((item) => <Picker.Item key={item.value} label={item.label} value={item.value} />)}
        </Picker>
    )
}

const styles = StyleSheet.create({
    picker: {
        backgroundColor: COLOR.BACKGROUND,
        borderWidth: 1,
        borderColor: COLOR.BACKGROUND
    }
})

export default Select
