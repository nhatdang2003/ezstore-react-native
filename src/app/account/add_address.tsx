import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import CustomButton from '@/src/components/CustomButton'
import Input from '@/src/components/Input'
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
import Select from '@/src/components/Select'
import { COLOR } from '@/src/constants/color'
import { FONT } from '@/src/constants/font'
import CustomSwitch from '@/src/components/CustomSwitch'
import { createShippingProfile, setDefaultShippingProfile } from '@/src/services/shipping-profile.service'
import { ShippingProfileReq, ShippingProfileDefaultReq } from '@/src/types/shipping-profile.type'
import { getProvinces, getDistricts, getWards } from '@/src/services/ghn.service'
import { Province, District, Ward } from '@/src/types/ghn.type'

const AddAddressScreen = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        provinceId: 0,
        province: '',
        districtId: 0,
        district: '',
        wardId: 0,
        ward: '',
        address: '',
        default: false
    })

    // State for GHN data
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const [selectedProvinceId, setSelectedProvinceId] = useState<number>(0)
    const [selectedDistrictId, setSelectedDistrictId] = useState<number>(0)

    // Fetch provinces when component mounts
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setLoading(true)
                const response = await getProvinces()
                if (response.data) {
                    setProvinces(response.data)
                }
            } catch (err) {
                console.error("Failed to fetch provinces:", err)
                setError("Không thể tải danh sách tỉnh thành")
            } finally {
                setLoading(false)
            }
        }

        fetchProvinces()
    }, [])

    // Fetch districts when provinceId changes
    useEffect(() => {
        const fetchDistricts = async () => {
            if (!selectedProvinceId) return

            try {
                const response = await getDistricts(selectedProvinceId)
                if (response.data) {
                    setDistricts(response.data)
                    // Reset wards when district changes
                    setWards([])
                }
            } catch (err) {
                console.error("Failed to fetch districts:", err)
            }
        }

        fetchDistricts()
    }, [selectedProvinceId])

    // Fetch wards when districtId changes
    useEffect(() => {
        const fetchWards = async () => {
            if (!selectedDistrictId) return

            try {
                const response = await getWards(selectedDistrictId)
                if (response.data) {
                    setWards(response.data)
                }
            } catch (err) {
                console.error("Failed to fetch wards:", err)
            }
        }

        fetchWards()
    }, [selectedDistrictId])

    // Convert data to options for select components
    const provinceOptions = useMemo(() => {
        return provinces.map(item => ({
            label: item.ProvinceName,
            value: item.ProvinceID.toString()
        }))
    }, [provinces])

    const districtOptions = useMemo(() => {
        return districts.map(item => ({
            label: item.DistrictName,
            value: item.DistrictID.toString()
        }))
    }, [districts])

    const wardOptions = useMemo(() => {
        return wards.map(item => ({
            label: item.WardName,
            value: item.WardCode
        }))
    }, [wards])

    // Handle province selection change
    const handleProvinceChange = (value: string) => {
        const provinceId = Number(value)
        const selectedProvince = provinces.find(p => p.ProvinceID === provinceId)

        setSelectedProvinceId(provinceId)
        setAddress(prev => ({
            ...prev,
            provinceId: provinceId,
            province: selectedProvince ? selectedProvince.ProvinceName : '',
            // Reset district and ward when province changes
            districtId: 0,
            district: '',
            wardId: 0,
            ward: ''
        }))
    }

    // Handle district selection change
    const handleDistrictChange = (value: string) => {
        const districtId = Number(value)
        const selectedDistrict = districts.find(d => d.DistrictID === districtId)

        setSelectedDistrictId(districtId)
        setAddress(prev => ({
            ...prev,
            districtId: districtId,
            district: selectedDistrict ? selectedDistrict.DistrictName : '',
            // Reset ward when district changes
            wardId: 0,
            ward: ''
        }))
    }

    // Handle ward selection change
    const handleWardChange = (value: string) => {
        const wardId = Number(value)
        const selectedWard = wards.find(w => Number(w.WardCode) === wardId)

        setAddress(prev => ({
            ...prev,
            wardId: wardId,
            ward: selectedWard ? selectedWard.WardName : ''
        }))
    }

    // Handle form submission
    const handleSaveAddress = async () => {
        try {
            setSubmitting(true)

            // Create request payload
            const createData: ShippingProfileReq = {
                id: 0,
                firstName: address.firstName,
                lastName: address.lastName,
                phoneNumber: address.phoneNumber,
                address: address.address,
                provinceId: address.provinceId,
                province: address.province,
                districtId: address.districtId,
                district: address.district,
                wardId: address.wardId,
                ward: address.ward
            }

            // Create shipping profile
            const response = await createShippingProfile(createData)

            // If user wants this address as default and creation was successful
            if (address.default && response.data) {
                const defaultData: ShippingProfileDefaultReq = {
                    shippingProfileId: response.data.id
                }
                await setDefaultShippingProfile(defaultData)
            }

            // Go back to previous screen
            router.back()
        } catch (err) {
            console.error("Failed to create shipping profile:", err)
            setError("Không thể tạo địa chỉ mới")
        } finally {
            setSubmitting(false)
        }
    }

    // Check if form is valid for submission
    const isFormValid = () => {
        return (
            address.firstName !== '' &&
            address.lastName !== '' &&
            address.phoneNumber !== '' &&
            address.address !== '' &&
            address.provinceId !== 0 &&
            address.districtId !== 0 &&
            address.wardId !== 0
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thêm địa chỉ mới</Text>
                <View />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLOR.PRIMARY} />
                </View>
            ) : (
                <KeyboardAvoidingView
                    keyboardVerticalOffset={20}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>
                    <ScrollView style={styles.content}>
                        <Input
                            placeholder="Họ"
                            value={address.firstName}
                            onChangeText={(text) => setAddress(prev => ({ ...prev, firstName: text }))}
                            leftIcon={<MaterialCommunityIcons name="account-outline" size={24} />}
                        />

                        <Input
                            placeholder="Tên"
                            value={address.lastName}
                            onChangeText={(text) => setAddress(prev => ({ ...prev, lastName: text }))}
                            leftIcon={<MaterialCommunityIcons name="account-outline" size={24} />}
                        />

                        <Input
                            placeholder="Số điện thoại"
                            value={address.phoneNumber}
                            onChangeText={(text) => setAddress(prev => ({ ...prev, phoneNumber: text }))}
                            leftIcon={<MaterialCommunityIcons name="phone-outline" size={24} />}
                            keyboardType="phone-pad"
                        />

                        <View style={styles.pickerContainer}>
                            <Select
                                value={address.provinceId ? address.provinceId.toString() : ''}
                                onChange={handleProvinceChange}
                                placeholder='Chọn tỉnh thành'
                                options={provinceOptions}
                                icon={<MaterialCommunityIcons name="map-marker-outline" size={24} />}
                            />
                        </View>

                        <View style={styles.pickerContainer}>
                            <Select
                                value={address.districtId ? address.districtId.toString() : ''}
                                onChange={handleDistrictChange}
                                placeholder='Chọn quận/huyện'
                                options={districtOptions}
                                icon={<MaterialCommunityIcons name="map-marker-outline" size={24} />}
                                disabled={!address.provinceId}
                            />
                        </View>

                        <View style={styles.pickerContainer}>
                            <Select
                                value={address.wardId ? address.wardId.toString() : ''}
                                onChange={handleWardChange}
                                placeholder='Chọn phường/xã'
                                options={wardOptions}
                                icon={<MaterialCommunityIcons name="map-marker-outline" size={24} />}
                                disabled={!address.districtId}
                            />
                        </View>

                        <Input
                            placeholder="Địa chỉ cụ thể"
                            value={address.address}
                            onChangeText={(text) => setAddress(prev => ({ ...prev, address: text }))}
                            leftIcon={<MaterialCommunityIcons name="map-marker-outline" size={24} />}
                        />

                        <View style={styles.containerDefault}>
                            <Text style={styles.textDefault}>Đặt làm địa chỉ mặc định</Text>
                            <CustomSwitch
                                value={address.default}
                                onValueChange={() => { setAddress(prev => ({ ...prev, default: !prev.default })) }} />
                        </View>

                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Lưu địa chỉ"
                                onPress={handleSaveAddress}
                                style={styles.saveButton}
                                disabled={submitting || !isFormValid()}
                            />
                        </View>

                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        flexGrow: 1,
        padding: 16
    },
    header: {
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    pickerContainer: {
        borderRadius: 8,
        marginVertical: 8
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
    },
    saveButton: {
        backgroundColor: COLOR.PRIMARY,
        flex: 1,
    },
    containerDefault: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8
    },
    textDefault: {
        fontSize: 16
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10
    }
})

export default AddAddressScreen