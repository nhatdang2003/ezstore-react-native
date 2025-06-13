"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
const ReactNativeModal = require("react-native-modal").default;

interface FilterModalProps {
    visible: boolean
    onClose: () => void
    onApplyFilters: (filters: FilterOptions) => void
}

interface FilterOptions {
    category: string | null
    sortBy: "price-low-high" | "price-high-low" | "discount" | null
}

const categories = ["All", "Electronics", "Wearables", "Gaming", "Photography"]
const sortOptions = [
    { id: "price-low-high", label: "Price: Low to High" },
    { id: "price-high-low", label: "Price: High to Low" },
    { id: "discount", label: "Highest Discount" },
]

const FilterModal = ({ visible, onClose, onApplyFilters }: FilterModalProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>("All")
    const [selectedSort, setSelectedSort] = useState<string | null>(null)

    const handleApply = () => {
        onApplyFilters({
            category: selectedCategory === "All" ? null : selectedCategory,
            sortBy: selectedSort as FilterOptions["sortBy"],
        })
        onClose()
    }

    const handleReset = () => {
        setSelectedCategory("All")
        setSelectedSort(null)
    }

    return (
        <ReactNativeModal
            isVisible={visible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            swipeDirection={['down']}
            onSwipeComplete={onClose}
            style={styles.modal}
            propagateSwipe
            useNativeDriver
            backdropTransitionOutTiming={0}
            animationIn="slideInUp"
            animationOut="slideOutDown"
        >
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Filter & Sort</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Feather name="x" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.indicator} />

                <View style={styles.filterSection}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <View style={styles.optionsContainer}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[styles.optionButton, selectedCategory === category && styles.selectedOption]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text style={[styles.optionText, selectedCategory === category && styles.selectedOptionText]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.filterSection}>
                    <Text style={styles.sectionTitle}>Sort By</Text>
                    <View style={styles.optionsContainer}>
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[styles.optionButton, selectedSort === option.id && styles.selectedOption]}
                                onPress={() => setSelectedSort(option.id)}
                            >
                                <Text style={[styles.optionText, selectedSort === option.id && styles.selectedOptionText]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Text style={styles.resetButtonText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                        <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ReactNativeModal>
    )
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingTop: 16,
        maxHeight: "80%",
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
        position: 'absolute',
        top: 8,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    filterSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
    },
    optionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -4,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        marginHorizontal: 4,
        marginBottom: 8,
    },
    selectedOption: {
        backgroundColor: "#e63946",
    },
    optionText: {
        fontSize: 14,
        color: "#333",
    },
    selectedOptionText: {
        color: "#fff",
        fontWeight: "500",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        marginRight: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    resetButtonText: {
        fontSize: 16,
        color: "#333",
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 8,
        borderRadius: 8,
        backgroundColor: "#e63946",
        alignItems: "center",
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
})

export default FilterModal
