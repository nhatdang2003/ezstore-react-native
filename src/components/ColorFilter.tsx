import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { FONT } from '@/src/constants/font'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLOR_PRODUCT } from '@/src/constants/product'
import { useFilterStore } from '@/src/store/filterStore'

const ColorFilter = () => {
    const { colors, setColors } = useFilterStore()
    const handleColorPress = (id: string) => {
        if (colors.includes(id)) {
            setColors(colors.filter(color => color !== id))
        } else {
            setColors([...colors, id])
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Màu</Text>
            <FlatList
                horizontal
                data={COLOR_PRODUCT}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.colorContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.colorItem, {
                            backgroundColor: item.hex, borderWidth: 1,
                            borderColor: item.hex === '#FFFFFF' ? 'black' : 'transparent'
                        }]}
                        onPress={() => handleColorPress(item.id)}
                    >
                        {colors.includes(item.id) && (
                            <MaterialCommunityIcons name='check' size={24} color={item.hex === '#FFFFFF' ? 'black' : 'white'} />
                        )}
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
    colorContainer: {
        gap: 8,
    },
    colorItem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorName: {
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
    },
})

export default ColorFilter