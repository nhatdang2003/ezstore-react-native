import { Text, StyleSheet, View } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ErrorMessageProps {
    message?: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    if (!message) return null;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#dc3545" />
            <Text style={styles.error}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    error: {
        color: '#dc3545',
        fontSize: 12,
    }
})

export default ErrorMessage