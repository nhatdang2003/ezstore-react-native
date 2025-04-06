import { useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from "react-native"
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons"
import { FONT } from "@/src/constants/font"
import { router } from "expo-router"
import { COLOR } from "@/src/constants/color"

export default function ReviewScreen() {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerTab}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá đơn hàng</Text>
                <View />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.reviewContainer}>
                    <View style={styles.reviewHeader}>
                        <View style={styles.userInfo}>
                            <Image source={{ uri: "/placeholder.svg?height=40&width=40" }} style={styles.avatar} />
                            <View>
                                <Text style={styles.username}>phuquypro.2003</Text>
                                <View style={styles.ratingContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Ionicons key={star} name="star" size={16} color="#FFD700" />
                                    ))}
                                </View>
                                <View>
                                    <Text>
                                        Great Great Great Great Great Great
                                        Great Great Great Great Great Great
                                        Great Great Great Great Great Great
                                        Great Great Great Great Great Great
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>Sửa</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.date}>30-03-2025 17:27</Text>

                    <View style={styles.productContainer}>
                        <Image source={{ uri: "/placeholder.svg?height=80&width=80" }} style={styles.productImage} />
                        <Text style={styles.productName} numberOfLines={2}>
                            Bộ sạc Baseus cổng loại C/PD 20W hỗ trợ sạc nhanh
                        </Text>
                    </View>
                </View>

                <View style={styles.reviewContainer}>
                    <View style={styles.reviewHeader}>
                        <View style={styles.userInfo}>
                            <Image source={{ uri: "/placeholder.svg?height=40&width=40" }} style={styles.avatar} />
                            <View>
                                <Text style={styles.username}>phuquypro.2003</Text>
                                <View style={styles.ratingContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Ionicons key={star} name="star" size={16} color="#FFD700" />
                                    ))}
                                </View>
                                <View>
                                    <Text>
                                        Great Great Great Great Great Great
                                        Great Great Great Great Great Great
                                        Great Great Great Great Great Great
                                        Great Great Great Great Great Great
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>Sửa</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.date}>30-03-2025 17:27</Text>

                    <View style={styles.productContainer}>
                        <Image source={{ uri: "/placeholder.svg?height=80&width=80" }} style={styles.productImage} />
                        <Text style={styles.productName} numberOfLines={2}>
                            Bộ sạc Baseus cổng loại C/PD 20W hỗ trợ sạc nhanh
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
    },
    headerTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    backButton: {
        padding: 4,
    },
    placeholder: {
        width: 24,
    },
    content: {
        flex: 1,
    },
    reviewContainer: {
        marginTop: 8,
        padding: 16,
        backgroundColor: '#fff'
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    userInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    username: {
        fontSize: 16,
        fontWeight: "500",
    },
    editButton: {
        borderWidth: 1,
        borderColor: COLOR.PRIMARY,
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    editButtonText: {
        color: COLOR.PRIMARY,
    },
    ratingContainer: {
        flexDirection: "row",
        marginVertical: 8,
    },
    date: {
        color: "#888",
        fontSize: 14,
        marginBottom: 16,
    },
    responseContainer: {
        backgroundColor: "#F8F8F8",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    responseTitle: {
        fontWeight: "600",
        marginBottom: 8,
    },
    responseText: {
        color: "#555",
        marginBottom: 4,
        lineHeight: 20,
    },
    productContainer: {
        flexDirection: "row",
        backgroundColor: "#F8F8F8",
        padding: 12,
        borderRadius: 8,
        alignItems: "flex-start",
    },
    productImage: {
        width: 60,
        height: 80,
        borderRadius: 4,
        marginRight: 12,
    },
    productName: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
    },
})

