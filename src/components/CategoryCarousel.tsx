import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { FONT } from '@/src/constants/font';
import { getCategoriesHomeTab } from '@/src/services/category.service';

interface Category {
    id: number;
    name: string;
    imageUrl: string;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.3;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const CategoryCarousel = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getCategoriesHomeTab();
            if (response.statusCode === 200) {
                setCategories(response.data.data);
            }
        } catch (err) {
            setError('Không thể tải danh mục. Vui lòng thử lại sau.');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#303437" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (categories.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có danh mục nào</Text>
            </View>
        );
    }

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
                                source={{ uri: category.imageUrl }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={styles.overlay} />
                            <Text style={styles.categoryTitle}>
                                {category.name}
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
    loadingContainer: {
        height: CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        height: CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        fontFamily: FONT.LORA,
    },
    emptyContainer: {
        height: CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#8E8E93',
        fontFamily: FONT.LORA,
    },
});

export default CategoryCarousel;