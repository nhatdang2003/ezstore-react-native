import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from "react-native"
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { FONT } from "@/src/constants/font"
import CustomButton from "@/src/components/CustomButton"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useCallback, useEffect, useState } from "react"
import { getShippingProfiles } from "@/src/services/shipping-profile.service"
import { ShippingProfile } from "@/src/types/shipping-profile.type"
import React from "react"

const ChooseAddressScreen = () => {
    const router = useRouter()
    const { selectedID, cartItemIds } = useLocalSearchParams()
    const [addresses, setAddresses] = useState<ShippingProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useFocusEffect(
        useCallback(() => {
            const fetchAddresses = async () => {
                try {
                    setLoading(true)
                    const response = await getShippingProfiles()
                    if (response.data) {
                        setAddresses(response.data)
                    }
                } catch (err) {
                    console.error("Failed to fetch shipping profiles:", err)
                    setError("Không thể tải danh sách địa chỉ")
                } finally {
                    setLoading(false)
                }
            }

            fetchAddresses()
        }, [])
    )

    const handleBack = () => {
        router.replace({
            pathname: '/cart/checkout',
            params: { selectedID, cartItemIds }
        })
    }

    const handleChoose = (id: string | number) => {
        router.replace({
            pathname: '/cart/checkout',
            params: { selectedID: id, cartItemIds }
        })
    }

    const handleAddNewAddress = () => {
        router.navigate('/account/add_address')
    }

    const handleEditAddress = (id: string | number) => {
        router.push({
            pathname: '/account/edit_address',
            params: { id }
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Địa chỉ</Text>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.addressList}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <React.Fragment>
                        {addresses.length === 0 ? (
                            <Text style={styles.noAddressText}>Bạn chưa có địa chỉ nào</Text>
                        ) : (
                            addresses.map((address) => (
                                <TouchableOpacity key={address.id} style={styles.addressItem}
                                    onPress={() => handleChoose(address.id)}
                                >
                                    {String(address.id) === String(selectedID)
                                        ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="black" />
                                        : <MaterialCommunityIcons name="radiobox-blank" size={24} color="black" />}
                                    <View style={{ gap: 2, flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={styles.addressHeader}>
                                                <Text style={styles.addressName}>{`${address.firstName} ${address.lastName}`}</Text>
                                                {address.default && (
                                                    <View style={styles.defaultTag}>
                                                        <Text style={styles.defaultTagText}>Mặc định</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <TouchableOpacity onPress={() => handleEditAddress(address.id)}>
                                                <Text>Sửa</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.addressPhone}>{address.phoneNumber}</Text>
                                        <Text style={styles.addressText}>
                                            {`${address.address}, ${address.ward}, ${address.district}, ${address.province}`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}

                        <View style={styles.buttonContainer}>
                            <CustomButton
                                leftIcon={<SimpleLineIcons name="plus" size={20} color="black" />}
                                title="Thêm địa chỉ mới"
                                variant="ghost"
                                onPress={handleAddNewAddress}
                                style={styles.addButton}
                                textStyle={styles.addButtonText}
                            />
                        </View>
                    </React.Fragment>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#FFF",
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM
    },
    headerRight: {
        width: 40,
    },
    addressList: {
        paddingHorizontal: 16,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
    },
    noAddressText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    addressItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    addressHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    addressName: {
        fontSize: 15,
        fontFamily: FONT.LORA_MEDIUM,
        marginRight: 8,
    },
    defaultTag: {
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultTagText: {
        fontSize: 12,
        color: "#666",
    },
    addressPhone: {
        fontSize: 14,
        color: "#ABABAF",
        marginBottom: 2,
    },
    addressText: {
        fontSize: 14,
        color: "#3C3C3C",
        lineHeight: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 16
    },
    addButton: {
        flex: 1,
    },
    addButtonText: {
        color: "#000"
    }
})

export default ChooseAddressScreen
