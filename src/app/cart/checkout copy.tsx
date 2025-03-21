import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FONT } from '@/src/constants/font';
import { useRouter } from 'expo-router';

const CheckoutScreen = () => {
    const router = useRouter();
    const [selectedPayment, setSelectedPayment] = useState('cod');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thanh toán</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Delivery Information */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
                    <TouchableOpacity>
                        <Text style={styles.editButton}>Sửa</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.deliveryInfo}>
                    <Text style={styles.deliveryName}>Đặng Minh Nhật</Text>
                    <Text style={styles.deliveryAddress}>1 Võ văn ngân, Thủ Đức</Text>
                    <Text style={styles.deliveryPhone}>0938951666</Text>
                </View>
            </View>

            {/* Payment Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

                {/* COD Option */}
                <TouchableOpacity
                    style={styles.paymentOption}
                    onPress={() => setSelectedPayment('cod')}
                >
                    <View style={styles.paymentIconContainer}>
                        <MaterialCommunityIcons name="cash" size={30} color="black" />
                    </View>
                    <Text style={styles.paymentText}>Thanh toán khi nhận hàng</Text>
                    <View style={[
                        styles.radioButton,
                        selectedPayment === 'cod' && styles.radioButtonSelected
                    ]}>
                        {selectedPayment === 'cod' && <View style={styles.radioButtonInner} />}
                    </View>
                </TouchableOpacity>

                {/* VnPay Option */}
                <TouchableOpacity
                    style={styles.paymentOption}
                    onPress={() => setSelectedPayment('vnpay')}
                >
                    <View style={styles.paymentIconContainer}>
                        <Image
                            source={require('@/src/assets/images/vnpay.png')}
                            style={styles.paymentIcon}
                        />
                    </View>
                    <Text style={styles.paymentText}>VnPay</Text>
                    <View style={[
                        styles.radioButton,
                        selectedPayment === 'vnpay' && styles.radioButtonSelected
                    ]}>
                        {selectedPayment === 'vnpay' && <View style={styles.radioButtonInner} />}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Total */}
            <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Tổng</Text>
                <Text style={styles.totalAmount}>119.000đ</Text>
            </View>

            {/* Pay Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payButtonText}>Thanh toán</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 18,
    },
    placeholder: {
        width: 24,
    },
    section: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 20,
        marginBottom: 16,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    paymentIconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    paymentIcon: {
        width: 30,
        height: 24,
        resizeMode: 'contain',
    },
    paymentText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#000',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#000',
    },
    editButton: {
        color: '#888',
        fontSize: 14,
    },
    deliveryInfo: {
        gap: 4,
    },
    deliveryName: {
        fontSize: 16,
        fontWeight: '500',
    },
    deliveryAddress: {
        fontSize: 16,
        color: '#666',
    },
    deliveryPhone: {
        fontSize: 16,
        color: '#666',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginTop: 'auto',
    },
    totalLabel: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    totalAmount: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    payButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CheckoutScreen;