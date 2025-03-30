import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import CustomButton from '@/src/components/CustomButton'
import Input from '@/src/components/Input'
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import Select from '@/src/components/Select'
import { COLOR } from '@/src/constants/color'
import { FONT } from '@/src/constants/font'
import CustomSwitch from '@/src/components/CustomSwitch'

const province = [
    {
        "ProvinceID": 269,
        "ProvinceName": "Lào Cai",
        "CountryID": 1,
        "Code": "20",
        "NameExtension": [
            "Lào Cai",
            "Tỉnh Lào Cai",
            "T.Lào Cai",
            "T Lào Cai",
            "laocai"
        ],
        "IsEnable": 1,
        "RegionID": 6,
        "RegionCPN": 5,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:41:26.891384 +0700 +07 m=+0.010448463",
        "UpdatedAt": "2019-12-05 15:41:26.891384 +0700 +07 m=+0.010449016",
        "AreaID": 1,
        "CanUpdateCOD": false,
        "Status": 1,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:06:57.352Z"
    },
    {
        "ProvinceID": 268,
        "ProvinceName": "Hưng Yên",
        "CountryID": 1,
        "Code": "321",
        "NameExtension": [
            "Hưng Yên",
            "Tỉnh Hưng Yên",
            "T.Hưng Yên",
            "T Hưng Yên",
            "hungyen"
        ],
        "IsEnable": 1,
        "RegionID": 6,
        "RegionCPN": 4,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:41:26.89138 +0700 +07 m=+0.010444468",
        "UpdatedAt": "2019-12-05 15:41:26.891383 +0700 +07 m=+0.010447473",
        "CanUpdateCOD": false,
        "Status": 1,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:06:57.346Z"
    },
    {
        "ProvinceID": 267,
        "ProvinceName": "Hòa Bình",
        "CountryID": 1,
        "Code": "218",
        "NameExtension": [
            "Hòa Bình",
            "Tỉnh Hòa Bình",
            "T.Hòa Bình",
            "T Hòa Bình",
            "hoabinh"
        ],
        "IsEnable": 1,
        "RegionID": 6,
        "RegionCPN": 5,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:41:26.891378 +0700 +07 m=+0.010443042",
        "UpdatedAt": "2019-12-05 15:41:26.891379 +0700 +07 m=+0.010443604",
        "CanUpdateCOD": false,
        "Status": 1,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:06:57.347Z"
    },
    {
        "ProvinceID": 266,
        "ProvinceName": "Sơn La",
        "CountryID": 1,
        "Code": "22",
        "NameExtension": [
            "Sơn La",
            "Tỉnh Sơn La",
            "T.Sơn La",
            "T Sơn La",
            "sonla"
        ],
        "IsEnable": 1,
        "RegionID": 6,
        "RegionCPN": 5,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:41:26.891377 +0700 +07 m=+0.010441659",
        "UpdatedAt": "2019-12-05 15:41:26.891378 +0700 +07 m=+0.010442220",
        "CanUpdateCOD": false,
        "Status": 1,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:06:57.361Z"
    }
]

const district = [
    {
        "DistrictID": 3451,
        "ProvinceID": 268,
        "DistrictName": "Quận Đặc Biệt",
        "Code": "9505",
        "Type": 1,
        "SupportType": 3,
        "IsEnable": 1,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:53:32.43142 +0700 +07 m=+0.015365672",
        "UpdatedAt": "2020-09-29 13:42:41.252523 +0700 +07 m=+13.754966576",
        "CanUpdateCOD": false,
        "Status": 1,
        "PickType": 0,
        "DeliverType": 0,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListDistrict": {
            "From": null,
            "To": null
        },
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": null
    },
    {
        "DistrictID": 2194,
        "ProvinceID": 268,
        "DistrictName": "Huyện Phù Cừ",
        "Code": "2207",
        "Type": 3,
        "SupportType": 3,
        "NameExtension": [
            "Huyện Phù Cừ",
            "H.Phù Cừ",
            "H Phù Cừ",
            "Phù Cừ",
            "Phu Cu",
            "Huyen Phu Cu",
            "phucu"
        ],
        "IsEnable": 1,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:53:32.432075 +0700 +07 m=+0.016021053",
        "UpdatedAt": "2020-09-29 13:42:48.484011 +0700 +07 m=+20.986316837",
        "CanUpdateCOD": false,
        "Status": 1,
        "PickType": 1,
        "DeliverType": 1,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListDistrict": {
            "From": null,
            "To": null
        },
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": [
            "2024-08-02T17:00:00Z"
        ],
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:06:59.494Z"
    },
    {
        "DistrictID": 2046,
        "ProvinceID": 268,
        "DistrictName": "Huyện Văn Lâm",
        "Code": "2209",
        "Type": 3,
        "SupportType": 0,
        "NameExtension": [
            "Huyện Văn Lâm",
            "H.Văn Lâm",
            "H Văn Lâm",
            "Văn Lâm",
            "Van Lam",
            "Huyen Van Lam",
            "vanlam"
        ],
        "IsEnable": 1,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:53:32.432799 +0700 +07 m=+0.016745172",
        "UpdatedAt": "2020-09-29 13:42:52.86263 +0700 +07 m=+25.364853097",
        "CanUpdateCOD": false,
        "Status": 1,
        "PickType": 3,
        "DeliverType": 3,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListDistrict": {
            "From": null,
            "To": null
        },
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": [
            "2024-08-02T17:00:00Z"
        ],
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:06:58.975Z"
    },
    {
        "DistrictID": 2045,
        "ProvinceID": 268,
        "DistrictName": "Huyện Văn Giang",
        "Code": "2210",
        "Type": 3,
        "SupportType": 0,
        "NameExtension": [
            "Huyện Văn Giang",
            "H.Văn Giang",
            "H Văn Giang",
            "Văn Giang",
            "Van Giang",
            "Huyen Van Giang",
            "vangiang"
        ],
        "IsEnable": 1,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:53:32.432798 +0700 +07 m=+0.016743790",
        "UpdatedAt": "2020-09-29 13:42:52.895258 +0700 +07 m=+25.397480468",
        "CanUpdateCOD": false,
        "Status": 2,
        "PickType": 0,
        "DeliverType": 0,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListDistrict": {
            "From": null,
            "To": null
        },
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": [
            "2024-08-02T17:00:00Z"
        ],
        "UpdatedIP": "118.69.109.163",
        "UpdatedEmployee": 1017,
        "UpdatedSource": "internal",
        "UpdatedDate": "2025-03-12T10:25:35.23Z"
    },
    {
        "DistrictID": 2018,
        "ProvinceID": 268,
        "DistrictName": "Huyện Tiên Lữ",
        "Code": "2206",
        "Type": 2,
        "SupportType": 3,
        "NameExtension": [
            "Huyện Tiên Lữ",
            "H.Tiên Lữ",
            "H Tiên Lữ",
            "Tiên Lữ",
            "Tien Lu",
            "Huyen Tien Lu",
            "tienlu"
        ],
        "IsEnable": 1,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:53:32.43275 +0700 +07 m=+0.016696212",
        "UpdatedAt": "2020-09-29 13:42:54.129436 +0700 +07 m=+26.631634622",
        "CanUpdateCOD": false,
        "Status": 1,
        "PickType": 0,
        "DeliverType": 0,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListDistrict": {
            "From": null,
            "To": null
        },
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": null,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:07:00.466Z"
    },
    {
        "DistrictID": 1828,
        "ProvinceID": 268,
        "DistrictName": "Huyện Yên Mỹ",
        "Code": "2205",
        "Type": 3,
        "SupportType": 3,
        "NameExtension": [
            "Huyện Yên Mỹ",
            "H.Yên Mỹ",
            "H Yên Mỹ",
            "Yên Mỹ",
            "Yen My",
            "Huyen Yen My",
            "yenmy"
        ],
        "IsEnable": 1,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:53:32.432356 +0700 +07 m=+0.016302308",
        "UpdatedAt": "2020-09-29 13:43:02.859302 +0700 +07 m=+35.361335248",
        "CanUpdateCOD": false,
        "Status": 1,
        "PickType": 0,
        "DeliverType": 0,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListDistrict": {
            "From": null,
            "To": null
        },
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": null,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:06:59.493Z"
    },
    {
        "DistrictID": 1827,
        "ProvinceID": 268,
        "DistrictName": "Thị xã Mỹ Hào",
        "Code": "2208",
        "Type": 3,
        "SupportType": 3,
        "NameExtension": [
            "Huyện Mỹ Hào",
            "H.Mỹ Hào",
            "H Mỹ Hào",
            "Mỹ Hào",
            "My Hao",
            "Huyen My Hao",
            "Thị Xã Mỹ Hào",
            "myhao",
            "Thị xã Mỹ Hào",
            "TX Mỹ Hào",
            "TX My Hao"
        ],
        "IsEnable": 1,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 15:53:32.432355 +0700 +07 m=+0.016300857",
        "UpdatedAt": "2020-09-29 13:43:02.918882 +0700 +07 m=+35.420913873",
        "CanUpdateCOD": false,
        "Status": 1,
        "PickType": 0,
        "DeliverType": 0,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListDistrict": {
            "From": null,
            "To": null
        },
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": null,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:07:00.488Z"
    }
]

const ward = [
    {
        "WardCode": "220714",
        "DistrictID": 2194,
        "WardName": "Xã Tống Trân",
        "NameExtension": [
            "Xã Tống Trân",
            "X.Tống Trân",
            "X Tống Trân",
            "Tống Trân",
            "Tong Tran",
            "Xa Tong Tran",
            "tongtran"
        ],
        "IsEnable": 1,
        "CanUpdateCOD": false,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 16:02:20.401924 +0700 +07 m=+0.038261250",
        "UpdatedAt": "2020-09-29 13:57:04.897512 +0700 +07 m=+449.555793810",
        "SupportType": 1,
        "PickType": 3,
        "DeliverType": 3,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListWard": {
            "From": null,
            "To": null
        },
        "Status": 1,
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": null,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:07:32.849Z"
    },
    {
        "WardCode": "220713",
        "DistrictID": 2194,
        "WardName": "Xã Tống Phan",
        "NameExtension": [
            "Xã Tống Phan",
            "X.Tống Phan",
            "X Tống Phan",
            "Tống Phan",
            "Tong Phan",
            "Xa Tong Phan",
            "tongphan"
        ],
        "IsEnable": 1,
        "CanUpdateCOD": false,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 16:02:20.401914 +0700 +07 m=+0.038251567",
        "UpdatedAt": "2020-09-29 13:57:04.939234 +0700 +07 m=+449.597514830",
        "SupportType": 3,
        "PickType": 3,
        "DeliverType": 3,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListWard": {
            "From": null,
            "To": null
        },
        "Status": 1,
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": null,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:07:25.251Z"
    },
    {
        "WardCode": "220712",
        "DistrictID": 2194,
        "WardName": "Xã Tiền Tiến",
        "NameExtension": [
            "Xã Tiền Tiến",
            "X.Tiền Tiến",
            "X Tiền Tiến",
            "Tiền Tiến",
            "Tien Tien",
            "Xa Tien Tien",
            "tientien"
        ],
        "IsEnable": 1,
        "CanUpdateCOD": false,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 16:02:20.401918 +0700 +07 m=+0.038255740",
        "UpdatedAt": "2020-09-29 13:57:04.983703 +0700 +07 m=+449.641983249",
        "SupportType": 3,
        "PickType": 3,
        "DeliverType": 3,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListWard": {
            "From": null,
            "To": null
        },
        "Status": 1,
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": null,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:07:31.84Z"
    },
    {
        "WardCode": "220711",
        "DistrictID": 2194,
        "WardName": "Xã Tam Đa",
        "NameExtension": [
            "Xã Tam Đa",
            "X.Tam Đa",
            "X Tam Đa",
            "Tam Đa",
            "Tam Da",
            "Xa Tam Da",
            "tamda"
        ],
        "IsEnable": 1,
        "CanUpdateCOD": false,
        "UpdatedBy": 1718600,
        "CreatedAt": "2019-12-05 16:02:20.40192 +0700 +07 m=+0.038257133",
        "UpdatedAt": "2020-09-29 13:57:05.029877 +0700 +07 m=+449.688155835",
        "SupportType": 3,
        "PickType": 3,
        "DeliverType": 3,
        "WhiteListClient": {
            "From": [],
            "To": [],
            "Return": []
        },
        "WhiteListWard": {
            "From": null,
            "To": null
        },
        "Status": 1,
        "ReasonCode": "",
        "ReasonMessage": "",
        "OnDates": null,
        "UpdatedEmployee": 8888,
        "UpdatedSource": "online--stream--master-data.RawData--UpdateMasterData",
        "UpdatedDate": "2025-03-05T11:07:20.54Z"
    }
]

const EditAddressScreen = () => {
    const router = useRouter()
    const { id } = useLocalSearchParams()
    console.log(id)
    const [address, setAddress] = React.useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        province: '',
        district: '',
        ward: '',
        street: '',
        default: false
    })

    const provinceOptions = useMemo(() => {
        return province.map(item => ({ label: item.ProvinceName, value: item.ProvinceID }))
    }, [province])
    const districtOptions = useMemo(() => {
        return district.map(item => ({ label: item.DistrictName, value: item.DistrictID }))
    }, [district])
    const wardOptions = useMemo(() => {
        return ward.map(item => ({ label: item.WardName, value: item.WardCode }))
    }, [ward])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <SimpleLineIcons name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chỉnh sửa địa chỉ</Text>
                <View />
            </View>

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
                            value={address.province}
                            onChange={(value) => {
                                setAddress(prev => ({ ...prev, province: value }))
                            }}
                            placeholder='Chọn tỉnh thành'
                            options={provinceOptions}
                            icon={<MaterialCommunityIcons name="map-marker-outline" size={24} />}
                        />
                    </View>

                    <View style={styles.pickerContainer}>
                        <Select
                            value={address.district}
                            onChange={(value) => {
                                setAddress(prev => ({ ...prev, district: value }))
                            }}
                            placeholder='Chọn quận/huyện'
                            options={districtOptions}
                            icon={<MaterialCommunityIcons name="map-marker-outline" size={24} />}
                        />
                    </View>

                    <View style={styles.pickerContainer}>
                        <Select
                            value={address.ward}
                            onChange={(value) => {
                                setAddress(prev => ({ ...prev, ward: value }))
                            }}
                            placeholder='Chọn phường/xã'
                            options={wardOptions}
                            icon={<MaterialCommunityIcons name="map-marker-outline" size={24} />}
                        />
                    </View>

                    <Input
                        placeholder="Địa chỉ cụ thể"
                        value={address.street}
                        onChangeText={(text) => setAddress(prev => ({ ...prev, street: text }))}
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
                            onPress={() => { }}
                            style={styles.saveButton}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    cancelButton: {
        borderColor: 'black',
        flex: 1,
        marginLeft: 8
    },
    cancelButtonText: {
        color: 'black'
    }
})

export default EditAddressScreen