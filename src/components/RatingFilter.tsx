import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { FONT } from '@/src/constants/font'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFilterStore } from '@/src/store/filterStore'

const ratings = [
    { id: '5', name: 'Từ 5' },
    { id: '4', name: 'Từ 4' },
    { id: '3', name: 'Từ 3' },
    { id: '2', name: 'Từ 2' },
    { id: '1', name: 'Từ 1' },
]

const RatingFilter = () => {
    const { rating, setRating } = useFilterStore()

    const handleRatingPress = (id: string) => {
        if (rating.includes(parseInt(id))) {
            setRating(rating.filter(r => r !== parseInt(id)))
        } else {
            setRating([...rating, parseInt(id)])
        }
    }

    return (
        <View >
            <Text style={styles.title}>Đánh giá</Text>
            <FlatList
                data={ratings}
                renderItem={({ item }) => (
                    <>
                        <TouchableOpacity style={styles.ratingItem}
                            onPress={() => handleRatingPress(item.id)}>
                            <View style={styles.ratingItemContent}>
                                <Text style={styles.ratingName}>{item.name}</Text>
                                <MaterialCommunityIcons name='star' size={24} color='black' />
                            </View>
                            {rating.includes(parseInt(item.id)) ? (
                                <MaterialCommunityIcons name='checkbox-outline' size={24} color='black' />
                            ) : (
                                <MaterialCommunityIcons name='checkbox-blank-outline' size={24} color='black' />
                            )}
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
    ratingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    ratingName: {
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: 'gray',
    },
    ratingItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    }
})

export default RatingFilter