import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
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
    icon?: ReactNode;
    error?: string;
    disabled?: boolean;
}

const Select = ({
    value,
    onChange,
    options,
    label,
    placeholder = 'Select an option',
    icon,
    error,
    disabled = false
}: SelectProps) => {
    const styledIcon = icon && React.cloneElement(icon as React.ReactElement, {
        color: '#666'
    });

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer} >
                {styledIcon}
                <Picker
                    style={styles.picker}
                    selectedValue={value}
                    onValueChange={(itemValue, itemIndex) =>
                        onChange(itemValue)
                    }>
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
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLOR.BACKGROUND,
        backgroundColor: COLOR.BACKGROUND,
        borderRadius: 8,
        paddingLeft: 16
    },
    picker: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
        borderWidth: 1,
        borderColor: COLOR.BACKGROUND
    },
    icon: {
        color: '#666'
    }
})

export default Select
