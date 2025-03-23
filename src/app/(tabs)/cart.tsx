import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import {
    Ionicons,
    Feather,
} from '@expo/vector-icons';
import { FONT } from '@/src/constants/font';
import { getUserCart, updateItemCart, deleteItemCart } from '@/src/services/cart.service';
import { CartItem } from '@/src/types/cart.type';
import { useFocusEffect, useRouter } from 'expo-router';
import ConfirmModal from '@/src/components/ConfirmModal';
import { getUserCartInfo } from '@/src/services/user.service';
import { useCartStore } from '@/src/store/cartStore';
import AlertModal from '@/src/components/AlertModal';

// Hàm chuyển đổi mã màu từ tên màu
const getColorCode = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
        'black': '#000000',
        'white': '#FFFFFF',
        'red': '#FF0000',
        'green': '#008000',
        'blue': '#0000FF',
        'yellow': '#FFFF00',
        'purple': '#800080',
        'pink': '#FFC0CB',
        'orange': '#FFA500',
        'gray': '#808080',
        'brown': '#A52A2A',
    };

    // Nếu màu đã là mã hex, trả về nguyên mã
    if (colorName.startsWith('#')) {
        return colorName;
    }

    // Trả về mã màu tương ứng hoặc màu mặc định nếu không tìm thấy
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
};

const CartTab = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState<string | undefined>(undefined);

    const setCartCount = useCartStore(state => state.setCartCount);

    useFocusEffect(
        useCallback(() => {
            fetchCartItems();
        }, [])
    )

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await getUserCart();
            setCartItems(response.data);
            setError(null);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu giỏ hàng:', err);
            setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (cartItemId: number) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(cartItemId)) {
                return prevSelected.filter(id => id !== cartItemId);
            } else {
                return [...prevSelected, cartItemId];
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.cartItemId));
        }
    };

    const updateQuantity = async (cartItemId: number, delta: number) => {
        try {
            // Cập nhật UI trước
            const updatedItems = cartItems.map(item => {
                if (item.cartItemId === cartItemId) {
                    const newQuantity = Math.max(1, Math.min(item.inStock, item.quantity + delta));
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });

            // Tìm item được cập nhật để gửi lên server
            const updatedItem = updatedItems.find(item => item.cartItemId === cartItemId);
            if (!updatedItem) return;

            setCartItems(updatedItems);

            // Gọi API để cập nhật
            await updateItemCart(updatedItem);
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng:', error);
            // Rollback UI nếu có lỗi
            fetchCartItems();

            // Thay thế Alert.alert bằng AlertDialog
            setAlertMessage("Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau.");
            setAlertVisible(true);
        }
    };

    const removeItem = (cartItemId: number) => {
        setItemToDelete(cartItemId);
        setDialogVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete === null) return;

        try {
            // Cập nhật UI trước
            setCartItems(prevItems =>
                prevItems.filter(item => item.cartItemId !== itemToDelete)
            );
            setSelectedItems(prevSelected =>
                prevSelected.filter(id => id !== itemToDelete)
            );

            // Gọi API để xóa
            await deleteItemCart(itemToDelete);

            // Sau khi xóa thành công, cập nhật số lượng trong giỏ hàng
            try {
                const cartInfoResponse = await getUserCartInfo();
                if (cartInfoResponse.data) {
                    // Cập nhật số lượng trong cartStore
                    setCartCount(cartInfoResponse.data.cartItemsCount);
                }
            } catch (cartError) {
                console.error('Lỗi khi cập nhật số lượng giỏ hàng:', cartError);
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            // Rollback UI nếu có lỗi
            fetchCartItems();

            // Thay thế Alert.alert bằng AlertDialog
            setAlertMessage("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
            setAlertVisible(true);
        } finally {
            setDialogVisible(false);
            setItemToDelete(null);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems.includes(item.cartItemId)) {
                return total + (item.price * item.quantity);
            }
            return total;
        }, 0);
    };

    const calculateDiscountTotal = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems.includes(item.cartItemId)) {
                const discount = item.price * item.discountRate * item.quantity;
                return total + discount;
            }
            return total;
        }, 0);
    };

    const calculateFinalTotal = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems.includes(item.cartItemId)) {
                return total + (item.finalPrice * item.quantity);
            }
            return total;
        }, 0);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            setAlertMessage("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
            setAlertVisible(true);
            return;
        }

        // Pass the selected cartItemIds to the checkout screen
        router.navigate({
            pathname: '/cart/checkout',
            params: { 
                cartItemIds: JSON.stringify(selectedItems) 
            }
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="black" />
                <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchCartItems}>
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={[styles.container, styles.emptyContainer]}>
                <Feather name="shopping-cart" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
                <TouchableOpacity
                    style={styles.continueShoppingButton}
                    onPress={() => router.navigate('/(tabs)')}
                >
                    <Text style={styles.continueShoppingText}>Tiếp tục mua sắm</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const subtotal = calculateSubtotal();
    const discountTotal = calculateDiscountTotal();
    const finalTotal = calculateFinalTotal();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Select All */}
                <View style={styles.selectAllContainer}>
                    <TouchableOpacity style={styles.checkboxContainer} onPress={toggleSelectAll}>
                        <View style={[styles.checkbox, selectedItems.length === cartItems.length && styles.checkboxSelected]}>
                            {selectedItems.length === cartItems.length && <Ionicons name="checkmark" size={16} color="white" />}
                        </View>
                        <Text style={styles.selectAllText}>Chọn tất cả ({selectedItems.length}/{cartItems.length})</Text>
                    </TouchableOpacity>
                </View>

                {/* Cart Items */}
                {cartItems.map((item) => (
                    <View key={item.cartItemId} style={styles.cartItem}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => toggleSelect(item.cartItemId)}
                        >
                            <View style={[styles.checkbox, selectedItems.includes(item.cartItemId) && styles.checkboxSelected]}>
                                {selectedItems.includes(item.cartItemId) && <Ionicons name="checkmark" size={16} color="white" />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push(`/product/${item.productId}`)}>
                            <Image
                                source={{ uri: item.productVariant.image || item.image }}
                                style={styles.productImage}
                            />
                        </TouchableOpacity>

                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>{item.productName}</Text>

                            <View style={styles.productOptions}>
                                <Text style={styles.optionLabel}>Màu: </Text>
                                <View
                                    style={[
                                        styles.colorCircle,
                                        { backgroundColor: getColorCode(item.productVariant.color || 'white') }
                                    ]}
                                />
                                <Text style={styles.optionLabel}>Size: </Text>
                                <Text style={styles.optionValue}>{item.productVariant.size}</Text>
                            </View>

                            <View style={styles.priceContainer}>
                                <Text style={styles.currentPrice}>{item.finalPrice.toLocaleString()}đ</Text>
                                {item.discountRate > 0 && (
                                    <Text style={styles.originalPrice}>{item.price.toLocaleString()}đ</Text>
                                )}
                            </View>

                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Tổng: </Text>
                                <Text style={styles.totalCurrentPrice}>
                                    {(item.finalPrice * item.quantity).toLocaleString()}đ
                                </Text>
                                {item.discountRate > 0 && (
                                    <Text style={styles.originalPrice}>
                                        {(item.price * item.quantity).toLocaleString()}đ
                                    </Text>
                                )}
                            </View>

                            <View style={styles.quantityAndTrashContainer}>
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.quantityButton,
                                            item.quantity <= 1 && styles.disabledButton
                                        ]}
                                        onPress={() => updateQuantity(item.cartItemId, -1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Text style={styles.quantityButtonText}>−</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.quantityText}>{item.quantity}</Text>

                                    <TouchableOpacity
                                        style={[
                                            styles.quantityButton,
                                            item.quantity >= item.inStock && styles.disabledButton
                                        ]}
                                        onPress={() => updateQuantity(item.cartItemId, 1)}
                                        disabled={item.quantity >= item.inStock}
                                    >
                                        <Text style={styles.quantityButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={styles.trashButton}
                                    onPress={() => removeItem(item.cartItemId)}
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
                        <Text style={styles.summaryValue}>{subtotal.toLocaleString()}đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Giảm giá:</Text>
                        <Text style={styles.summarySaveValue}>{discountTotal.toLocaleString()}đ</Text>
                    </View>
                    <View style={styles.totalSummary}>
                        <Text style={styles.totalSummaryLabel}>Tổng</Text>
                        <Text style={styles.totalSummaryValue}>{finalTotal.toLocaleString()}đ</Text>
                    </View>
                </View>

                {/* Checkout Button */}
                <View style={styles.checkoutContainer}>
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <Text style={styles.checkoutButtonText}>Thanh toán</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ConfirmModal
                visible={dialogVisible}
                message="Bạn có chắc chắn muốn bỏ sản phẩm này?"
                onCancel={() => {
                    setDialogVisible(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
            />

            <AlertModal
                visible={alertVisible}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: 'black',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
    },
    retryButtonText: {
        color: 'white',
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 16,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: FONT.LORA_MEDIUM,
        marginTop: 16,
        marginBottom: 24,
    },
    continueShoppingButton: {
        backgroundColor: 'black',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
    },
    continueShoppingText: {
        color: 'white',
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 16,
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
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 16,
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
    disabledButton: {
        opacity: 0.5,
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
    checkoutButton: {
        backgroundColor: 'black',
        borderRadius: 8,
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