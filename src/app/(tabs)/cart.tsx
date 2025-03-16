import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    StatusBar
} from 'react-native';
import {
    Ionicons,
    Feather,
    AntDesign,
    FontAwesome,
    MaterialCommunityIcons
} from '@expo/vector-icons';
import { FONT } from '@/src/constants/font';

const CartTab = () => {
    const [items, setItems] = useState([
        { id: 1, selected: false, quantity: 1 },
        { id: 2, selected: false, quantity: 1 },
        { id: 3, selected: false, quantity: 1 },
    ]);

    const toggleSelect = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    const toggleSelectAll = () => {
        const allSelected = items.every(item => item.selected);
        setItems(items.map(item => ({ ...item, selected: !allSelected })));
    };

    const updateQuantity = (id, delta) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const selectedCount = items.filter(item => item.selected).length;
    const totalItems = items.length;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Select All */}
                <View style={styles.selectAllContainer}>
                    <TouchableOpacity style={styles.checkboxContainer} onPress={toggleSelectAll}>
                        <View style={[styles.checkbox, selectedCount === totalItems && styles.checkboxSelected]}>
                            {selectedCount === totalItems && <Ionicons name="checkmark" size={16} color="white" />}
                        </View>
                        <Text style={styles.selectAllText}>Chọn tất cả ({selectedCount}/{totalItems})</Text>
                    </TouchableOpacity>
                </View>
                {/* Cart Items */}
                {items.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => toggleSelect(item.id)}
                        >
                            <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
                                {item.selected && <Ionicons name="checkmark" size={16} color="white" />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => toggleSelect(item.id)}>
                            <Image
                                source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cart%20%281%29-kjKGlIe8vhj3LZ2yfZOKC3PskHpJvh.png' }}
                                style={styles.productImage}
                            />
                        </TouchableOpacity>

                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>Claudette corset shirt dress in white</Text>

                            <View style={styles.productOptions}>
                                <Text style={styles.optionLabel}>Color: </Text>
                                <View style={styles.colorCircle} />
                                <Text style={styles.optionLabel}>Size: </Text>
                                <Text style={styles.optionValue}>XS</Text>
                            </View>

                            <View style={styles.priceContainer}>
                                <Text style={styles.currentPrice}>650.000đ</Text>
                                <Text style={styles.originalPrice}>790.950đ</Text>
                            </View>

                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Tổng: </Text>
                                <Text style={styles.totalCurrentPrice}>650.000đ</Text>
                                <Text style={styles.originalPrice}>790.950đ</Text>
                            </View>

                            <View style={styles.quantityAndTrashContainer}>
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => updateQuantity(item.id, -1)}
                                    >
                                        <Text style={styles.quantityButtonText}>−</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.quantityText}>{item.quantity}</Text>

                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => updateQuantity(item.id, 1)}
                                    >
                                        <Text style={styles.quantityButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={styles.trashButton}
                                    onPress={() => removeItem(item.id)}
                                >
                                    <Feather name="trash-2" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Order Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Giá trị đơn hàng</Text>
                        <Text style={styles.summaryValue}>2.133.950đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Giảm giá</Text>
                        <Text style={styles.summarySaveValue}>133.950đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tổng</Text>
                        <Text style={styles.summaryValue}>2.000.000đ</Text>
                    </View>
                </View>

                {/* Total and Checkout */}
                <View style={styles.checkoutContainer}>
                    <View style={styles.totalSummary}>
                        <Text style={styles.totalSummaryLabel}>Tổng</Text>
                        <Text style={styles.totalSummaryValue}>2.000.000đ</Text>
                    </View>
                    <View style={styles.savingsContainer}>
                        <Text style={styles.savingsLabel}>Tiết kiệm</Text>
                        <Text style={styles.savingsValue}>133.950đ</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutButton}>
                        <Feather name="shopping-cart" size={20} color="white" />
                        <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        marginBottom: 8
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checkboxSelected: {
        backgroundColor: 'black',
        borderColor: 'black',
    },
    selectAllText: {
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM
    },
    scrollView: {
        flex: 1,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 12,
        marginBottom: 8,
        marginHorizontal: 8,
        borderRadius: 16,
    },
    productImage: {
        width: 120,
        height: 160,
        borderRadius: 4,
        marginRight: 12,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    productOptions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    optionLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 4,
    },
    optionValue: {
        fontSize: 14,
    },
    colorCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    currentPrice: {
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
        color: 'red',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 14,
        fontFamily: FONT.LORA_MEDIUM,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 14,
        fontFamily: FONT.LORA_MEDIUM
    },
    totalCurrentPrice: {
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
        marginRight: 8
    },
    quantityAndTrashContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        height: 36,
        width: 110,
    },
    quantityButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityButtonText: {
        fontSize: 24,
        color: '#666',
        fontWeight: '400',
    },
    quantityText: {
        width: 36,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: FONT.LORA_MEDIUM,
    },
    trashButton: {
        padding: 8,
    },
    summaryContainer: {
        backgroundColor: 'white',
        padding: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 14,
    },
    summarySaveValue: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 14,
        color: 'red'
    },
    checkoutContainer: {
        padding: 16,
        marginBottom: 80,
    },
    totalSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalSummaryLabel: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM
    },
    totalSummaryValue: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM
    },
    savingsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    savingsLabel: {
        fontSize: 14,
        color: '#666',
        fontFamily: FONT.LORA_MEDIUM
    },
    savingsValue: {
        fontSize: 14,
        color: 'red',
        fontFamily: FONT.LORA_MEDIUM
    },
    checkoutButton: {
        backgroundColor: 'black',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: 20, // For home indicator area
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    cartBadgeContainer: {
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'black',
        borderRadius: 10,
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default CartTab;