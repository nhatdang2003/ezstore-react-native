import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FONT } from '@/src/constants/font'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFilterStore } from '@/src/store/filterStore'
import { getCategoriesHomeTab } from '@/src/services/category.service'
import { Category } from '../types/category.type'
const CategoryFilter = () => {
    const [data, setData] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getCategoriesHomeTab()
            const data = response.data.data
            setData(data)
        }
        fetchCategories()
    }, [])

    const { categories, setCategories } = useFilterStore();

    const handleCategoryPress = (id: number) => {
        if (categories.includes(id)) {
            setCategories(categories.filter(category => category !== id))
        } else {
            setCategories([...categories, id])
        }
    }

    return (
        <View >
            <Text style={styles.title}>Danh mục</Text>
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <>
                        <TouchableOpacity style={styles.categoryItem}
                            onPress={() => handleCategoryPress(item.id)}>
                            <Text style={styles.categoryName}>{item.name}</Text>
                            {categories.includes(item.id) ?
                                <MaterialCommunityIcons name='checkbox-outline' size={24} color='black' />
                                :
                                <MaterialCommunityIcons name='checkbox-blank-outline' size={24} color='black' />
                            }
                        </TouchableOpacity>
                        <View style={styles.divider} />
                    </>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    categoryName: {
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: 'gray',
    }
})

export default CategoryFilter