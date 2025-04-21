import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { FONT } from '@/src/constants/font'

const ReviewsProductScreen = () => {
    const router = useRouter()

    const [activeFilter, setActiveFilter] = useState<number | null>(null)

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <AntDesign key={`star-${i}`} name="star" size={14} color="#FFD700" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <AntDesign key="half-star" name="staro" size={14} color="#FFD700" />
            );
        }

        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <AntDesign
                    key={`empty-star-${i}`}
                    name="staro"
                    size={14}
                    color="#FFD700"
                />
            );
        }

        return stars;
    };

    // Handle filter selection
    const handleFilterSelect = (stars: number | null) => {
        setActiveFilter(stars === activeFilter ? null : stars)
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Star Filters */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, activeFilter === null && styles.activeFilterButton]}
                    onPress={() => handleFilterSelect(null)}
                >
                    <Text style={[styles.filterText, activeFilter === null && styles.activeFilterText]}>Tất cả</Text>
                </TouchableOpacity>

                {[5, 4, 3, 2, 1].map((stars) => (
                    <TouchableOpacity
                        key={`filter-${stars}`}
                        style={[styles.filterButton, activeFilter === stars && styles.activeFilterButton]}
                        onPress={() => handleFilterSelect(stars)}
                    >
                        <Text style={[styles.filterText, activeFilter === stars && styles.activeFilterText]}>
                            {stars} <AntDesign name="star" size={12} color={activeFilter === stars ? "#fff" : "#FFD700"} />
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <ScrollView showsVerticalScrollIndicator={false}
                style={styles.scrollView}>
                <View style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                        <View style={styles.userInfo}>
                            <Image style={styles.userAvatar} />
                            <Text style={styles.username}>Tên người dùng</Text>
                        </View>
                        <Text style={styles.reviewDate}>22/04/2025 1:52</Text>
                    </View>
                    <View style={styles.ratingStars}>
                        {renderStars(5)}
                    </View>
                    <Text style={styles.variantInfo}>Màu trắng, size L</Text>
                    <Text style={styles.reviewContent}>
                        Sản phẩm tốt, đáng để trải nghiệm Sản phẩm tốt, đáng để trải nghiệm
                    </Text>
                </View>
                <View style={styles.divider} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 18,
    },
    placeholder: {
        width: 24,
    },
    scrollView: {
        paddingHorizontal: 16,
    },
    reviewItem: {
        gap: 6,
        marginVertical: 12,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    userAvatar: {
        width: 20,
        height: 20,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "black",
    },
    username: {
        fontWeight: "500",
    },
    reviewDate: {
        color: "#999",
    },
    ratingStars: {
        flexDirection: "row",
        alignItems: "center",
    },
    variantInfo: {
        color: "#999",
    },
    reviewContent: {
        color: "#333",
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E0E0E0",
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    activeFilterButton: {
        backgroundColor: "#FFD700",
        borderColor: "#FFD700",
    },
    filterText: {
        fontSize: 14,
        color: "#333",
    },
    activeFilterText: {
        color: "#fff",
    },
})

export default ReviewsProductScreen