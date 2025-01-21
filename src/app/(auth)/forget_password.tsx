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
import { postRecoverPassword } from '@/src/services/auth.service'

const ForgetPasswordScreen = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async () => {
        if (!email) {
            setError('Vui lòng nhập email')
            return
        }

        if (!validateEmail(email)) {
            setError('Email không đúng định dạng')
            return
        }

        setIsLoading(true)
        try {
            const response = await postRecoverPassword({ email })
            // @ts-ignore
            if (response.statusCode === 200) {
                router.push({
                    pathname: '/(auth)/verify',
                    params: { email, type: 'forget_password' }
                })
            } else {
                setError('Có lỗi xảy ra, vui lòng thử lại')
            }
        } catch (error) {
            console.log(error)
            setError('Có lỗi xảy ra, vui lòng thử lại')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <CloseKeyboard>
            <View style={styles.container}>
                <View style={styles.content}>
                    <MaterialCommunityIcons
                        name="lock-reset"
                        size={100}
                        color={COLOR.PRIMARY}
                        style={styles.icon}
                    />

                    <Text style={styles.title}>Quên mật khẩu?</Text>
                    <Text style={styles.description}>
                        Vui lòng nhập email đã đăng ký để nhận mã xác thực
                    </Text>

                    <View style={styles.formContainer}>
                        <Input
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text)
                                setError('')
                            }}
                            placeholder="Email"
                            leftIcon={<MaterialCommunityIcons name="email-outline" size={24} />}
                            keyboardType="email-address"
                        />
                        <ErrorMessageInput message={error} />

                        <CustomButton
                            onPress={handleSubmit}
                            title="Gửi mã xác thực"
                            style={styles.submitButton}
                            disabled={isLoading}
                        />

                        <CustomButton
                            onPress={() => router.back()}
                            title="Quay lại đăng nhập"
                            variant="ghost"
                            textStyle={styles.backButtonText}
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
    },
    backButtonText: {
        color: COLOR.PRIMARY,
    }
})

export default ForgetPasswordScreen