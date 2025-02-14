import { ScrollView, View, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeCarousel from '@/src/components/HomeCarousel'
import CategoryCarousel from '@/src/components/CategoryCarousel'
import SectionHeader from '@/src/components/SectionHeader'
import { getFeaturedProducts, getNewProducts, getDiscountedProducts } from '@/src/services/product.service'
import { Product } from '@/src/types/product.type'
import { ProductCardProps } from '@/src/types/product.type'

const HomeTab = () => {
    const [featuredProducts, setFeaturedProducts] = useState<ProductCardProps[]>([])
    const [newProducts, setNewProducts] = useState<ProductCardProps[]>([])
    const [discountedProducts, setDiscountedProducts] = useState<ProductCardProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllProducts()
    }, [])

    const fetchAllProducts = async () => {
        setLoading(true)
        try {
            const [featured, newest, discounted] = await Promise.all([
                getFeaturedProducts(),
                getNewProducts(),
                getDiscountedProducts()
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
                            onViewAll={() => { }}
                            data={featuredProducts}
                            loading={loading}
                        />
                        <SectionHeader
                            title='Mới nhất'
                            onViewAll={() => { }}
                            data={newProducts}
                            loading={loading}
                        />
                        <SectionHeader
                            title='Khuyến mãi'
                            onViewAll={() => { }}
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