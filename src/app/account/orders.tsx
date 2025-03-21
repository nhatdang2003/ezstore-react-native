import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"

// Header component
const Header = () => (
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
        <TouchableOpacity>
            <Text style={styles.headerAction}>Đồng ý</Text>
        </TouchableOpacity>
    </View>
)

// Product Card component
const ProductCard = ({ product }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Text style={styles.orderCode}>Mã đơn hàng: ORD-{product.orderId}</Text>
            <Text style={styles.orderDate}>Ngày đặt: {product.orderDate}</Text>
            {product.status && (
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{product.status}</Text>
                </View>
            )}
        </View>

        <View style={styles.productContainer}>
            <Image source={{ uri: product.image }} style={styles.productImage} />

            <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSize}>
                    Màu: {product.color}, Size: {product.size}
                </Text>
                <Text style={styles.productQuantity}>x{product.quantity}</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>{product.originalPrice} ₫</Text>
                    <Text style={styles.salePrice}>{product.salePrice} ₫</Text>
                </View>
            </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>1 sản phẩm</Text>
            <Text style={styles.summaryText}>Phí vận chuyển: {product.shippingFee} ₫</Text>
            <Text style={styles.summaryText}>Phí bảo hiểm: {product.insuranceFee} ₫</Text>
            <Text style={styles.totalText}>Tổng số tiền: {product.totalAmount} ₫</Text>
            <Text style={styles.paymentMethod}>Phương thức thanh toán: COD</Text>
        </View>

        <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Xem chi tiết</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{product.secondaryAction || "Đánh giá"}</Text>
            </TouchableOpacity>
        </View>
    </View>
)

// Main component
const ShoppingCartScreen = () => {
    // Sample data
    const products = [
        {
            orderId: "17237465555508",
            orderDate: "04-04-08/12/2024",
            name: "Quần short nữ",
            color: "Đỏ",
            size: "Size S",
            quantity: 1,
            originalPrice: "280.000",
            salePrice: "200.000",
            shippingFee: "30.000",
            insuranceFee: "0",
            totalAmount: "230.000",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/order-31QXKyZopYU43mTnV9o33dGFNwODfF.png",
            secondaryAction: "Mua lại",
        },
        {
            orderId: "17237465467755",
            orderDate: "04-04-08/12/2024",
            name: "Áo thun trơn trắng",
            color: "Trắng",
            size: "Size M",
            quantity: 1,
            originalPrice: "180.000",
            salePrice: "150.000",
            shippingFee: "30.000",
            insuranceFee: "0",
            totalAmount: "180.000",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/order-31QXKyZopYU43mTnV9o33dGFNwODfF.png",
            status: "Đã hủy",
            secondaryAction: "Đánh giá",
        },
        {
            orderId: "17237465457750",
            orderDate: "04-04-08/12/2024",
            name: "Áo đen trơn trắng",
            color: "Đen",
            size: "Size M",
            quantity: 1,
            originalPrice: "180.000",
            salePrice: "150.000",
            shippingFee: "30.000",
            insuranceFee: "0",
            totalAmount: "180.000",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/order-31QXKyZopYU43mTnV9o33dGFNwODfF.png",
            secondaryAction: "Đánh giá",
        },
        {
            orderId: "17237465464777",
            orderDate: "04-04-08/12/2024",
            name: "Áo dài tay nữ dài mỏng",
            color: "Đen",
            size: "Size M",
            quantity: 1,
            originalPrice: "280.000",
            salePrice: "250.000",
            shippingFee: "30.000",
            insuranceFee: "0",
            totalAmount: "280.000",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/order-31QXKyZopYU43mTnV9o33dGFNwODfF.png",
            secondaryAction: "Đánh giá",
        },
        {
            orderId: "17237465459270",
            orderDate: "04-04-08/12/2024",
            name: "Bộ áo nữ và váy suông ngắn",
            color: "Trắng",
            size: "Size M",
            quantity: 1,
            originalPrice: "527.000",
            salePrice: "497.000",
            shippingFee: "30.000",
            insuranceFee: "0",
            totalAmount: "527.000",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/order-31QXKyZopYU43mTnV9o33dGFNwODfF.png",
            status: "Đang giao hàng",
            secondaryAction: "Đánh giá",
        },
    ]

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Header />
            <ScrollView style={styles.scrollView}>
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    headerAction: {
        fontSize: 14,
        color: "#0066cc",
    },
    scrollView: {
        flex: 1,
    },
    card: {
        backgroundColor: "#fff",
        marginBottom: 8,
        padding: 12,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        flexWrap: "wrap",
    },
    orderCode: {
        fontSize: 13,
        fontWeight: "bold",
    },
    orderDate: {
        fontSize: 12,
        color: "#666",
    },
    statusContainer: {
        backgroundColor: "#FFF9C4",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        color: "#FF6F00",
    },
    productContainer: {
        flexDirection: "row",
        marginBottom: 12,
    },
    productImage: {
        width: 80,
        height: 100,
        borderRadius: 4,
        marginRight: 12,
    },
    productDetails: {
        flex: 1,
        justifyContent: "space-between",
    },
    productName: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    productSize: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    productQuantity: {
        fontSize: 12,
        marginBottom: 4,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    originalPrice: {
        fontSize: 12,
        color: "#999",
        textDecorationLine: "line-through",
        marginRight: 8,
    },
    salePrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#f44336",
    },
    divider: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 12,
    },
    summaryContainer: {
        marginBottom: 12,
    },
    summaryText: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    totalText: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    paymentMethod: {
        fontSize: 12,
        color: "#666",
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 4,
        marginLeft: 8,
    },
    actionButtonText: {
        fontSize: 12,
        color: "#333",
    },
})

export default ShoppingCartScreen

