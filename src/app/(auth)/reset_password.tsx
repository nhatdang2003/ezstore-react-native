import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import Input from '@/src/components/Input'
import { COLOR } from '@/src/constants/color'
import CustomButton from '@/src/components/CustomButton'
import ErrorMessageInput from '@/src/components/ErrorMessageInput'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import LoadingOverlay from '@/src/components/LoadingOverlay'
import CloseKeyboard from '@/src/components/CloseKeyboard'
import { postResetPassword } from '@/src/services/auth.service'
import { useLocalSearchParams } from 'expo-router'

interface FormErrors {
    password?: string;
    confirmPassword?: string;
}

const ResetPasswordScreen = () => {
    const router = useRouter()
    const { email, code } = useLocalSearchParams<{ email: string, code: string }>()
    const [input, setInput] = useState({
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = () => {
        const newErrors: FormErrors = {}

        if (!input.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu mới'
        } else if (input.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        if (!input.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
        } else if (input.password !== input.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: string, value: string) => {
        setInput(prev => ({
            ...prev,
            [field]: value
        }))
        setErrors(prev => ({
            ...prev,
            [field]: undefined
        }))
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsLoading(true)
        try {
            const response = await postResetPassword({
                email: email || '',
                resetCode: code || '',
                newPassword: input.password,
                confirmPassword: input.confirmPassword
            })

            // @ts-ignore
            if (response.statusCode === 200) {
                router.replace('/(auth)/login')
            } else {
                setErrors({
                    password: 'Có lỗi xảy ra, vui lòng thử lại'
                })
            }
        } catch (error) {
            console.log(error)
            setErrors({
                password: 'Có lỗi xảy ra, vui lòng thử lại'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <CloseKeyboard>
            <View style={styles.container}>
                <View style={styles.content}>
                    <MaterialCommunityIcons
                        name="lock-check"
                        size={100}
                        color={COLOR.PRIMARY}
                        style={styles.icon}
                    />

                    <Text style={styles.title}>Đặt lại mật khẩu</Text>
                    <Text style={styles.description}>
                        Vui lòng nhập mật khẩu mới cho tài khoản của bạn
                    </Text>

                    <View style={styles.formContainer}>
                        <View>
                            <Input
                                value={input.password}
                                onChangeText={(text) => handleInputChange('password', text)}
                                placeholder="Mật khẩu mới"
                                type="password"
                                leftIcon={<MaterialCommunityIcons name="lock-outline" size={24} />}
                            />
                            <ErrorMessageInput message={errors.password} />
                        </View>

                        <View>
                            <Input
                                value={input.confirmPassword}
                                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                                placeholder="Xác nhận mật khẩu"
                                type="password"
                                leftIcon={<MaterialCommunityIcons name="lock-check-outline" size={24} />}
                            />
                            <ErrorMessageInput message={errors.confirmPassword} />
                        </View>

                        <CustomButton
                            onPress={handleSubmit}
                            title="Đặt lại mật khẩu"
                            style={styles.submitButton}
                            disabled={isLoading}
                        />
                    </View>
                </View>

                {isLoading && <LoadingOverlay />}
            </View>
        </CloseKeyboard>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    icon: {
        marginTop: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: COLOR.PRIMARY,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    formContainer: {
        width: '100%',
        gap: 10,
    },
    submitButton: {
        backgroundColor: COLOR.PRIMARY,
        marginTop: 10,
    }
})

export default ResetPasswordScreen