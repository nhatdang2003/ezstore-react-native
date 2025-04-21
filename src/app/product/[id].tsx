import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
    FlatList,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    getProductDetail,
    getSimilarProducts,
    getRecommendedProducts,
    addToViewedProducts,
    getViewedProductIds,
    getViewedProducts,
    getProductReviews,
} from "@/src/services/product.service";
import {
    Product,
    ProductDetail,
    ProductVariant,
    ProductReview,
} from "@/src/types/product.type";
import { useCartStore } from "@/src/store/cartStore";
import { getUserCartInfo } from "@/src/services/user.service";
import { addToCart } from "@/src/services/cart.service";
import Toast from "@/src/components/Toast";

const { width } = Dimensions.get("window");

const ProductDetailScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        null
    );
    const [displayImages, setDisplayImages] = useState<string[]>([]);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const mainImageRef = useRef<FlatList>(null);
    const thumbnailRef = useRef<ScrollView>(null);
    const setCartCount = useCartStore((state) => state.setCartCount);
    const cartCount = useCartStore((state) => state.cartCount);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);

                // Lấy chi tiết sản phẩm
                const productResponse = await getProductDetail(Number(id));
                if (productResponse.statusCode === 200) {
                    const productData = productResponse.data;
                    setProduct(productData);
                    setDisplayImages(productData.images);

                    // Thêm sản phẩm hiện tại vào danh sách đã xem
                    await addToViewedProducts(Number(id));

                    // Lấy đánh giá sản phẩm
                    if (productData.slug) {
                        try {
                            setLoadingReviews(true);
                            const reviewsResponse = await getProductReviews({
                                slug: productData.slug,
                                rating: 5, // Chỉ lấy đánh giá 5 sao
                                page: 0,   // Trang đầu tiên (index 0)
                                pageSize: 2 // Hiển thị 2 đánh giá
                            });

                            if (reviewsResponse.statusCode === 200) {
                                console.log(reviewsResponse.data.data)
                                setReviews(reviewsResponse.data.data || []);
                            }
                        } catch (reviewError) {
                            console.error("Lỗi khi lấy đánh giá sản phẩm:", reviewError);
                        } finally {
                            setLoadingReviews(false);
                        }
                    }

                    // Lấy danh sách ID sản phẩm đã xem từ AsyncStorage
                    const viewedIds = await getViewedProductIds();

                    // Lấy sản phẩm tương tự dựa trên danh mục
                    if (productData.categoryId) {
                        const similarResponse = await getSimilarProducts(
                            productData.categoryId
                        );
                        if (similarResponse.statusCode === 200 && similarResponse.data) {
                            // Lọc ra các sản phẩm khác với sản phẩm hiện tại
                            const filteredSimilarProducts = similarResponse.data.data.filter(
                                (p: Product) => p.id !== productData.id
                            );
                            setSimilarProducts(filteredSimilarProducts);
                        } else {
                            console.log("Không thể lấy sản phẩm tương tự:", similarResponse);
                            setSimilarProducts([]);
                        }
                    }

                    // Lấy sản phẩm đề xuất
                    const recommendedResponse = await getRecommendedProducts();
                    if (
                        recommendedResponse.statusCode === 200 &&
                        recommendedResponse.data
                    ) {
                        // Lọc ra các sản phẩm khác với sản phẩm hiện tại
                        const filteredRecommendedProducts =
                            recommendedResponse.data.data.filter(
                                (p: Product) => p.id !== productData.id
                            );
                        setRecommendedProducts(filteredRecommendedProducts);
                    } else {
                        console.log("Không thể lấy sản phẩm đề xuất:", recommendedResponse);
                        setRecommendedProducts([]);
                    }

                    // Lấy danh sách sản phẩm đã xem
                    const recentlyViewedResponse = await getViewedProducts();
                    if (
                        recentlyViewedResponse.statusCode === 200 &&
                        recentlyViewedResponse.data
                    ) {
                        // Lọc bỏ sản phẩm hiện tại
                        const productsFromApi = recentlyViewedResponse.data.data.filter(
                            (p: Product) => p.id !== productData.id
                        );

                        // Sắp xếp sản phẩm theo thứ tự ID trong AsyncStorage
                        const sortedViewedProducts = viewedIds
                            .filter((viewedId) => viewedId !== productData.id) // Loại bỏ ID sản phẩm hiện tại
                            .map((viewedId) => {
                                // Tìm sản phẩm tương ứng với ID từ AsyncStorage
                                return productsFromApi.find((p) => p.id === viewedId);
                            })
                            .filter(Boolean); // Lọc bỏ các giá trị undefined

                        setViewedProducts(sortedViewedProducts as Product[]);
                    } else {
                        console.log(
                            "Không thể lấy sản phẩm đã xem gần đây:",
                            recentlyViewedResponse
                        );
                        setViewedProducts([]);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
                setSimilarProducts([]);
                setRecommendedProducts([]);
                setViewedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductData();
        }

        // Cleanup function
        return () => {
            // Reset states khi unmount
            setProduct(null);
            setSimilarProducts([]);
            setRecommendedProducts([]);
            setViewedProducts([]);
            setSelectedColor(null);
            setSelectedSize(null);
            setQuantity(1);
            setCurrentImageIndex(0);
            setValidationError(null);
            setSelectedVariant(null);
            setDisplayImages([]);
            setReviews([]);
        };
    }, [id]);

    // Cập nhật khi chọn màu sắc
    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        setSelectedSize(null); // Reset size khi đổi màu
        setQuantity(1); // Reset số lượng
        setValidationError(null);

        // Tìm variant đầu tiên của màu này để lấy hình ảnh
        if (product && product.variants) {
            const variantWithColor = product.variants.find((v) => v.color === color);
            if (
                variantWithColor &&
                variantWithColor.images &&
                variantWithColor.images.length > 0
            ) {
                // Lấy hình ảnh đầu tiên của variant
                const variantImage = variantWithColor.images[0];

                // Chuyển đến hình ảnh đầu tiên (index 0)
                handleImageChange(0);

                // Tạo một bản sao của mảng hình ảnh
                const updatedImages = [...product.images];

                // Thay thế hình ảnh đầu tiên bằng hình ảnh của variant
                updatedImages[0] = variantImage;

                // Cập nhật sản phẩm với mảng hình ảnh mới
                setProduct({
                    ...product,
                    images: updatedImages,
                });
            }
        }
    };

    // Cập nhật khi chọn kích thước
    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        setQuantity(1); // Reset số lượng
        setValidationError(null);

        // Tìm variant tương ứng với màu và kích thước đã chọn
        if (product && product.variants && selectedColor) {
            const variant = product.variants.find(
                (v) => v.color === selectedColor && v.size === size
            );
            setSelectedVariant(variant || null);
        }
    };

    // Xử lý tăng số lượng
    const incrementQuantity = () => {
        if (selectedVariant) {
            // Kiểm tra số lượng tối đa có thể thêm
            if (quantity < selectedVariant.quantity) {
                setQuantity(quantity + 1);
                setValidationError(null);
            } else {
                setValidationError(
                    `Chỉ còn ${selectedVariant.quantity} sản phẩm trong kho`
                );
            }
        } else {
            setQuantity(quantity + 1);
        }
    };

    // Xử lý giảm số lượng
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setValidationError(null);
        }
    };

    const showToast = (
        message: string,
        type: "success" | "error" = "success"
    ) => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);
    };

    const handleAddToCart = async () => {
        if (!selectedColor) {
            setValidationError("Vui lòng chọn màu sắc");
            return;
        }

        if (!selectedSize) {
            setValidationError("Vui lòng chọn kích thước");
            return;
        }

        if (!selectedVariant) {
            setValidationError("Không tìm thấy biến thể sản phẩm");
            return;
        }

        if (quantity > selectedVariant.quantity) {
            setValidationError(
                `Chỉ còn ${selectedVariant.quantity} sản phẩm trong kho`
            );
            return;
        }

        try {
            const cartData = {
                productVariantId: selectedVariant.id,
                quantity: quantity,
            };

            const response = await addToCart(cartData);

            if (response.statusCode === 200) {
                const userInfo = await getUserCartInfo();
                if (userInfo.data) {
                    setCartCount(userInfo.data.cartItemsCount);
                }

                setValidationError(null);
                showToast("Đã thêm vào giỏ");
            } else {
                showToast("Có lỗi xảy ra khi thêm vào giỏ hàng", "error");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            showToast("Có lỗi xảy ra khi thêm vào giỏ hàng", "error");
        }
    };

    const handleImageChange = (index: number) => {
        setCurrentImageIndex(index);

        // Scroll main image to the selected index
        mainImageRef.current?.scrollToIndex({
            index,
            animated: true,
        });

        // Scroll thumbnail to make the selected thumbnail visible
        thumbnailRef.current?.scrollTo({
            x: index * 70 - width / 2 + 35, // Center the selected thumbnail
            animated: true,
        });
    };

    const handleMainImageScroll = (event: any) => {
        const slideIndex = Math.round(
            event.nativeEvent.contentOffset.x /
            event.nativeEvent.layoutMeasurement.width
        );
        if (slideIndex !== currentImageIndex) {
            setCurrentImageIndex(slideIndex);

            // Scroll thumbnail to make the selected thumbnail visible
            thumbnailRef.current?.scrollTo({
                x: slideIndex * 70 - width / 2 + 35, // Center the selected thumbnail
                animated: true,
            });
        }
    };

    const getUniqueColors = () => {
        if (!product || !product.variants) return [];
        const uniqueColors = [...new Set(product.variants.map((v) => v.color))];
        return uniqueColors.map((color) => ({
            id: color,
            color: getColorCode(color),
        }));
    };

    const getColorCode = (colorName: string) => {
        const colorMap: Record<string, string> = {
            BLACK: "#000000",
            WHITE: "#FFFFFF",
            RED: "#FF0000",
            GREEN: "#008000",
            BLUE: "#0000FF",
            YELLOW: "#FFFF00",
            GRAY: "#808080",
            BROWN: "#A52A2A",
            PURPLE: "#800080",
            PINK: "#FFC0CB",
            ORANGE: "#FFA500",
        };
        return colorMap[colorName] || "#000000";
    };

    const getAvailableSizes = () => {
        if (!product || !product.variants) return [];
        const filteredVariants = selectedColor
            ? product.variants.filter((v) => v.color === selectedColor)
            : product.variants;
        return [...new Set(filteredVariants.map((v) => v.size))];
    };

    const getVariantImage = () => {
        if (!product || !product.variants || !selectedColor)
            return product?.images[0];

        const variant = product.variants.find((v) => v.color === selectedColor);
        if (variant && variant.images && variant.images.length > 0) {
            return variant.images[0];
        }

        return product.images[0];
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <AntDesign key={`star-${i}`} name="star" size={14} color="#FFD700" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <AntDesign key="half-star" name="staro" size={14} color="#FFD700" />
            );
        }

        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <AntDesign
                    key={`empty-star-${i}`}
                    name="staro"
                    size={14}
                    color="#FFD700"
                />
            );
        }

        return stars;
    };

    const renderProductItem = (item: Product) => (
        <TouchableOpacity
            key={item.id}
            style={styles.productItem}
            onPress={() => {
                // Sử dụng push để stack màn hình mới
                router.push(`/product/${item.id}`);
            }}
        >
            <Image source={{ uri: item.images[0] }} style={styles.productItemImage} />
            <Text style={styles.productItemPrice}>
                {item.priceWithDiscount?.toLocaleString()}₫
            </Text>
            <View style={styles.productItemRating}>
                {renderStars(item.averageRating)}
            </View>
            <Text style={styles.productItemName} numberOfLines={2}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const handleGoHome = () => {
        router.navigate("/(tabs)");
    };

    // Render đánh giá sản phẩm
    const renderReviewItem = (review: ProductReview) => (
        <View key={review.reviewId} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <View style={styles.userInfo}>
                    {review.avatar ? (
                        <Image source={{ uri: review.avatar }} style={styles.userAvatar} />
                    ) : (
                        <View style={styles.userAvatar}>
                            <FontAwesome name="user" size={14} color="#666" />
                        </View>
                    )}
                    <Text style={styles.username}>
                        {review.firstName ? `${review.firstName} ${review.lastName || ''}` : 'Người dùng ẩn danh'}
                    </Text>
                </View>
                <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </Text>
            </View>
            <View style={styles.ratingStars}>
                {renderStars(review.rating)}
            </View>
            <Text style={styles.variantInfo}>
                {review.variant ? `${review.variant.color}, size ${review.variant.size}` : ''}
            </Text>
            <Text style={styles.reviewContent} ellipsizeMode="tail" numberOfLines={2}>
                {review.description}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>Không thể tải thông tin sản phẩm</Text>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Main Product Image Carousel */}
                <View style={styles.mainImageContainer}>
                    <FlatList
                        ref={mainImageRef}
                        data={product.images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleMainImageScroll}
                        renderItem={({ item }) => (
                            <View style={styles.mainImageSlide}>
                                <Image
                                    source={{ uri: item }}
                                    style={styles.mainImage}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        keyExtractor={(_, index) => `main-image-${index}`}
                    />

                    {/* Image Pagination Indicator */}
                    <View style={styles.paginationContainer}>
                        {product.images.map((_, index) => (
                            <View
                                key={`dot-${index}`}
                                style={[
                                    styles.paginationDot,
                                    currentImageIndex === index && styles.paginationDotActive,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Thumbnail Images - không còn sticky */}
                <View style={styles.thumbnailContainer}>
                    <ScrollView
                        ref={thumbnailRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {product.images.map((image, index) => (
                            <TouchableOpacity
                                key={`thumb-${index}`}
                                onPress={() => handleImageChange(index)}
                                style={[
                                    styles.thumbnailButton,
                                    currentImageIndex === index && styles.selectedThumbnail,
                                ]}
                            >
                                <View style={styles.thumbnailImageContainer}>
                                    <Image
                                        source={{ uri: image }}
                                        style={styles.thumbnailImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{product.name}</Text>

                    <View style={styles.priceContainer}>
                        <View>
                            <Text style={styles.currentPrice}>
                                {product.minPriceWithDiscount?.toLocaleString()}₫
                                {product.minPriceWithDiscount !==
                                    product.maxPriceWithDiscount &&
                                    ` - ${product.maxPriceWithDiscount?.toLocaleString()}₫`}
                            </Text>
                            {product.discountRate > 0 && (
                                <Text style={styles.originalPrice}>
                                    {product.minPrice?.toLocaleString()}₫
                                    {product.minPrice !== product.maxPrice &&
                                        ` - ${product.maxPrice?.toLocaleString()}₫`}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.soldCount}>
                            Đã bán: {product.numberOfSold?.toLocaleString()} sản phẩm
                        </Text>
                    </View>

                    <View style={styles.ratingContainer}>
                        {renderStars(product.averageRating)}
                        <Text style={styles.ratingText}>
                            {product.averageRating ? product.averageRating.toFixed(1) : 0}
                        </Text>
                        <Text style={styles.reviewCount}>
                            ({product.numberOfReviews} đánh giá)
                        </Text>
                    </View>

                    {/* Color Selection */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Màu sắc</Text>
                        <View style={styles.colorOptions}>
                            {getUniqueColors().map((color) => (
                                <TouchableOpacity
                                    key={color.id}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color.color },
                                        selectedColor === color.id && styles.selectedColorOption,
                                    ]}
                                    onPress={() => handleColorSelect(color.id)}
                                >
                                    {selectedColor === color.id && (
                                        <AntDesign
                                            name="check"
                                            size={16}
                                            color={color.color === "#FFFFFF" ? "#000" : "#fff"}
                                            style={{
                                                textShadowColor: "rgba(0, 0, 0, 0.3)",
                                                textShadowOffset: { width: 1, height: 1 },
                                                textShadowRadius: 1,
                                            }}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Size Selection */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Kích thước</Text>
                        <View style={styles.sizeOptions}>
                            {getAvailableSizes().map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    style={[
                                        styles.sizeOption,
                                        selectedSize === size && styles.selectedSizeOption,
                                    ]}
                                    onPress={() => handleSizeSelect(size)}
                                >
                                    <Text
                                        style={[
                                            styles.sizeText,
                                            selectedSize === size && styles.selectedSizeText,
                                        ]}
                                    >
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.sizeGuide}>Hướng dẫn chọn kích thước</Text>
                    </View>

                    {/* Quantity Selector */}
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={decrementQuantity}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={incrementQuantity}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={handleAddToCart}
                        >
                            <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Validation Error */}
                    {validationError && (
                        <Text style={styles.errorText}>{validationError}</Text>
                    )}

                    {/* Description */}
                    <TouchableOpacity
                        style={styles.expandableSection}
                        onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                        <Text style={styles.expandableSectionTitle}>Mô tả</Text>
                        <AntDesign
                            name={isDescriptionExpanded ? "up" : "down"}
                            size={16}
                            color="black"
                        />
                    </TouchableOpacity>

                    {isDescriptionExpanded && (
                        <View style={styles.descriptionContent}>
                            <Text style={styles.descriptionText}>{product.description}</Text>
                        </View>
                    )}

                    {/* Reviews */}
                    <TouchableOpacity
                        style={styles.expandableSection}
                        onPress={() => setIsReviewsExpanded(!isReviewsExpanded)}
                    >
                        <Text style={styles.expandableSectionTitle}>
                            Đánh giá từ khách hàng
                        </Text>
                        <AntDesign
                            name={isReviewsExpanded ? "up" : "down"}
                            size={16}
                            color="black"
                        />
                    </TouchableOpacity>
                    {isReviewsExpanded && (
                        <>
                            {loadingReviews ? (
                                <ActivityIndicator style={{ marginVertical: 20 }} color="#000" />
                            ) : reviews.length === 0 ? (
                                <Text style={styles.noReviewsText}>Chưa có đánh giá nào cho sản phẩm này</Text>
                            ) : (
                                <>
                                    {reviews.map(renderReviewItem)}
                                    <View style={styles.divider} />
                                    <TouchableOpacity style={styles.viewMoreButton}
                                        onPress={() => router.push(`/review/reviews_product?slug=${product?.slug}`)}>
                                        <Text style={styles.viewMoreText}>
                                            Xem thêm đánh giá
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </>
                    )}

                    {/* Similar Products */}
                    {similarProducts.length > 0 && (
                        <View style={styles.similarProductsSection}>
                            <Text style={styles.similarProductsTitle}>Sản phẩm tương tự</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.similarProductsScroll}
                            >
                                {similarProducts.map(renderProductItem)}
                            </ScrollView>
                        </View>
                    )}

                    {/* Recommended Products */}
                    {recommendedProducts.length > 0 && (
                        <View style={styles.recommendedProductsSection}>
                            <Text style={styles.recommendedProductsTitle}>
                                Có thể bạn sẽ thích
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.recommendedProductsScroll}
                            >
                                {recommendedProducts.map(renderProductItem)}
                            </ScrollView>
                        </View>
                    )}

                    {/* Recently viewed products */}
                    {viewedProducts.length > 0 && (
                        <View style={styles.viewedProductsSection}>
                            <Text style={styles.viewedProductsTitle}>Sản phẩm đã xem</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.viewedProductsScroll}
                            >
                                {viewedProducts.map(renderProductItem)}
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>

                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => router.navigate("/(tabs)/cart")}
                    >
                        <View>
                            <Ionicons name="cart-outline" size={24} color="black" />
                            {cartCount > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton} onPress={handleGoHome}>
                        <Ionicons name="home-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <Toast
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                onHide={() => setToastVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    errorContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        marginBottom: 20,
    },
    backButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "500",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        top: 15,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 16,
    },
    headerRight: {
        flexDirection: "row",
        gap: 8, // Khoảng cách giữa các nút bên phải
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    mainImageContainer: {
        width: "100%",
        height: 450,
        backgroundColor: "#f5f5f5",
        position: "relative",
    },
    mainImageSlide: {
        width: width,
        height: 450,
        justifyContent: "center",
        alignItems: "center",
    },
    mainImage: {
        width: "100%",
        height: "100%",
    },
    paginationContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: "#000",
        width: 12,
        height: 8,
        borderRadius: 4,
    },
    thumbnailContainer: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingHorizontal: 16,
    },
    thumbnailButton: {
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 4,
        width: 60,
        height: 60,
        overflow: "hidden",
    },
    selectedThumbnail: {
        borderColor: "#000",
        borderWidth: 2,
    },
    thumbnailImageContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    thumbnailImage: {
        width: "90%",
        height: "90%",
    },
    productInfo: {
        padding: 16,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    currentPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF424E",
    },
    originalPrice: {
        fontSize: 14,
        color: "#999",
        textDecorationLine: "line-through",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: "500",
    },
    reviewCount: {
        marginLeft: 4,
        fontSize: 14,
        color: "#666",
    },
    sectionContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    colorOptions: {
        flexDirection: "row",
        marginBottom: 8,
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    selectedColorOption: {
        borderColor: "#000",
        borderWidth: 2,
    },
    sizeOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    sizeOption: {
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedSizeOption: {
        backgroundColor: "#000",
    },
    sizeText: {
        fontSize: 14,
        fontWeight: "500",
    },
    selectedSizeText: {
        color: "#fff",
    },
    sizeGuide: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: "500",
    },
    quantityText: {
        fontSize: 16,
        fontWeight: "500",
        marginHorizontal: 16,
    },
    addToCartButton: {
        flex: 1,
        height: 40,
        backgroundColor: "#000",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 16,
    },
    addToCartButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    expandableSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    expandableSectionTitle: {
        fontSize: 16,
        fontWeight: "500",
    },
    descriptionContent: {
        paddingVertical: 12,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
        color: "#333",
        marginBottom: 8,
    },
    similarProductsSection: {
        marginTop: 16,
    },
    similarProductsTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 12,
    },
    similarProductsScroll: {
        marginBottom: 16,
    },
    recommendedProductsSection: {
        marginTop: 8,
    },
    recommendedProductsTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 12,
    },
    recommendedProductsScroll: {
        marginBottom: 16,
    },
    viewedProductsSection: {
        marginTop: 16,
    },
    viewedProductsTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 12,
    },
    viewedProductsScroll: {
        marginBottom: 16,
    },
    productItem: {
        width: 150,
        marginRight: 12,
    },
    productItemImage: {
        width: 150,
        height: 200,
        borderRadius: 4,
        backgroundColor: "#f5f5f5",
        marginBottom: 8,
    },
    productItemPrice: {
        fontSize: 14,
        fontWeight: "500",
        color: "#FF424E",
    },
    productItemRating: {
        flexDirection: "row",
        marginVertical: 4,
    },
    productItemName: {
        fontSize: 14,
        color: "#333",
    },
    bottomNavigation: {
        flexDirection: "row",
        height: 56,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    navItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    cartBadge: {
        position: "absolute",
        right: -6,
        top: -6,
        backgroundColor: "#FF424E",
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
    },
    cartBadgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        includeFontPadding: false,
        lineHeight: 12,
    },
    soldCount: {
        fontSize: 14,
        color: "#666",
        marginLeft: 10,
    },
    reviewItem: {
        gap: 6,
        marginVertical: 12,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    userAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: "#ddd",
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        fontWeight: "500",
    },
    reviewDate: {
        color: "#999",
    },
    ratingStars: {
        flexDirection: "row",
        alignItems: "center",
    },
    variantInfo: {
        color: "#999",
    },
    reviewContent: {
        color: "#333",
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E0E0E0",
    },
    viewMoreButton: {
        marginVertical: 12,
    },
    viewMoreText: {
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
    },
    noReviewsText: {
        textAlign: 'center',
        marginVertical: 15,
        fontSize: 14,
        color: '#999',
    },
});

export default ProductDetailScreen;
