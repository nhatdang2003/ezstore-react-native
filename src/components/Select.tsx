import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { COLOR } from '../constants/color';

interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    icon?: ReactNode;
    error?: string;
    disabled?: boolean;
}

const Select = ({
    value,
    onChange,
    options,
    label,
    placeholder = 'Chọn',
    icon,
    error,
    disabled = false
}: SelectProps) => {
    const iconColor = value ? '#333' : '#999';
    const styledIcon = icon && React.cloneElement(icon as React.ReactElement, {
        color: iconColor
    });

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer} >
                <View style={styles.icon}>{styledIcon}</View>
                <Picker
                    style={styles.picker}
                    placeholder={placeholder}
                    selectedValue={value}
                    onValueChange={(itemValue, itemIndex) =>
                        onChange(itemValue)
                    }>
                    <Picker.Item label={placeholder} value="" enabled={value === ""} style={styles.placeholder} />
                    {options.map((item) => <Picker.Item key={item.value} label={item.label} value={item.value} />)}
                </Picker>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    pickerContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLOR.BACKGROUND,
        backgroundColor: COLOR.BACKGROUND,
        borderRadius: 8,
        paddingLeft: 28
    },
    picker: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
        borderWidth: 1,
        borderColor: COLOR.BACKGROUND,
        borderRadius: 8
    },
    placeholder: {
        color: '#999'
    },
    icon: {
        position: 'absolute',
        left: 12,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    }
})

export default Select
