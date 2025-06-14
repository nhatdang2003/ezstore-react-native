import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native'
import React from 'react'
import CategoryFilter from '@/src/components/CategoryFilter'
import ColorFilter from '@/src/components/ColorFilter'
import SizeFilter from '@/src/components/SizeFilter'
import PriceFilter from '@/src/components/PriceFilter'
import RatingFilter from '@/src/components/RatingFilter'
import CustomButton from '@/src/components/CustomButton'
import { useFilterStore } from '@/src/store/filterStore'
import { useRouter } from 'expo-router'
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { FONT } from '@/src/constants/font'
const FilterScreen = () => {
    const router = useRouter()
    const { resetFilters } = useFilterStore();

    const handleResetFilters = () => {
        resetFilters();
        // router.back()
    }

    const filterComponents = [
        <CategoryFilter key="category" />,
        <ColorFilter key="color" />,
        <SizeFilter key="size" />,
        <PriceFilter key="price" />,
        <RatingFilter key="rating" />,
        <View key="buttons" style={{ flexDirection: 'row', gap: 16 }}>
            <CustomButton variant='filled' title='Đặt lại' onPress={handleResetFilters}
                textStyle={{ color: 'white' }}
                style={{ flex: 1, backgroundColor: 'black' }} />
            {/* <CustomButton variant='outlined' title='Hủy' onPress={() => router.back()}
                style={{ flex: 1, borderColor: 'black', borderWidth: 1 }} textStyle={{ color: 'black' }} /> */}
        </View>
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bộ lọc</Text>
                <View />
            </View>
            <FlatList
                data={filterComponents}
                renderItem={({ item }) => item}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white', padding: 16, gap: 16 }}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
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
})

export default FilterScreen