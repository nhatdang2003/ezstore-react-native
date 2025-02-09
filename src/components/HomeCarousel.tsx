import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';

interface Slide {
    id: string;
    image: string;
}

const slides: Slide[] = [
    {
        id: '1',
        image: 'https://res.cloudinary.com/db9vcatme/image/upload/v1732775286/ao-jumper-1_si9btg.jpg'
    },
    {
        id: '2',
        image: 'https://res.cloudinary.com/db9vcatme/image/upload/v1732775286/ao-jumper-2_jnj3xq.jpg'
    },
    {
        id: '3',
        image: 'https://res.cloudinary.com/db9vcatme/image/upload/v1732775286/ao-jumper-3_yatbha.jpg'
    }
];

const { width } = Dimensions.get('window');

const HomeCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});
    const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const intervalId = setInterval(() => {
            const nextIndex = (activeIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [activeIndex]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffset / width);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    const goToSlide = (index: number) => {
        scrollViewRef.current?.scrollTo({
            x: index * width,
            animated: true,
        });
    };

    const handleImageLoad = (id: string) => {
        setImageLoading(prev => ({ ...prev, [id]: false }));
    };

    const handleImageError = (id: string) => {
        setImageError(prev => ({ ...prev, [id]: true }));
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={width}
                snapToAlignment="center"
                contentContainerStyle={styles.scrollContent}
                bounces={false}
            >
                {slides.map((slide) => (
                    <View key={slide.id} style={styles.slide}>
                        <Image
                            source={{ uri: slide.image }}
                            style={styles.image}
                            resizeMode="cover"
                            onLoadStart={() => setImageLoading(prev => ({ ...prev, [slide.id]: true }))}
                            onLoad={() => handleImageLoad(slide.id)}
                            onError={() => handleImageError(slide.id)}
                        />
                        {imageLoading[slide.id] && (
                            <View style={styles.loadingOverlay}>
                                <Text>Loading...</Text>
                            </View>
                        )}
                        {imageError[slide.id] && (
                            <View style={styles.errorOverlay}>
                                <Text>Failed to load image</Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => goToSlide(index)}
                        style={[
                            styles.dot,
                            index === activeIndex && styles.activeDot,
                        ]}
                        activeOpacity={0.7}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: width,
        height: width * 0.8,
    },
    scrollContent: {
        flexDirection: 'row',
    },
    slide: {
        width: width,
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
    },
    pagination: {
        position: 'absolute',
        bottom: 16,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    activeDot: {
        width: 24,
        backgroundColor: '#fff',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeCarousel;