import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { FONT } from '@/src/constants/font'
import { SIZE } from '@/src/constants/product'
import { useFilterStore } from '@/src/store/filterStore'
import { COLOR } from '@/src/constants/color'

const SizeFilter = () => {
    const { sizes, setSizes } = useFilterStore()

    const handleSizePress = (size: string) => {
        if (sizes.includes(size)) {
            setSizes(sizes.filter(s => s !== size))
        } else {
            setSizes([...sizes, size])
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kích cỡ</Text>
            <FlatList
                horizontal
                data={SIZE}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sizeContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.sizeItem, {
                            backgroundColor: sizes.includes(item) ? COLOR.PRIMARY : '#F2F4F5'
                        }]}
                        onPress={() => handleSizePress(item)}>
                        <Text style={[styles.sizeName, {
                            color: sizes.includes(item) ? 'white' : COLOR.PRIMARY
                        }]}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 16
    },
    title: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    sizeItem: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F4F5',
        borderRadius: 8,
    },
    sizeName: {
        fontSize: 14,
    },
    sizeContainer: {
        gap: 8,
    },
})

export default SizeFilter