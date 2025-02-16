import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from '@/src/components/CustomButton'
import { useRouter } from 'expo-router'
import { useFilterStore } from '@/src/store/filterStore'
const CategoryTab = () => {
    const router = useRouter()
    const { categories, setCategories } = useFilterStore()

    return (
        <View>
            <Text>CategoryTab</Text>
            <CustomButton title='Chuyển' onPress={() => {
                setCategories([1])
                router.push('/store')
            }} />
        </View>
    )
}

export default CategoryTab