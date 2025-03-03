import { View, Text, StyleSheet, TouchableWithoutFeedback, Pressable, FlatList, ActivityIndicator, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback, memo, useRef } from 'react'
import ButtonFilter from '@/src/components/ButtonFilter'
import ButtonSort from '@/src/components/ButtonSort'
import { useFilterStore } from '@/src/store/filterStore'
import { getProducts } from '@/src/services/product.service'
import ProductCard from '@/src/components/ProductCard'
import { Product } from '@/src/types/product.type'
import { router, useLocalSearchParams, useRouter, useSegments } from 'expo-router'
import { SimpleLineIcons } from '@expo/vector-icons'

// Seperate ProductItem component with memo to avoid unnecessary re-renders
const ProductItem = memo(({
    id,
    images,
    name,
    priceWithDiscount,
    price,
    averageRating
}: Product) => (
    <ProductCard
        id={id.toString()}
        image={images[0]}
        title={name}
        price={priceWithDiscount}
        priceDiscount={price}
        rating={averageRating}
    />
))

const ResultScreen = () => {
    const { keyword } = useLocalSearchParams()
    const segments = useSegments();
    const router = useRouter();
    const isStoreScreen = segments[1] === 'store';

    const [open, setOpen] = useState(false)
    const [sort, setSort] = useState('price-asc')
    const filterStore = useFilterStore()
    const { isFilterChanged, isFilterReset } = filterStore
    const flatListRef = useRef<FlatList>(null);

    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    // Optimize renderItem with useCallback
    const renderItem = useCallback(({ item }: { item: Product }) => (
        <ProductItem
            id={item.id}
            images={item.images}
            name={item.name}
            priceWithDiscount={item.priceWithDiscount}
            price={item.price}
            averageRating={item.averageRating}
        />
    ), [])

    // Optimize keyExtractor with useCallback
    const keyExtractor = useCallback((item: Product) => `product-${item.id}`, [])

    // Optimize renderFooter with useCallback
    const renderFooter = useCallback(() => {
        if (!loading) return null
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#303437" />
            </View>
        )
    }, [loading])

    // Function to load products with a specific page
    const loadProductsWithPage = async (pageNumber: number) => {
        if (loading) return

        setLoading(true)
        try {
            const response = await getProducts({
                page: pageNumber,
                size: 10,
                categories: filterStore.categories,
                minPrice: filterStore.priceRange.min,
                maxPrice: filterStore.priceRange.max,
                rating: filterStore.rating,
                colors: filterStore.colors,
                sizes: filterStore.sizes,
                sort: sort
            })

            const newProducts = response.data.data
            const totalPages = response.data.meta.pages

            if (pageNumber === 0) {
                setProducts(newProducts)
            } else {
                setProducts(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id))
                    return [...prev, ...uniqueNewProducts]
                })
            }

            setHasMore(pageNumber < totalPages - 1)

            setPage(pageNumber + 1)
        } catch (error) {
            console.error('Error loading products:', error)
            setHasMore(false)
        } finally {
            setLoading(false)
        }
    }

    const resetAndLoadProducts = async () => {
        setProducts([])
        setPage(0)
        setHasMore(true)
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
        await loadProductsWithPage(0)
    }

    // Handle when filter changes
    useEffect(() => {
        if (isFilterChanged && isStoreScreen) {
            resetAndLoadProducts()
            filterStore.setIsFilterChanged(false)
        }
    }, [isFilterChanged, isStoreScreen])

    // Handle when filter is reset
    useEffect(() => {
        if (isFilterReset && isStoreScreen && !isFilterChanged) {
            resetAndLoadProducts()
            filterStore.setIsFilterReset(false)
        }
    }, [isFilterReset, isStoreScreen])

    // Handler when sort changes
    useEffect(() => {
        if (isStoreScreen) {
            resetAndLoadProducts()
        }
    }, [sort])

    // Reset dropdown when entering the store page
    useEffect(() => {
        if (isStoreScreen) {
            setOpen(false)
        }
    }, [isStoreScreen])

    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            loadProductsWithPage(page)
        }
    }, [loading, hasMore, page])

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <SimpleLineIcons name="arrow-left" size={20} color="black" />
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Tìm kiếm"
                            style={styles.input}
                            value={Array.isArray(keyword) ? keyword[0] : keyword}
                            onPress={() => router.push(`/search?keyword=${encodeURIComponent(Array.isArray(keyword) ? keyword[0] : keyword)}`)}
                        />
                    </View>
                </View>

                <View style={styles.filterContainer}>
                    <ButtonFilter />
                    <View style={styles.divider} />
                    <ButtonSort sort={sort} setSort={setSort} open={open} setOpen={setOpen} />
                </View>

                {open && (
                    <Pressable
                        style={styles.overlay}
                        onPress={() => setOpen(false)}
                    />
                )}

                <FlatList
                    ref={flatListRef}
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    numColumns={2}
                    contentContainerStyle={styles.productList}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    initialNumToRender={6}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 4
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingRight: 32,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    filterContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#E3E5E5',
        zIndex: 2,
        elevation: 2,
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E3E5E5'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    productList: {
        padding: 16,
    },
    row: {
        justifyContent: 'space-between',
    },
    loaderContainer: {
        paddingVertical: 20,
        alignItems: 'center'
    }
})

export default ResultScreen;