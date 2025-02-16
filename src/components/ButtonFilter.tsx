import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from '@/src/components/CustomButton'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
const ButtonFilter = () => {
    const router = useRouter()

    return (
        <CustomButton
            title='Bộ lọc'
            variant='ghost'
            leftIcon={<MaterialCommunityIcons name='filter-outline' size={24} color='black' />}
            textStyle={{ color: 'black' }}
            style={{ flex: 1 }}
            onPress={() => router.push('/store/filter')}
        />
    )
}

export default ButtonFilter