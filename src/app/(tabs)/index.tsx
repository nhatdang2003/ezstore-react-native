import { ScrollView, View, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeCarousel from '@/src/components/HomeCarousel'
import CategoryCarousel from '@/src/components/CategoryCarousel'
import SectionHeader from '@/src/components/SectionHeader'
import { getFeaturedProducts, getNewProducts, getDiscountedProducts, getBestSellerProducts } from '@/src/services/product.service'
import { Product } from '@/src/types/product.type'
import { ProductCardProps } from '@/src/types/product.type'
import { router } from 'expo-router'

const HomeTab = () => {
    const [featuredProducts, setFeaturedProducts] = useState<ProductCardProps[]>([])
    const [bestSellerProducts, setBestSellerProducts] = useState<ProductCardProps[]>([])
    const [newProducts, setNewProducts] = useState<ProductCardProps[]>([])
    const [discountedProducts, setDiscountedProducts] = useState<ProductCardProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllProducts()
    }, [])

    const fetchAllProducts = async () => {
        setLoading(true)
        try {
            const [featured, newest, discounted, bestSeller] = await Promise.all([
                getFeaturedProducts(),
                getNewProducts(),
                getDiscountedProducts(),
                getBestSellerProducts()
            ])

            if (featured.statusCode === 200) {
                setFeaturedProducts(formatProducts(featured.data.data))
            }
            if (newest.statusCode === 200) {
                setNewProducts(formatProducts(newest.data.data))
            }
            if (discounted.statusCode === 200) {
                setDiscountedProducts(formatProducts(discounted.data.data))
            }
            if (bestSeller.statusCode === 200) {
                setBestSellerProducts(formatProducts(bestSeller.data.data))
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatProducts = (products: Product[]): ProductCardProps[] => {
        return products.map(product => ({
            id: product.id.toString(),
            image: product.images[0],
            title: product.name,
            price: product.priceWithDiscount,
            priceDiscount: product.price,
            rating: product.averageRating
        }))
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.homeCarousel}>
                        <HomeCarousel />
                    </View>
                    <View style={styles.categoryCarousel}>
                        <CategoryCarousel />
                    </View>
                    <View style={styles.sectionsContainer}>
                        <SectionHeader
                            title='Nổi bật'
                            onViewAll={() => {
                                router.navigate('/(tabs)/store')
                            }}
                            data={featuredProducts}
                            loading={loading}
                        />
                        <SectionHeader
                            title='Bán chạy'
                            onViewAll={() => {
                                router.navigate('/(tabs)/store')
                            }}
                            data={bestSellerProducts}
                            loading={loading}
                        />
                        <SectionHeader
                            title='Mới nhất'
                            onViewAll={() => {
                                router.navigate("/(tabs)/store");
                            }}
                            data={newProducts}
                            loading={loading}
                        />
                        <SectionHeader
                            title='Khuyến mãi'
                            onViewAll={() => {
                                router.navigate("/(tabs)/store");
                            }}
                            data={discountedProducts}
                            loading={loading}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    homeCarousel: {

    },
    categoryCarousel: {
        paddingTop: 20,
    },
    sectionsContainer: {
        paddingTop: 20,
    }
});

export default HomeTab;