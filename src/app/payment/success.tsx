import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT } from '@/src/constants/font';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/src/store/cartStore';
import CustomButton from '@/src/components/CustomButton';
import { COLOR } from '@/src/constants/color';

const PaymentSuccessScreen = () => {
    const router = useRouter();
    const setCartCount = useCartStore(state => state.setCartCount);

    // Reset giỏ hàng khi thanh toán thành công
    useEffect(() => {
        setCartCount(0);
    }, []);

    const handleGoHome = () => {
        router.navigate('/(tabs)');
    };

    const handleViewOrder = () => {
        router.navigate('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={120} color="#4CAF50" />
                </View>

                <Text style={styles.title}>Đặt hàng thành công!</Text>
                <Text style={styles.message}>
                    Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
                </Text>

                <Text style={styles.orderInfo}>
                    Mã đơn hàng: #ORD{Math.floor(100000 + Math.random() * 900000)}
                </Text>

                <View style={styles.buttonContainer}>
                    <CustomButton title="Xem đơn hàng"
                        onPress={handleViewOrder} variant="filled"
                        style={{ backgroundColor: COLOR.PRIMARY }}
                        textStyle={{ color: 'white' }} />
                    <CustomButton title="Về trang chủ"
                        onPress={handleGoHome}
                        variant="outlined"
                        style={{ backgroundColor: 'white' }}
                        textStyle={{ color: COLOR.PRIMARY }} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 24,
    },
    orderInfo: {
        fontSize: 18,
        fontFamily: FONT.LORA_MEDIUM,
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
});

export default PaymentSuccessScreen;
