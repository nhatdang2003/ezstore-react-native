import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { formatPrice } from '@/src/utils/product'
import { COLOR } from '@/src/constants/color'
import { FONT } from '@/src/constants/font';

const Price = ({ price, priceDiscount }: { price: number, priceDiscount?: number }) => {
    return (
        <View style={styles.priceContainer}>
            {price && priceDiscount ? (
                <>
                    <Text style={styles.price}>{formatPrice(price)}</Text>
                    <Text style={styles.priceDiscount}>{formatPrice(priceDiscount)}</Text>
                </>
            ) : (
                <Text style={styles.priceDefault}>{formatPrice(price)}</Text>
            )}
        </View>

    )
}

const styles = StyleSheet.create({
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 16,
        color: COLOR.RED,
        fontFamily: FONT.LORA_MEDIUM,
    },
    priceDiscount: {
        fontSize: 10,
        color: '#888',
        fontFamily: FONT.LORA_MEDIUM,
        textDecorationLine: 'line-through',
    },
    priceDefault: {
        fontSize: 16,
        color: '#000',
        fontFamily: FONT.LORA_MEDIUM,
    },
})


export default Price