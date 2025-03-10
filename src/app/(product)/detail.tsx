import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';

const ProductDetailScreen = () => {
    const [selectedColor, setSelectedColor] = useState('brown');
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);

    const colors = [
        { id: 'brown', color: '#3D2314' },
        { id: 'yellow', color: '#D4AF37' },
    ];

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const similarProducts = [
        {
            id: '1',
            name: 'Balloon sleeve tiered ruffle mini...',
            price: '650.000₫',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Product%20Details%20%281%29-ETjwC8Zem5RCIJKwy0CmKMmIR6Xf9H.png',
            rating: 4.5,
        },
        {
            id: '2',
            name: 'Marloe mini dress in white',
            price: '650.000₫',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Product%20Details%20%281%29-ETjwC8Zem5RCIJKwy0CmKMmIR6Xf9H.png',
            rating: 4.5,
        },
    ];

    const recommendedProducts = [
        {
            id: '3',
            name: 'One shoulder piping detail frill...',
            price: '650.000₫',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Product%20Details%20%281%29-ETjwC8Zem5RCIJKwy0CmKMmIR6Xf9H.png',
            rating: 4.5,
        },
        {
            id: '4',
            name: 'Flare pants in bright orange',
            price: '650.000₫',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Product%20Details%20%281%29-ETjwC8Zem5RCIJKwy0CmKMmIR6Xf9H.png',
            rating: 4.5,
        },
    ];

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<AntDesign key={`star-${i}`} name="star" size={14} color="#000" />);
        }

        if (hasHalfStar) {
            stars.push(<AntDesign key="half-star" name="staro" size={14} color="#000" />);
        }

        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<AntDesign key={`empty-star-${i}`} name="staro" size={14} color="#000" />);
        }

        return stars;
    };

    const renderProductItem = (item) => (
        <TouchableOpacity key={item.id} style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productItemImage} />
            <Text style={styles.productItemPrice}>{item.price}</Text>
            <View style={styles.productItemRating}>
                {renderStars(item.rating)}
            </View>
            <Text style={styles.productItemName} numberOfLines={2}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <Feather name="share-2" size={20} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Main Product Image */}
                <Image
                    source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Product%20Details%20%281%29-ETjwC8Zem5RCIJKwy0CmKMmIR6Xf9H.png' }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>Claudette corset shirt dress in natural white</Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.currentPrice}>650.000₫ - 1.200.000₫</Text>
                        <Text style={styles.originalPrice}>790.950₫ - 1.500.000₫</Text>
                    </View>

                    <View style={styles.ratingContainer}>
                        <AntDesign name="star" size={16} color="black" />
                        <AntDesign name="star" size={16} color="black" />
                        <AntDesign name="star" size={16} color="black" />
                        <AntDesign name="star" size={16} color="black" />
                        <AntDesign name="star" size={16} color="black" />
                        <Text style={styles.ratingText}>5.0</Text>
                    </View>

                    {/* Color Selection */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Màu sắc</Text>
                        <View style={styles.colorOptions}>
                            {colors.map((color) => (
                                <TouchableOpacity
                                    key={color.id}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color.color },
                                        selectedColor === color.id && styles.selectedColorOption,
                                    ]}
                                    onPress={() => setSelectedColor(color.id)}
                                >
                                    {selectedColor === color.id && (
                                        <AntDesign name="check" size={16} color="white" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Size Selection */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Kích thước</Text>
                        <View style={styles.sizeOptions}>
                            {sizes.map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    style={[
                                        styles.sizeOption,
                                        selectedSize === size && styles.selectedSizeOption,
                                    ]}
                                    onPress={() => setSelectedSize(size)}
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

                        <TouchableOpacity style={styles.addToCartButton}>
                            <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                    </View>

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
                            <Text style={styles.descriptionText}>
                                A shirt is a profitable investment in the wardrobe. And here's why:
                            </Text>
                            <Text style={styles.descriptionText}>
                                - shirts perfectly match with any bottom
                            </Text>
                            <Text style={styles.descriptionText}>
                                - shirts made of natural fabrics are suitable for any time of the year.
                            </Text>
                        </View>
                    )}

                    {/* Reviews */}
                    <TouchableOpacity
                        style={styles.expandableSection}
                        onPress={() => setIsReviewsExpanded(!isReviewsExpanded)}
                    >
                        <Text style={styles.expandableSectionTitle}>Đánh giá từ khách hàng</Text>
                        <AntDesign
                            name={isReviewsExpanded ? "up" : "down"}
                            size={16}
                            color="black"
                        />
                    </TouchableOpacity>

                    {/* Similar Products */}
                    <View style={styles.similarProductsSection}>
                        <Text style={styles.similarProductsTitle}>Sản phẩm tương tự</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarProductsScroll}>
                            {similarProducts.map(renderProductItem)}
                        </ScrollView>
                    </View>

                    {/* Recommended Products */}
                    <View style={styles.recommendedProductsSection}>
                        <Text style={styles.recommendedProductsTitle}>Có thể bạn sẽ thích</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedProductsScroll}>
                            {recommendedProducts.map(renderProductItem)}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNavigation}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="search-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="cart-outline" size={24} color="black" />
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>2</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="person-outline" size={24} color="black" />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
    },
    backButton: {
        padding: 8,
    },
    shareButton: {
        padding: 8,
    },
    mainImage: {
        width: '100%',
        height: 450,
        backgroundColor: '#f5f5f5',
    },
    productInfo: {
        padding: 16,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 8,
    },
    priceContainer: {
        marginBottom: 8,
    },
    currentPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF424E',
    },
    originalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    sectionContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    colorOptions: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedColorOption: {
        borderColor: '#000',
    },
    sizeOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sizeOption: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedSizeOption: {
        backgroundColor: '#000',
    },
    sizeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    selectedSizeText: {
        color: '#fff',
    },
    sizeGuide: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: '500',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 16,
    },
    addToCartButton: {
        flex: 1,
        height: 40,
        backgroundColor: '#000',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    addToCartButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    expandableSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    expandableSectionTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    descriptionContent: {
        paddingVertical: 12,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        marginBottom: 8,
    },
    similarProductsSection: {
        marginTop: 16,
    },
    similarProductsTitle: {
        fontSize: 16,
        fontWeight: '500',
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
        fontWeight: '500',
        marginBottom: 12,
    },
    recommendedProductsScroll: {
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
        backgroundColor: '#f5f5f5',
        marginBottom: 8,
    },
    productItemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FF424E',
    },
    productItemRating: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    productItemName: {
        fontSize: 14,
        color: '#333',
    },
    bottomNavigation: {
        flexDirection: 'row',
        height: 56,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: 8,
        right: 20,
        backgroundColor: '#FF424E',
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default ProductDetailScreen;