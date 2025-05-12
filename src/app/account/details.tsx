import { View, StyleSheet, Text, ScrollView, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLOR } from '@/src/constants/color'
import CustomButton from '@/src/components/CustomButton'
import CloseKeyboard from '@/src/components/CloseKeyboard'
import { FONT } from '@/src/constants/font'
import Input from '@/src/components/Input'
import DatePicker from '@/src/components/Datepicker'
import { getUserInfo, updateUserInfo, sendOTP, updateAvatar } from '@/src/services/user.service'
import { GENDER } from '@/src/constants/profile'
import { format } from "date-fns";
import * as ImagePicker from 'expo-image-picker';
import { SimpleLineIcons } from '@expo/vector-icons'
const ProfileDetails = () => {
    const router = useRouter()
    const [userInfo, setUserInfo] = React.useState({
        email: '',
        firstName: '',
        lastName: '',
        birthDate: new Date(),
        gender: '',
        phoneNumber: '',
        avatar: ''
    })
    const [originalUserInfo, setOriginalUserInfo] = React.useState({
        email: '',
        firstName: '',
        lastName: '',
        birthDate: new Date(),
        gender: '',
        phoneNumber: '',
        avatar: ''
    })
    const [isEdit, setIsEdit] = React.useState(false)

    const fetchUserInfo = async () => {
        const response = await getUserInfo()
        // @ts-ignore
        if (response.statusCode === 200) {
            console.log(response.data)
            setUserInfo({
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                birthDate: response.data.birthDate
                    ? new Date(response.data.birthDate)
                    : new Date(),
                gender: response.data.gender,
                phoneNumber: response.data.phoneNumber,
                avatar: response.data.avatar
            })
            setOriginalUserInfo(response.data)
        } else {
            console.log(response)
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [])

    const handleUpdateUserInfo = async () => {
        console.log('test')
        if (originalUserInfo.email !== userInfo.email || originalUserInfo.phoneNumber !== userInfo.phoneNumber) {
            const response = await sendOTP(userInfo.email)
            console.log(response)
            // @ts-ignore
            if (response.statusCode === 200) {
                setIsEdit(false)
                router.push({
                    pathname: '/account/verify_update',
                    params: {
                        info: JSON.stringify(userInfo),
                        type: 'update'
                    }
                })
            } else {
                console.log(response)
            }
        } else {
            const response = await updateUserInfo(userInfo)
            // @ts-ignore
            if (response.statusCode === 200) {
                setIsEdit(false)
            } else {
                console.log(response)
            }
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            let base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
            // Create form data for upload
            const formData = new FormData();
            formData.append('file', base64Img);
            formData.append('upload_preset', process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);

            try {
                // Upload to Cloudinary
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                const data = await response.json();
                console.log(data)

                // Update user avatar in state and database
                if (data.secure_url) {
                    setUserInfo(prev => ({ ...prev, avatar: data.secure_url }));
                    const response = await updateAvatar({ avatar: data.secure_url })
                    // @ts-ignore
                    if (response.statusCode === 200) {
                        Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công');
                    } else {
                        console.log(response)
                        Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện');
                    }
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                Alert.alert('Lỗi', 'Không thể tải ảnh lên');
            }
        }
    };

    const Avatar = () => {
        return (
            <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <CloseKeyboard>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={styles.headerTab}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <SimpleLineIcons name="arrow-left" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Thông tin chi tiết</Text>
                    <View />
                </View>
                {isEdit ? (
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Chỉnh sửa thông tin tài khoản</Text>
                            </View>
                            <Avatar />
                            <Input
                                value={userInfo.email}
                                onChangeText={(text) => setUserInfo(prev => ({ ...prev, email: text }))}
                                leftIcon={<MaterialCommunityIcons name="email-outline" size={24} />}
                            />
                            <Input
                                value={userInfo.firstName}
                                onChangeText={(text) => setUserInfo(prev => ({ ...prev, firstName: text }))}
                                leftIcon={<MaterialCommunityIcons name="account-outline" size={24} />}
                            />
                            <Input
                                value={userInfo.lastName}
                                onChangeText={(text) => setUserInfo(prev => ({ ...prev, lastName: text }))}
                                leftIcon={<MaterialCommunityIcons name="account-outline" size={24} />}
                            />
                            <DatePicker
                                value={userInfo.birthDate}
                                onChange={(date) => setUserInfo(prev => ({ ...prev, birthDate: date }))}
                            />
                            <Input
                                value={userInfo.phoneNumber}
                                onChangeText={(text) => setUserInfo(prev => ({ ...prev, phoneNumber: text }))}
                                leftIcon={<MaterialCommunityIcons name="phone-outline" size={24} />}
                            />

                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    title="Cập nhật"
                                    onPress={handleUpdateUserInfo}
                                    style={styles.saveButton}
                                />
                                <CustomButton
                                    title="Hủy"
                                    variant="outlined"
                                    onPress={() => setIsEdit(false)}
                                    style={styles.cancelButton}
                                    textStyle={styles.cancelButtonText}
                                />
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Thông tin tài khoản</Text>
                            </View>
                            <Avatar />
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Email:</Text>
                                    <Text style={styles.infoValue}>{userInfo.email}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Name:</Text>
                                    <Text style={styles.infoValue}>{`${userInfo.firstName} ${userInfo.lastName}`}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Ngày sinh:</Text>
                                    <Text style={styles.infoValue}>{format(userInfo.birthDate, 'dd/MM/yyyy')}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Giới tính:</Text>
                                    <Text style={styles.infoValue}>{GENDER[userInfo.gender as keyof typeof GENDER]}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Số điện thoại:</Text>

                                    <Text style={styles.infoValue}>{userInfo.phoneNumber}</Text>

                                </View>

                                <View style={styles.buttonContainer}>
                                    <CustomButton
                                        title="Chỉnh sửa"
                                        onPress={() => setIsEdit(true)}
                                        style={styles.editButton}
                                    />
                                    <CustomButton
                                        title="Đổi mật khẩu"
                                        variant="outlined"
                                        onPress={() => router.push('/account/change_password')}
                                        style={styles.changePasswordButton}
                                        textStyle={{ color: COLOR.PRIMARY }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </CloseKeyboard>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    content: {
        padding: 16,
    },
    buttonContainer: {
        gap: 8,
        marginTop: 16,
    },
    editButton: {
        backgroundColor: COLOR.PRIMARY,
    },
    changePasswordButton: {
        borderColor: COLOR.PRIMARY,
    },
    header: {
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    infoContainer: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 16,
        marginRight: 8,
    },
    infoValue: {
        fontSize: 16,
    },
    saveButton: {
        flex: 1,
        backgroundColor: COLOR.PRIMARY,
    },
    cancelButton: {
        flex: 1,
        borderColor: COLOR.PRIMARY,
    },
    cancelButtonText: {
        color: COLOR.PRIMARY,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: COLOR.PRIMARY,
    },
})


export default ProfileDetails
