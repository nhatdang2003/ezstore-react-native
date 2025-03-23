import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomButton from '@/src/components/CustomButton';
import { COLOR } from '@/src/constants/color';

const PaymentFailScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const errorMessage = params.message || 'Đã xảy ra lỗi trong quá trình thanh toán';

    const handleGoHome = () => {
        router.navigate('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="close-circle" size={120} color="#F44336" />
                </View>

                <Text style={styles.title}>Thanh toán thất bại</Text>
                <Text style={styles.message}>
                    {errorMessage}
                </Text>

                <View style={styles.buttonContainer}>
                    <CustomButton title="Về trang chủ"
                        onPress={handleGoHome}
                        variant="outlined"
                        style={{ backgroundColor: 'while' }}
                        textStyle={{ color: COLOR.PRIMARY }}
                    />
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
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
});

export default PaymentFailScreen;
