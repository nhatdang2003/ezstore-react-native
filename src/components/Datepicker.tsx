import React, { useState } from 'react'
import { View, Text, Platform, Pressable, StyleSheet } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { Ionicons } from '@expo/vector-icons'
import { COLOR } from '../constants/color'

interface DatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
    label?: string;
    placeholder?: string;
    mode?: 'date' | 'time' | 'datetime';
    minimumDate?: Date;
    maximumDate?: Date;
    error?: string;
    iconColor?: string;
}

const DatePicker = ({
    value,
    onChange,
    label,
    placeholder = 'Select date',
    mode = 'date',
    minimumDate,
    maximumDate,
    error,
    iconColor = '#666'
}: DatePickerProps) => {
    const [show, setShow] = useState(false);

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || value;
        setShow(Platform.OS === 'ios');
        onChange(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const formatDate = (date: Date) => {
        switch (mode) {
            case 'date':
                return format(date, 'dd/MM/yyyy');
            case 'time':
                return format(date, 'HH:mm');
            case 'datetime':
                return format(date, 'dd/MM/yyyy HH:mm');
            default:
                return format(date, 'dd/MM/yyyy');
        }
    };

    const getIcon = () => {
        switch (mode) {
            case 'time':
                return 'time-outline';
            case 'datetime':
                return 'calendar-outline';
            default:
                return 'calendar-outline';
        }
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <Pressable
                onPress={showDatepicker}
                style={[
                    styles.button,
                    error && styles.buttonError
                ]}
            >
                <View style={styles.buttonContent}>
                    <Ionicons
                        name={getIcon()}
                        size={20}
                        color={iconColor}
                        style={styles.icon}
                    />
                    <Text style={[
                        styles.buttonText,
                        !value && styles.placeholder
                    ]}>
                        {value ? formatDate(value) : placeholder}
                    </Text>
                </View>
            </Pressable>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onDateChange}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                />
            )}
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
    button: {
        height: 48,
        borderWidth: 1,
        borderColor: COLOR.BACKGROUND,
        borderRadius: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: COLOR.BACKGROUND,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    buttonError: {
        borderColor: '#ff3333',
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    placeholder: {
        color: '#999',
    },
    errorText: {
        color: '#ff3333',
        fontSize: 12,
        marginTop: 4,
    },
})

export default DatePicker
