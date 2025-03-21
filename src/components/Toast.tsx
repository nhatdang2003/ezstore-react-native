import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface ToastProps {
    visible: boolean;
    message: string;
    onHide: () => void;
    type?: 'success' | 'error';
    duration?: number;
}

const { width } = Dimensions.get('window');

const Toast = ({ visible, message, onHide, type = 'success', duration = 2000 }: ToastProps) => {
    const opacity = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(duration),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                onHide();
            });
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <AntDesign
                        name="check"
                        size={28}
                        color="#000000"
                        style={styles.checkIcon}
                    />
                </View>
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderRadius: 8,
        width: width * 0.4,
        maxWidth: 200,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    checkIcon: {
        fontWeight: 'bold',
        transform: [{ scale: 1.1 }],
    },
    message: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default Toast;