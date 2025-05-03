"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native"
import { MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons"
import { COLOR } from "@/src/constants/color"
import { router, useLocalSearchParams } from "expo-router"
import { FONT } from "@/src/constants/font"
import { useCartStore } from "@/src/store/cartStore"
import { Notification } from "@/src/types/notification.type"
import { getProductByIds } from "@/src/services/product.service"
import { ProductDetail } from "@/src/types/product.type"
import { PaginatedResponse } from "@/src/types/response.type"

// Get screen width
const { width } = Dimensions.get("window")

const PAGE_SIZE = 10

const PromotionScreen = () => {
    const { notification } = useLocalSearchParams();
    const notificationData: Notification = JSON.parse(notification as string);
    const cartCount = useCartStore(state => state.cartCount);

    const [products, setProducts] = useState<ProductDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Keep track of mounted state to prevent state updates after unmount
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Parse the referenceIds from notification data
    const getProductIds = useCallback(() => {
        console.log('Notification data:', notificationData);

        if (!notificationData) {
            console.log('No notification data available');
            return [];
        }

        if (!notificationData.referenceIds) {
            console.log('No referenceIds in notification data');
            return [];
        }

        try {
            console.log('Raw referenceIds:', notificationData.referenceIds);

            const idsString = notificationData.referenceIds.trim();
            if (!idsString) {
                console.log('Empty referenceIds string');
                return [];
            }

            // Try splitting by comma first
            if (idsString.includes(',')) {
                const ids = idsString.split(',')
                    .map(id => id.trim())
                    .filter(id => id)
                    .map(id => parseInt(id, 10))
                    .filter(id => !isNaN(id));

                console.log('Parsed IDs (comma):', ids);
                return ids;
            }

            // Last attempt: try to parse as a single ID
            const id = parseInt(idsString, 10);
            if (!isNaN(id)) {
                console.log('Parsed single ID:', id);
                return [id];
            }

            console.log('Could not parse any valid IDs');
            return [];
        } catch (error) {
            console.error('Error parsing product IDs:', error);
            return [];
        }
    }, [notificationData]);

    // Fetch products from API without dependencies on state variables
    const fetchProducts = useCallback(async (page: number, shouldAppend: boolean) => {
        try {
            setError(null);
            const productIds = getProductIds();
            console.log('Fetching products with IDs:', productIds);

            if (productIds.length === 0) {
                console.log('No product IDs found');
                if (isMounted.current) {
                    setLoading(false);
                    setLoadingMore(false);
                    setHasMore(false);
                    setError('Không tìm thấy sản phẩm nào cho khuyến mãi này');
                }
                return;
            }

            console.log(`Calling API for page ${page}, pageSize ${PAGE_SIZE}`);
            // Properly type the API response
            const response: PaginatedResponse<ProductDetail> = await getProductByIds({
                ids: productIds,
                page,
                pageSize: PAGE_SIZE
            });

            if (!isMounted.current) {
                console.log('Component unmounted, skipping state updates');
                return;
            }

            // Access data properly from PaginatedResponse structure
            const productsData = response.data.data;
            const meta = response.data.meta;

            console.log(`Received ${productsData.length} products, meta:`, meta);

            if (productsData.length === 0) {
                setHasMore(false);
                if (page === 0) {
                    setError('Không tìm thấy sản phẩm nào cho khuyến mãi này');
                }
            } else {
                if (!shouldAppend) {
                    setProducts(productsData);
                } else {
                    setProducts(prev => [...prev, ...productsData]);
                }

                // Check if we're on the last page based on meta information
                const isLastPage = meta.page >= meta.pages - 1 || productsData.length < PAGE_SIZE;
                setHasMore(!isLastPage);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            if (isMounted.current) {
                setError('Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [getProductIds]);

    // Function to handle the loading of the first page of products
    const loadInitialProducts = useCallback(() => {
        console.log('Loading initial products...');
        setLoading(true);
        fetchProducts(0, false);
    }, [fetchProducts]);

    // Function to handle loading more products
    const loadMoreProducts = useCallback(() => {
        if (loadingMore || !hasMore || loading) {
            console.log('Skipping loadMore - already loading or no more data', { loadingMore, hasMore, loading });
            return;
        }

        console.log('Loading more products, page:', currentPage + 1);
        setLoadingMore(true);
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchProducts(nextPage, true);
    }, [currentPage, fetchProducts, hasMore, loading, loadingMore]);

    // Initial fetch when component mounts
    useEffect(() => {
        console.log('Component mounted, triggering initial load');
        loadInitialProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Calculate discount percentage
    const getDiscountPercentage = (price: number, priceWithDiscount: number) => {
        if (!price || price <= 0) return 0;
        const discount = ((price - priceWithDiscount) / price) * 100;
        return Math.round(discount);
    };

    // Product row component
    const ProductRow = ({ item }: { item: ProductDetail }) => {
        const discountPercentage = getDiscountPercentage(item.price, item.priceWithDiscount);
        const hasDiscount = discountPercentage > 0;

        return (
            <TouchableOpacity
                style={styles.productRow}
                activeOpacity={0.7}
                onPress={() => { router.push(`/product/${item.id}`) }}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150' }}
                        style={styles.productImage}
                    />
                    {hasDiscount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>-{discountPercentage}%</Text>
                        </View>
                    )}
                </View>
                <View style={styles.productInfo}>
                    <View>
                        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                            {item.name}
                        </Text>
                        <Text style={styles.categoryText}>
                            {item.categoryName}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: "space-between", flexDirection: "row" }}>
                        <View style={styles.priceContainer}>
                            {hasDiscount && (
                                <Text style={styles.originalPrice}>{item.price.toLocaleString()}đ</Text>
                            )}
                            <Text style={styles.discountedPrice}>{item.priceWithDiscount.toLocaleString()}đ</Text>
                        </View>
                        <TouchableOpacity
                            style={{ backgroundColor: COLOR.PRIMARY, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 6 }}
                            onPress={() => router.push(`/product/${item.id}`)}
                        >
                            <Text style={{ color: "#fff" }}>Mua ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity >
        );
    };

    // Render footer for FlatList
    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={COLOR.PRIMARY} />
                <Text style={styles.loadingText}>Đang tải thêm...</Text>
            </View>
        );
    };

    // Loading placeholder
    const LoadingPlaceholder = () => (
        <View style={styles.loadingContainer}>
            {Array.from({ length: 8 }).map((_, index) => (
                <View key={index} style={styles.placeholderRow}>
                    <View style={styles.placeholderImage} />
                    <View style={styles.placeholderContent}>
                        <View style={styles.placeholderText} />
                        <View style={styles.placeholderText2} />
                        <View style={styles.placeholderPrice} />
                    </View>
                </View>
            ))}
        </View>
    );

    // Format date for display
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Get promotion date display text
    const getPromotionDateText = () => {
        if (notificationData.startPromotionDate && notificationData.endPromotionDate) {
            return `Có hiệu lực từ ${formatDate(notificationData.startPromotionDate)} đến ${formatDate(notificationData.endPromotionDate)}`;
        }

        if (notificationData.startPromotionDate) {
            return `Có hiệu lực từ ${formatDate(notificationData.startPromotionDate)}`;
        }

        if (notificationData.endPromotionDate) {
            return `Có hiệu lực đến ${formatDate(notificationData.endPromotionDate)}`;
        }

        return 'Khuyến mãi có hạn';
    };

    // Empty state component with reload button
    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {error || 'Không có sản phẩm khuyến mãi'}
            </Text>
            <TouchableOpacity
                style={styles.reloadButton}
                onPress={loadInitialProducts}
            >
                <Text style={styles.reloadText}>Tải lại</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerTab}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Khuyến mãi</Text>
                <TouchableOpacity onPress={() => router.navigate("/cart")}>
                    <MaterialCommunityIcons name="cart-outline" size={24} color="black" />
                    {cartCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>
                                {cartCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
            {/* Promotion Header */}
            <View style={styles.promotionHeader}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.promotionTitle} numberOfLines={2} ellipsizeMode="tail">
                        {notificationData.title}
                    </Text>
                    <Text style={styles.promotionPeriod}>{getPromotionDateText()}</Text>
                </View>
            </View>

            {/* Products List */}
            {loading && products.length === 0 ? (
                <LoadingPlaceholder />
            ) : (
                <FlatList
                    data={products}
                    renderItem={({ item }) => <ProductRow item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.productList}
                    onEndReached={loadMoreProducts}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loadingMore ? renderFooter : null}
                    ListEmptyComponent={!loading ? <EmptyState /> : null}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    headerTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    promotionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: "#fff",
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: 12,
    },
    promotionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#e63946",
        lineHeight: 26,
    },
    promotionPeriod: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    bannerImage: {
        width: "100%",
        height: 120,
        marginBottom: 8,
    },
    productList: {
        padding: 12,
    },
    productRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: "hidden",
    },
    imageContainer: {
        position: "relative",
        width: 90,
        height: 120,
    },
    productImage: {
        width: 90,
        height: 120,
        resizeMode: "cover",
    },
    discountBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#FFF1F0",
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    discountText: {
        color: "#FF4D4F",
        fontSize: 12,
        fontWeight: "bold",
    },
    productInfo: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: "space-between",
    },
    productName: {
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 20,
    },
    categoryText: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    priceContainer: {
        alignItems: "flex-start",
        marginTop: 4,
    },
    originalPrice: {
        fontSize: 12,
        color: "#999",
        textDecorationLine: "line-through",
        marginRight: 8,
    },
    discountedPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#e63946",
    },
    loadingContainer: {
        padding: 12,
    },
    placeholderRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 12,
        overflow: "hidden",
        height: 100,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        backgroundColor: "#e0e0e0",
    },
    placeholderContent: {
        flex: 1,
        padding: 12,
        justifyContent: "space-between",
    },
    placeholderText: {
        height: 16,
        width: "90%",
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
    },
    placeholderText2: {
        height: 16,
        width: "60%",
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
        marginTop: 8,
    },
    placeholderPrice: {
        height: 20,
        width: "40%",
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
        marginTop: 8,
    },
    cartBadge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: '#FF424E',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    footerLoader: {
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    reloadButton: {
        backgroundColor: COLOR.PRIMARY,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    reloadText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
})

export default PromotionScreen

