import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { ProductCardProps } from '@/src/types/product.type'
import RatingStars from '@/src/components/RatingStars';
import Price from '@/src/components/Price';
import { FONT } from '@/src/constants/font';
import { COLOR } from '@/src/constants/color';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

const ProductCard = ({
    id,
    image,
    title,
    price,
    priceDiscount,
    rating,
}: ProductCardProps) => {
    const router = useRouter()

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                router.push({
                    pathname: "/(product)/detail",
                    params: {
                        id: id
                    }
                })
            }}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.content}>
                <Price price={price} priceDiscount={priceDiscount} />
                <RatingStars rating={rating} />
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: 'white',
        marginBottom: 16,
        overflow: 'hidden',
    },
    image: {
        borderRadius: 8,
        width: '100%',
        height: CARD_WIDTH * 1.5,
        backgroundColor: '#f5f5f5',
        marginBottom: 8,
    },
    title: {
        fontFamily: FONT.LORA,
        fontSize: 16,
        color: COLOR.TEXT,
        lineHeight: 24
    },
    content: {
        gap: 2,
    },
});

export default ProductCard