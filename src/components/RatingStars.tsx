import type React from "react"
import { View, StyleSheet } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

interface RatingStarsProps {
    rating: number
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
    // Đảm bảo rating nằm trong khoảng từ 0 đến 5
    const normalizedRating = Math.max(0, Math.min(5, rating))


    // Tính toán số sao đầy và phần thập phân
    const fullStars = Math.floor(normalizedRating)
    const decimalPart = normalizedRating - fullStars

    // Render một ngôi sao
    const renderStar = (key: number, filled: number) => (
        <View key={key} style={styles.starContainer}>
            {/* Ngôi sao viền */}
            <FontAwesome name="star-o" size={12} color="#FFD700" style={styles.outlineStar} />
            {/* Ngôi sao đầy */}
            <View style={[styles.filledStarContainer, { width: `${filled * 100}%` }]}>
                <FontAwesome name="star" size={12} color="#FFD700" />

            </View>
        </View>
    )

    // Tạo mảng sao để render
    const stars = []
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            // Sao đầy
            stars.push(renderStar(i, 1))
        } else if (i === fullStars && decimalPart > 0) {
            // Sao một phần
            stars.push(renderStar(i, decimalPart))
        } else {
            // Sao rỗng
            stars.push(renderStar(i, 0))
        }
    }

    return <View style={styles.container}>{stars}</View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    starContainer: {
        position: "relative",
        marginRight: 1,
        width: 12,
        height: 12,

    },
    outlineStar: {
        position: "absolute",
    },
    filledStarContainer: {
        position: "absolute",
        overflow: "hidden",
    },
})

export default RatingStars;
