import { View, Text, StyleSheet, TouchableWithoutFeedback, Pressable, FlatList, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useCallback, memo, useRef } from 'react'
import ButtonFilter from '@/src/components/ButtonFilter'
import ButtonSort from '@/src/components/ButtonSort'
import { useFilterStore } from '@/src/store/filterStore'
import { getProducts } from '@/src/services/product.service'
import ProductCard from '@/src/components/ProductCard'
import { Product } from '@/src/types/product.type'
import { useSegments } from 'expo-router'

// Tách ProductItem component với memo để tránh render lại không cần thiết
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

const StoreScreen = () => {
    const segments = useSegments();
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

    // Tối ưu renderItem với useCallback
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

    // Tối ưu keyExtractor với useCallback
    const keyExtractor = useCallback((item: Product) => `product-${item.id}`, [])

    // Tối ưu renderFooter với useCallback
    const renderFooter = useCallback(() => {
        if (!loading) return null
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#303437" />
            </View>
        )
    }, [loading])

    // Hàm load sản phẩm với page cụ thể
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

            // Nếu là trang 0, thay thế toàn bộ danh sách
            if (pageNumber === 0) {
                setProducts(newProducts)
            } else {
                // Nếu không phải trang 0, thêm vào danh sách hiện có
                setProducts(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id))
                    return [...prev, ...uniqueNewProducts]
                })
            }

            // Cập nhật hasMore dựa trên totalPages
            setHasMore(pageNumber < totalPages - 1)

            // Cập nhật page cho lần load tiếp theo
            setPage(pageNumber + 1)
        } catch (error) {
            console.error('Error loading products:', error)
            setHasMore(false)
        } finally {
            setLoading(false)
        }
    }

    // Hàm reset và load lại từ đầu
    const resetAndLoadProducts = async () => {
        setProducts([])
        setPage(0)
        setHasMore(true)
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
        await loadProductsWithPage(0)
    }

    // Xử lý khi filter thay đổi
    useEffect(() => {
        if (isFilterChanged) {
            resetAndLoadProducts()
            filterStore.setIsFilterChanged(false)
        }
    }, [isFilterChanged])

    // Xử lý khi filter được reset
    useEffect(() => {
        if (isFilterReset && isStoreScreen) {
            resetAndLoadProducts()
            filterStore.setIsFilterReset(false)
        }
    }, [isFilterReset, isStoreScreen])

    // Xử lý khi sort thay đổi
    useEffect(() => {
        if (isStoreScreen) {
            resetAndLoadProducts()
        }
    }, [sort])

    // Reset dropdown và sort khi vào trang store
    useEffect(() => {
        if (isStoreScreen) {
            setOpen(false)  // Đóng dropdown
        }
    }, [isStoreScreen])

    // Xử lý load more
    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            loadProductsWithPage(page)
        }
    }, [loading, hasMore, page])

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
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

export default StoreScreen;