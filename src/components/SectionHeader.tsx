import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import ProductCard from '@/src/components/ProductCard'
import Feather from '@expo/vector-icons/Feather';
import { ProductCardProps } from '@/src/types/product.type';
import { FONT } from '../constants/font';

const SectionHeader = ({ data, title, onViewAll, loading }:
    { 
        data: ProductCardProps[], 
        title: string, 
        onViewAll: () => void,
        loading?: boolean 
    }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onViewAll}>
                    <Feather name="arrow-right" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#303437" />
                </View>
            ) : (
                <View style={styles.grid}>
                    {data.map((item) => (
                        <ProductCard
                            key={item.id}
                            id={item.id}
                            image={item.image}
                            title={item.title}
                            price={item.price}
                            rating={item.rating}
                            priceDiscount={item.priceDiscount}
                        />
                    ))}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    viewAll: {
        fontSize: 16,
    },
    grid: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default SectionHeader