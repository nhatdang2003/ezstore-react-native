import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ConfirmModal from '@/src/components/ConfirmModal';
import { validateVnpayPayment } from '@/src/services/payment.service';

const PaymentScreen = () => {
    const { orderId, orderCode, paymentUrl } = useLocalSearchParams();
    const [verifying, setVerifying] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const webViewRef = useRef<WebView>(null);
    const router = useRouter();

    if (!paymentUrl) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Không tìm thấy URL thanh toán</Text>
            </View>
        );
    }

    // Xử lý khi WebView thay đổi URL
    const handleNavigationStateChange = async (navState: any) => {
        // Kiểm tra nếu URL chứa callback từ VNPay
        if (navState.url.includes('/api/v1/payment/vnpay_return') || navState.url.includes('vnp_ResponseCode=')) {
            // Ngăn chặn WebView chuyển hướng đến URL này
            webViewRef.current?.stopLoading();

            setVerifying(true);

            try {
                // Trích xuất toàn bộ tham số từ URL
                const callbackUrl = navState.url;
                const urlObj = new URL(callbackUrl);
                const queryParams = urlObj.search.substring(1); // Lấy phần query string và bỏ đi dấu ?

                // Gọi API để xác thực kết quả giao dịch
                const response = await validateVnpayPayment(queryParams);

                // Kiểm tra kết quả từ API
                if (response.statusCode === 200) {
                    // Thanh toán thành công
                    router.replace({
                        pathname: '/payment/success',
                        params: {
                            orderId: orderId,
                            orderCode: orderCode
                        }
                    });
                } else {
                    // Thanh toán thất bại
                    const errorMessage = response?.message || 'Giao dịch không thành công';
                    router.replace({
                        pathname: '/payment/fail',
                        params: { message: errorMessage }
                    });
                }
            } catch (error) {
                console.error('Lỗi khi xác thực thanh toán:', error);
                router.replace({
                    pathname: '/payment/fail',
                    params: { message: 'Đã xảy ra lỗi khi xác thực thanh toán' }
                });
            } finally {
                setVerifying(false);
            }

            return false; // Ngăn chặn WebView chuyển hướng
        }
        return true; // Cho phép WebView chuyển hướng đến các URL khác
    };

    // Hàm đóng WebView
    const handleCloseWebView = () => {
        if (verifying) return; // Không cho phép đóng khi đang xác thực
        setConfirmVisible(true);
    };

    // Xử lý khi xác nhận đóng WebView
    const handleConfirmClose = () => {
        setConfirmVisible(false);
        router.replace({
            pathname: '/payment/fail',
            params: { message: 'Thanh toán đã bị hủy' }
        });
    };

    // Xử lý khi hủy đóng WebView
    const handleCancelClose = () => {
        setConfirmVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* AppBar với nút thoát */}
            <View style={styles.appBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleCloseWebView}
                    disabled={verifying}
                >
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Thanh toán</Text>
                <View style={styles.placeholder} />
            </View>

            {verifying && (
                <View style={styles.loadingOverlay}>
                    <Text style={styles.loadingText}>Đang xác thực thanh toán...</Text>
                </View>
            )}

            <WebView
                ref={webViewRef}
                source={{ uri: paymentUrl as string }}
                style={styles.webview}
                onNavigationStateChange={handleNavigationStateChange}
                onShouldStartLoadWithRequest={(request) => {
                    // Kiểm tra URL trước khi tải
                    if (request.url.includes('/api/v1/payment/vnpay_return') || request.url.includes('vnp_ResponseCode=')) {
                        handleNavigationStateChange({ url: request.url });
                        return false; // Không tải URL này
                    }
                    return true; // Tải các URL khác
                }}
            />

            {/* Confirm Modal */}
            <ConfirmModal
                visible={confirmVisible}
                message="Bạn có chắc muốn hủy quá trình thanh toán?"
                onCancel={handleCancelClose}
                onConfirm={handleConfirmClose}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    appBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
    },
    appBarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40, // Để cân bằng với nút back
    },
    webview: {
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default PaymentScreen;