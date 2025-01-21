import { View, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { COLOR } from '@/src/constants/color'

interface LoadingOverlayProps {
    color?: string;
    size?: number | 'small' | 'large';
    backgroundColor?: string;
}

const LoadingOverlay = ({ 
    color = COLOR.PRIMARY,
    size = 'large',
    backgroundColor = 'rgba(255, 255, 255, 0.8)'
}: LoadingOverlayProps) => {
    return (
        <View style={[styles.overlay, { backgroundColor }]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default LoadingOverlay