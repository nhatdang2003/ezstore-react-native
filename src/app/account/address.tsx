import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native"
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { FONT } from "@/src/constants/font"
import CustomButton from "@/src/components/CustomButton"
import { useLocalSearchParams, useRouter } from "expo-router"

// Sample address data
const addresses = [
    {
        id: "1",
        name: "Nguyễn Văn A",
        phone: "0912345678",
        address: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
        isDefault: true,
    },
    {
        id: "2",
        name: "Nguyễn Văn B",
        phone: "0987654321",
        address: "456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
        isDefault: false,
    },
]

const AddressScreen = () => {
    const router = useRouter()

    const handleBack = () => {
        router.back()
    }

    const handleAddAddress = () => {
        router.push('/account/add_address')
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
                {addresses.map((address) => (
                    <TouchableOpacity key={address.id} style={styles.addressItem}
                        onPress={() => router.push({
                            pathname: '/account/edit_address',
                            params: { id: address.id }
                        })}
                    >
                        <View style={styles.addressHeader}>
                            <Text style={styles.addressName}>{address.name}</Text>
                            {address.isDefault && (
                                <View style={styles.defaultTag}>
                                    <Text style={styles.defaultTagText}>Mặc định</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.addressPhone}>{address.phone}</Text>
                        <Text style={styles.addressText}>{address.address}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.addButtonContainer}>
                <CustomButton
                    leftIcon={<SimpleLineIcons name="plus" size={20} color="black" />}
                    variant="ghost"
                    title="Thêm địa chỉ mới"
                    textStyle={styles.addButtonText}
                    onPress={handleAddAddress} />
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
    },
    addressItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        gap: 2
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
    addButtonContainer: {
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    addButton: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    addButtonText: {
        fontSize: 15,
        color: "#000",
    },
})

export default AddressScreen
