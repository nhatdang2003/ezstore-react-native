import { SafeAreaView, ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getCategoriesCategoryTab } from '@/src/services/category.service'
import { Category } from '@/src/types/category.type'
import CategoryCard from '@/src/components/CategoryCard'
import { COLOR } from '@/src/constants/color'
import { FONT } from '@/src/constants/font'
import { useSegments } from 'expo-router'
import { useFilterStore } from '@/src/store/filterStore'
import { router } from 'expo-router'

const CategoryTab = () => {
    const segments = useSegments();
    const isCategoryScreen = segments[1] === 'category';

    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const { categories: categoriesStore, setCategories: setCategoriesStore } = useFilterStore();

    useEffect(() => {
        if (isCategoryScreen) {
            fetchCategories()
        }
    }, [isCategoryScreen])

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await getCategoriesCategoryTab()
            if (response.statusCode === 200) {
                setCategories(response.data.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryPress = (categoryId: string) => {
        setCategoriesStore([...categoriesStore, parseInt(categoryId)])
        router.navigate('/(tabs)/store')
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLOR.PRIMARY} />
            </View>
        )
    }

    if (categories.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Không tìm thấy danh mục</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.gridContainer}>
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                id={category.id.toString()}
                                image={category.imageUrl}
                                title={category.name}
                                onPress={() => handleCategoryPress(category.id.toString())}
                            />
                        ))}
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
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingTop: 16,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        fontFamily: FONT.LORA,
    }
})

export default CategoryTab