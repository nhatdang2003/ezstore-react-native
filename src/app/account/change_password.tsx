import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { SimpleLineIcons } from '@expo/vector-icons'
import { COLOR } from '@/src/constants/color'
import CustomButton from '@/src/components/CustomButton'
import CloseKeyboard from '@/src/components/CloseKeyboard'
import { FONT } from '@/src/constants/font'
import Input from '@/src/components/Input'
import { changePassword } from '@/src/services/user.service'
import AlertDialog from '@/src/components/AlertModal'

const ChangePassword = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const validateForm = () => {
        let isValid = true
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
            isValid = false
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
            isValid = false
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự'
            isValid = false
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
            isValid = false
        } else if (formData.confirmPassword !== formData.newPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleChangePassword = async () => {
        if (validateForm()) {
            setIsLoading(true)
            try {
                const response = await changePassword({
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                })

                // @ts-ignore
                if (response.statusCode === 200) {
                    // Success - navigate back
                    router.back()
                } else {
                    // Handle error
                    setAlertMessage(response.message || 'Đổi mật khẩu thất bại')
                    setAlertVisible(true)
                }
            } catch (error: any) {
                setAlertMessage(error.message || 'Đổi mật khẩu thất bại')
                setAlertVisible(true)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <>
            <CloseKeyboard>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    <View style={styles.headerTab}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <SimpleLineIcons name="arrow-left" size={20} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
                        <View />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Đổi mật khẩu tài khoản</Text>
                        </View>

                        <Input
                            value={formData.currentPassword}
                            onChangeText={(text) => {
                                setFormData(prev => ({ ...prev, currentPassword: text }))
                                setErrors(prev => ({ ...prev, currentPassword: '' }))
                            }}
                            leftIcon={<MaterialCommunityIcons name="lock-outline" size={24} />}
                            placeholder="Mật khẩu hiện tại"
                            type="password"
                            error={errors.currentPassword}
                        />

                        <Input
                            value={formData.newPassword}
                            onChangeText={(text) => {
                                setFormData(prev => ({ ...prev, newPassword: text }))
                                setErrors(prev => ({ ...prev, newPassword: '' }))
                            }}
                            leftIcon={<MaterialCommunityIcons name="lock-outline" size={24} />}
                            placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                            type="password"
                            error={errors.newPassword}
                        />

                        <Input
                            value={formData.confirmPassword}
                            onChangeText={(text) => {
                                setFormData(prev => ({ ...prev, confirmPassword: text }))
                                setErrors(prev => ({ ...prev, confirmPassword: '' }))
                            }}
                            leftIcon={<MaterialCommunityIcons name="lock-outline" size={24} />}
                            placeholder="Xác nhận mật khẩu mới"
                            type="password"
                            error={errors.confirmPassword}
                        />

                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Đổi mật khẩu"
                                onPress={handleChangePassword}
                                style={styles.changeButton}
                                disabled={isLoading}
                            />
                            <CustomButton
                                title="Hủy"
                                variant="outlined"
                                onPress={() => router.back()}
                                style={styles.cancelButton}
                                textStyle={styles.cancelButtonText}
                            />
                        </View>
                    </View>
                </ScrollView>
            </CloseKeyboard>

            <AlertDialog
                visible={alertVisible}
                title="Lỗi"
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </>
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
    header: {
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontFamily: FONT.LORA_MEDIUM,
    },
    buttonContainer: {
        gap: 8,
        marginTop: 24,
    },
    changeButton: {
        backgroundColor: COLOR.PRIMARY,
    },
    cancelButton: {
        borderColor: COLOR.PRIMARY,
    },
    cancelButtonText: {
        color: COLOR.PRIMARY,
    }
})

export default ChangePassword
