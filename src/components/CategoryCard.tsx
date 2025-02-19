import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { ProductCardProps } from '@/src/types/product.type'
import RatingStars from '@/src/components/RatingStars';
import Price from '@/src/components/Price';
import { FONT } from '@/src/constants/font';
import { COLOR } from '@/src/constants/color';
const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

const CategoryCard = ({
    id,
    image,
    title,
    onPress
}: {
    id: string;
    image: string;
    title: string;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.title}>{title}</Text>
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
        lineHeight: 24,
        textAlign: 'center',
    },
});

export default CategoryCard