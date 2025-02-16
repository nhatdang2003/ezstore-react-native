import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { FONT } from '@/src/constants/font'
import Input from '@/src/components/Input'
import { useFilterStore } from '@/src/store/filterStore'
const PriceFilter = () => {
    const { priceRange, setPriceRange } = useFilterStore()

    const handlePriceFromChange = (text: string) => {
        setPriceRange({ ...priceRange, min: text ? parseInt(text) : '' })
    }

    const handlePriceToChange = (text: string) => {
        setPriceRange({ ...priceRange, max: text ? parseInt(text) : '' })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Khoảng giá</Text>
            <View style={styles.priceContainer}>
                <View style={styles.priceInput}>
                    <Input placeholder='Từ' value={priceRange.min?.toString() || ''}
                        onChangeText={handlePriceFromChange} keyboardType="numeric" />
                </View>
                <Text style={styles.priceSeparator}>-</Text>
                <View style={styles.priceInput}>
                    <Input placeholder='Đến' value={priceRange.max?.toString() || ''}
                        onChangeText={handlePriceToChange} keyboardType="numeric" />
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