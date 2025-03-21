import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar, ScrollView, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FONT } from '@/src/constants/font';
import { useRouter } from 'expo-router';

const CustomSwitch = ({ value, onValueChange }) => {
    const translateX = useState(new Animated.Value(value ? 20 : 0))[0];

    const toggleSwitch = () => {
        Animated.spring(translateX, {
            toValue: value ? 0 : 20,
            useNativeDriver: true,
        }).start();
        onValueChange(!value);
    };

    return (
        <Pressable
            onPress={toggleSwitch}
            style={[
                styles.switchContainer,
                { backgroundColor: value ? '#000' : '#E9E9EA' }
            ]}
        >
            <Animated.View
                style={[
                    styles.switchThumb,
                    {
                        transform: [{ translateX }],
                        backgroundColor: value ? '#fff' : '#fff'
                    }
                ]}
            />
        </Pressable>
    );
};

const CheckoutScreen = () => {
    const router = useRouter();
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [usePoints, setUsePoints] = useState(false);

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

            <ScrollView showsVerticalScrollIndicator={false}>
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

                {/* Selected Products */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>

                    {/* Product 1 */}
                    <View style={styles.productItem}>
                        <Image
                            source={{ uri: 'https://placeholder.svg?height=80&width=80' }}
                            style={styles.productImage}
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>Áo jumper</Text>
                            <Text style={styles.productVariant}>Màu: Đen, Kích thước: L</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.currentPrice}>86.300đ</Text>
                                <Text style={styles.originalPrice}>109.000đ</Text>
                            </View>
                            <Text style={styles.quantity}>Số lượng: 1</Text>
                            <Text style={styles.totalPrice}>Tổng: 86.300đ</Text>
                        </View>

                    </View>

                    {/* Product 2 */}
                    <View style={styles.productItem}>
                        <Image
                            source={{ uri: 'https://placeholder.svg?height=80&width=80' }}
                            style={styles.productImage}
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>Áo kiểu cổ chữ V</Text>
                            <Text style={styles.productVariant}>Màu: Xanh dương, Kích thước: L</Text>
                            <Text style={styles.currentPrice}>32.700đ</Text>
                            <Text style={styles.quantity}>Số lượng: 1</Text>
                            <Text style={styles.totalPrice}>Tổng: 32.700đ</Text>
                        </View>
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
                        <Text style={styles.paymentText}>VNPay</Text>
                        <View style={[
                            styles.radioButton,
                            selectedPayment === 'vnpay' && styles.radioButtonSelected
                        ]}>
                            {selectedPayment === 'vnpay' && <View style={styles.radioButtonInner} />}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Points Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Điểm thưởng</Text>
                    <View style={styles.pointsContainer}>
                        <View style={styles.pointsInfo}>
                            <Text style={styles.pointsText}>Điểm hiện có: 1000</Text>
                            <Text style={styles.pointsValue}>(Tương đương 10.000đ)</Text>
                        </View>
                        <CustomSwitch
                            value={usePoints}
                            onValueChange={setUsePoints}
                        />
                    </View>
                </View>

                {/* Payment Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tổng tiền hàng</Text>
                        <Text style={styles.summaryValue}>119.000đ</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, styles.discountLabel]}>Giảm giá</Text>
                        <Text style={styles.discountValue}>-22.700đ</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                        <Text style={styles.summaryValue}>22.000đ</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.totalSummaryLabel}>Tổng thanh toán</Text>
                        <Text style={styles.totalSummaryValue}>119.000đ</Text>
                    </View>
                </View>

                {/* Total and Pay Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.payButton}>
                        <Text style={styles.payButtonText}>Thanh toán</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    // Points styles
    pointsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pointsInfo: {
        flex: 1,
    },
    pointsText: {
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
        marginBottom: 4,
    },
    pointsValue: {
        fontSize: 14,
        color: '#666',
    },
    // Switch styles
    switchContainer: {
        width: 50,
        height: 30,
        borderRadius: 15,
        padding: 5,
        justifyContent: 'center',
    },
    switchThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    // Product styles
    productItem: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingBottom: 16,
    },
    productImage: {
        width: 90,
        height: 120,
        borderRadius: 8,
        marginRight: 12,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        marginBottom: 4,
        fontFamily: FONT.LORA_MEDIUM,
    },
    productVariant: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    currentPrice: {
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
        color: '#e53935',
    },
    originalPrice: {
        fontSize: 14,
        fontFamily: FONT.LORA_MEDIUM,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    quantity: {
        fontSize: 14,
        fontFamily: FONT.LORA_MEDIUM,
        color: '#666',
    },
    totalPrice: {
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
        marginTop: 4,
    },
    // Summary styles
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    discountLabel: {
        color: '#4caf50',
    },
    discountValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4caf50',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    totalSummaryLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: FONT.LORA_MEDIUM,
    },
    totalSummaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: FONT.LORA_MEDIUM,
    },
    // Footer styles
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
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