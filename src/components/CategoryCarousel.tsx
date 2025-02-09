import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { FONT } from '@/src/constants/font';

interface Category {
    id: string;
    title: string;
    image: string;
}

const categories: Category[] = [
    {
        id: '1',
        title: 'Quần jean',
        image: 'https://path-to-your-image/jean.jpg'
    },
    {
        id: '2',
        title: 'Chân váy',
        image: 'https://path-to-your-image/dress.jpg'
    },
    {
        id: '3',
        title: 'Áo sơ mi & Áo kiểu',
        image: 'https://path-to-your-image/shirt.jpg'
    },
    {
        id: '4',
        title: 'Áo sơ mi & Áo kiểu',
        image: 'https://path-to-your-image/shirt.jpg'
    },
    {
        id: '5',
        title: 'Áo sơ mi & Áo kiểu',
        image: 'https://path-to-your-image/shirt.jpg'
    },
    {
        id: '6',
        title: 'Áo sơ mi & Áo kiểu',
        image: 'https://path-to-your-image/shirt.jpg'
    },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.3;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const CategoryCarousel = () => {
    return (
        <View>
            <Text style={styles.title}>Danh mục</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToAlignment="center"
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.card}
                        activeOpacity={0.8}
                    >
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: category.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={styles.overlay} />
                            <Text style={styles.categoryTitle}>
                                {category.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
        marginBottom: 12,
        color: '#000',
    },
    scrollContent: {
        gap: 8,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        padding: 4,
        borderWidth: 1,
        borderColor: '#303437',
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
        borderRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Tạo lớp overlay tối
        borderRadius: 4,
    },
    categoryTitle: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: FONT.LORA,
    },
});

export default CategoryCarousel;