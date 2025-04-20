"use client"

import { useState, useEffect } from "react"
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native"
import { Feather, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons"
import FilterModal from "./filter-modal"
import { COLOR } from "@/src/constants/color"
import { router } from "expo-router"
import { FONT } from "@/src/constants/font"
import { useCartStore } from "@/src/store/cartStore"

// Define product type
interface Product {
    id: string
    name: string
    originalPrice: number
    discountedPrice: number
    discountPercentage: number
    image: string
    category: string
}

// Sample data
const sampleProducts: Product[] = [
    {
        id: "1",
        name: "Wireless Noise Cancelling Headphones with Premium Sound Quality",
        originalPrice: 299.99,
        discountedPrice: 209.99,
        discountPercentage: 30,
        image: "https://via.placeholder.com/150",
        category: "Electronics",
    },
    {
        id: "2",
        name: "Smart Fitness Watch with Heart Rate Monitor and Sleep Tracking",
        originalPrice: 199.99,
        discountedPrice: 139.99,
        discountPercentage: 30,
        image: "https://via.placeholder.com/150",
        category: "Wearables",
    },
    {
        id: "3",
        name: "Portable Bluetooth Speaker Waterproof",
        originalPrice: 89.99,
        discountedPrice: 62.99,
        discountPercentage: 30,
        image: "https://via.placeholder.com/150",
        category: "Electronics",
    },
    {
        id: "4",
        name: "Ultra HD 4K Action Camera with Stabilization",
        originalPrice: 249.99,
        discountedPrice: 174.99,
        discountPercentage: 30,
        image: "https://via.placeholder.com/150",
        category: "Photography",
    },
    {
        id: "5",
        name: "Ergonomic Gaming Chair with Lumbar Support",
        originalPrice: 299.99,
        discountedPrice: 209.99,
        discountPercentage: 30,
        image: "https://via.placeholder.com/150",
        category: "Gaming",
    },
    {
        id: "6",
        name: "Mechanical Gaming Keyboard RGB Backlit",
        originalPrice: 129.99,
        discountedPrice: 90.99,
        discountPercentage: 30,
        image: "https://via.placeholder.com/150",
        category: "Gaming",
    },
]

// Get screen width
const { width } = Dimensions.get("window")

const PromotionScreen = () => {
    const cartCount = useCartStore(state => state.cartCount);
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [filterModalVisible, setFilterModalVisible] = useState(false)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

    // Simulate data loading
    useEffect(() => {
        const fetchProducts = async () => {
            // Simulate network request
            setTimeout(() => {
                setProducts(sampleProducts)
                setFilteredProducts(sampleProducts)
                setLoading(false)
            }, 1500)
        }

        fetchProducts()
    }, [])

    const handleApplyFilters = (filters: any) => {
        let filtered = [...products]

        // Apply category filter
        if (filters.category) {
            filtered = filtered.filter(product => product.category === filters.category)
        }

        // Apply sort
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-low-high':
                    filtered.sort((a, b) => a.discountedPrice - b.discountedPrice)
                    break
                case 'price-high-low':
                    filtered.sort((a, b) => b.discountedPrice - a.discountedPrice)
                    break
                case 'discount':
                    filtered.sort((a, b) => b.discountPercentage - a.discountPercentage)
                    break
            }
        }

        setFilteredProducts(filtered)
    }

    // Product row component
    const ProductRow = ({ item }: { item: Product }) => (
        <TouchableOpacity style={styles.productRow} activeOpacity={0.7}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{item.discountPercentage}%</Text>
                </View>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                    {item.name}
                </Text>
                <View style={{ alignItems: 'flex-end', justifyContent: "space-between", flexDirection: "row" }}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
                        <Text style={styles.discountedPrice}>${item.discountedPrice.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: COLOR.PRIMARY, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 6 }}>
                        <Text style={{ color: "#fff" }}>Mua ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity >
    )

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
    )

    return (
        <View style={styles.container}>
            <View style={styles.headerTab}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Khuyến mãi</Text>
                <TouchableOpacity onPress={() => router.push("/cart")}>
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
                        Big Sale - 30% OFF IN ALL PRODUCTS
                    </Text>
                    <Text style={styles.promotionPeriod}>Valid until April 30</Text>
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                    <Feather name="filter" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Products List */}
            {loading ? (
                <LoadingPlaceholder />
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={({ item }) => <ProductRow item={item} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.productList}
                />
            )}

            {/* Filter Modal */}
            <FilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                onApplyFilters={handleApplyFilters}
            />
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
    filterButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
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
        marginBottom: 8,
        lineHeight: 20,
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
})

export default PromotionScreen

