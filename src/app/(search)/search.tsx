import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useLocalSearchParams, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBestSellerProducts, getProducts } from '@/src/services/product.service';
import { Product } from '@/src/types/product.type';
import { useFilterStore } from '@/src/store/filterStore';

const suggestedProducts = [
    {
        id: '1',
        name: 'Áo thun nam',
        image: 'https://example.com/image1.jpg' // Thay bằng URL ảnh thật
    },
    {
        id: '2',
        name: 'Quần jeans nữ',
        image: 'https://example.com/image2.jpg'
    },
    {
        id: '3',
        name: 'Váy maxi',
        image: 'https://example.com/image3.jpg'
    },
    {
        id: '4',
        name: 'Áo khoác bomber',
        image: 'https://example.com/image4.jpg'
    },
    {
        id: '5',
        name: 'Giày thể thao',
        image: 'https://example.com/image5.jpg'
    },
    {
        id: '6',
        name: 'Đầm công sở',
        image: 'https://example.com/image6.jpg'
    },
    {
        id: '7',
        name: 'Áo sơ mi nam',
        image: 'https://example.com/image7.jpg'
    },
    {
        id: '8',
        name: 'Quần tây nam',
        image: 'https://example.com/image8.jpg'
    },
    {
        id: '9',
        name: 'Túi xách nữ',
        image: 'https://example.com/image9.jpg'
    },
    {
        id: '10',
        name: 'Đồng hồ thời trang',
        image: 'https://example.com/image10.jpg'
    },
    {
        id: '11',
        name: 'Áo khoác jean',
        image: 'https://example.com/image11.jpg'
    },
    {
        id: '12',
        name: 'Sandal nữ',
        image: 'https://example.com/image12.jpg'
    },
    {
        id: '13',
        name: 'Áo polo nam',
        image: 'https://example.com/image13.jpg'
    },
    {
        id: '14',
        name: 'Chân váy xếp ly',
        image: 'https://example.com/image14.jpg'
    },
    {
        id: '15',
        name: 'Áo blazer nữ',
        image: 'https://example.com/image15.jpg'
    },
    {
        id: '16',
        name: 'Giày cao gót',
        image: 'https://example.com/image16.jpg'
    },
    {
        id: '17',
        name: 'Quần short jean',
        image: 'https://example.com/image17.jpg'
    },
    {
        id: '18',
        name: 'Áo len nam',
        image: 'https://example.com/image18.jpg'
    },
    {
        id: '19',
        name: 'Đầm dự tiệc',
        image: 'https://example.com/image19.jpg'
    },
    {
        id: '20',
        name: 'Ví da nam',
        image: 'https://example.com/image20.jpg'
    },
];

const SearchScreen = () => {
    const { keyword } = useLocalSearchParams()
    const router = useRouter()
    const [searchText, setSearchText] = useState('')
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [recentSearches, setRecentSearches] = useState([])
    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
    const filterSearch = useFilterStore();

    useEffect(() => {
        loadRecentSearches()
        loadSuggestedProducts()
    }, [])

    useEffect(() => {
        if (keyword) {
            handleSearch(Array.isArray(keyword) ? keyword[0] : keyword)
        }
    }, [keyword])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(searchText);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);

    const loadRecentSearches = async () => {
        try {
            const searches = await AsyncStorage.getItem('recentSearches')
            if (searches) {
                setRecentSearches(JSON.parse(searches))
            }
        } catch (error) {
            console.error('Error loading recent searches:', error)
        }
    }

    const loadSuggestedProducts = async () => {
        try {
            const results = await getBestSellerProducts();
            setSuggestedProducts(results.data.data);
        } catch (error) {
            console.error('Error loading suggested products:', error)
        }
    }

    const handleSearch = async (text: string) => {
        setSearchText(text)
        if (text.trim()) {
            const results = await getProducts({ search: text, page: 0 });
            setSearchResults(results.data.data);
        } else {
            setSearchResults([]);
        }
    }

    const saveSearch = async (term: string) => {
        try {
            const searches = await AsyncStorage.getItem('recentSearches')
            let newSearches = searches ? JSON.parse(searches) : []
            // Thêm term mới vào đầu và loại bỏ các term trùng lặp
            newSearches = [term, ...newSearches.filter((s: string) => s !== term)]
            // Giới hạn 10 lịch sử tìm kiếm gần nhất
            newSearches = newSearches.slice(0, 10)
            await AsyncStorage.setItem('recentSearches', JSON.stringify(newSearches))
            setRecentSearches(newSearches)
        } catch (error) {
            console.error('Error saving search:', error)
        }
    }

    const handleSelectItem = async (item: string) => {
        await saveSearch(item)
        router.replace(`/result?keyword=${encodeURIComponent(item)}`)
    }

    const handleSubmit = async () => {
        if (searchText.trim()) {
            await saveSearch(searchText.trim())
            router.replace(`/result?keyword=${encodeURIComponent(searchText.trim())}`)
        }
    }

    // Thêm hàm xóa một lịch sử tìm kiếm
    const handleDeleteSearchHistory = async (itemToDelete: string) => {
        try {
            const newSearches = recentSearches.filter(item => item !== itemToDelete)
            await AsyncStorage.setItem('recentSearches', JSON.stringify(newSearches))
            setRecentSearches(newSearches)
        } catch (error) {
            console.error('Error deleting search history:', error)
        }
    }

    // Thêm hàm xóa input
    const handleClearInput = () => {
        setSearchText('')
        setSearchResults([])
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <TextInput
                        autoFocus
                        placeholder="Tìm kiếm"
                        style={styles.input}
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={handleSubmit}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClearInput}
                        >
                            <SimpleLineIcons name="close" size={16} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.suggestions}>
                {/* Phần kết quả tìm kiếm */}
                {searchText && searchResults.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
                        {searchResults.map((item: any, index) => (
                            <TouchableOpacity key={index} onPress={() => handleSelectItem(item.name)}>
                                <Text style={styles.suggestion}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </>
                )}

                {/* Phần tìm kiếm gần đây */}
                {!searchText && recentSearches.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
                        </View>
                        {recentSearches.map((item, index) => (
                            <View key={index} style={styles.historyItem}>
                                <TouchableOpacity
                                    style={styles.historyContent}
                                    onPress={() => handleSelectItem(item)}
                                >
                                    <SimpleLineIcons
                                        name="clock"
                                        size={16}
                                        color="#666"
                                        style={styles.historyIcon}
                                    />
                                    <Text style={styles.suggestion}>{item}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDeleteSearchHistory(item)}
                                >
                                    <SimpleLineIcons name="close" size={16} color="#666" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </>
                )}

                {/* Phần gợi ý tìm kiếm */}
                {!searchText && (
                    <>
                        <Text style={styles.sectionTitle}>Gợi ý tìm kiếm</Text>
                        <View style={styles.gridContainer}>
                            {suggestedProducts.map((product) => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={styles.gridItem}
                                    onPress={() => handleSelectItem(product.name)}
                                >
                                    <Image
                                        source={{ uri: product.images[0] }}
                                        style={styles.productImage}
                                    />
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 8
    },
    header: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 4
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingRight: 32,
    },
    clearButton: {
        position: 'absolute',
        right: 8,
        padding: 4,
    },
    suggestions: {
        paddingHorizontal: 12,
        paddingTop: 12
    },
    suggestion: {
        fontSize: 16,
        color: '#333',
        marginBottom: 2
    },
    highlightedText: {
        fontWeight: 'bold'
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        marginTop: 8
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    historyContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyIcon: {
        marginRight: 8,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        aspectRatio: 2 / 3,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    productName: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
    },
})

export default SearchScreen