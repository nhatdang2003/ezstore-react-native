import { View, Text, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FONT } from '@/src/constants/font'
import Input from '@/src/components/Input'
import { useFilterStore } from '@/src/store/filterStore'

const PriceFilter = () => {
    const { priceRange, setPriceRange } = useFilterStore()
    // State local để lưu giá trị tạm thời
    const [localMin, setLocalMin] = useState(priceRange.min?.toString() || '')
    const [localMax, setLocalMax] = useState(priceRange.max?.toString() || '')

    // Cập nhật state local khi priceRange từ store thay đổi
    useEffect(() => {
        setLocalMin(priceRange.min?.toString() || '')
        setLocalMax(priceRange.max?.toString() || '')
    }, [priceRange])

    const handlePriceFromEnd = () => {
        setPriceRange({ ...priceRange, min: localMin ? parseInt(localMin) : '' })
    }

    const handlePriceToEnd = () => {
        setPriceRange({ ...priceRange, max: localMax ? parseInt(localMax) : '' })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Khoảng giá</Text>
            <View style={styles.priceContainer}>
                <View style={styles.priceInput}>
                    <Input
                        placeholder='Từ'
                        value={localMin}
                        onChangeText={setLocalMin}
                        onEndEditing={handlePriceFromEnd}
                        keyboardType="numeric"
                    />
                </View>
                <Text style={styles.priceSeparator}>-</Text>
                <View style={styles.priceInput}>
                    <Input
                        placeholder='Đến'
                        value={localMax}
                        onChangeText={setLocalMax}
                        onEndEditing={handlePriceToEnd}
                        keyboardType="numeric"
                    />
                </View>
            </View>
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
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    priceInput: {
        flex: 1,
    },
    priceSeparator: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
})

export default PriceFilter