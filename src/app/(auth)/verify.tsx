import { View, Text, StyleSheet, Keyboard } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import OtpInput from '@/src/components/OtpInput'
import { COLOR } from '@/src/constants/color'
import CustomButton from '@/src/components/CustomButton'
import ErrorMessageInput from '@/src/components/ErrorMessageInput'
import { getActiveCode, postVerifyActivation, postVerifyRecoverPassword, postRecoverPassword } from '@/src/services/auth.service'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import LoadingOverlay from '@/src/components/LoadingOverlay'

const VerifyActivationScreen = () => {
    const { email } = useLocalSearchParams<{ email: string }>()
    const router = useRouter()
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { type } = useLocalSearchParams<{ type: string }>()

    const handleVerify = useCallback(async (code: string) => {
        if (code.length !== 6) return;

        setIsLoading(true);
        Keyboard.dismiss();

        try {
            const verifyResponse = type === 'forget_password'
                ? await postVerifyRecoverPassword({ email: email || '', resetCode: code })
                : await postVerifyActivation({ email: email || '', activationCode: code });

            // @ts-ignore
            if (verifyResponse.statusCode === 200) {
                if (type === 'forget_password') {
                    router.replace({
                        pathname: '/(auth)/reset_password',
                        params: { email: email || '', code: code }
                    });
                } else {
                    router.replace('/(tabs)');
                }
                return;
            }

            setError('Mã xác thực không đúng');
            setOtp('');
        } catch (error) {
            console.log(error);
            setError('Có lỗi xảy ra, vui lòng thử lại');
            setOtp('');
        } finally {
            setIsLoading(false);
        }
    }, [email, router, type]);

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = type === 'forget_password'
                ? await postRecoverPassword({ email: email || '' })
                : await getActiveCode({ email: email || '' });

            // @ts-ignore
            if (response.statusCode === 200) {
                setError('');
                setOtp('');
            } else {
                setError('Có lỗi xảy ra, vui lòng thử lại');
            }
        } catch (error) {
            console.log(error);
            setError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons
                    name="email-check-outline"
                    size={100}
                    color={COLOR.PRIMARY}
                    style={styles.icon}
                />

                <Text style={styles.title}>Xác thực tài khoản</Text>
                <Text style={styles.description}>
                    Vui lòng nhập mã xác thực đã được gửi đến email
                </Text>
                <Text style={styles.email}>{email}</Text>

                <View style={styles.otpContainer}>
                    <OtpInput
                        setValue={(value) => {
                            setError('')
                            setOtp(value)
                            handleVerify(value)
                        }}
                    />
                    <ErrorMessageInput message={error} />
                </View>

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Không nhận được mã? </Text>
                    <CustomButton
                        title="Gửi lại"
                        variant="ghost"
                        style={styles.resendButton}
                        textStyle={styles.resendButtonText}
                        onPress={handleResendCode}
                        disabled={isLoading}
                    />
                </View>
            </View>

            {isLoading && <LoadingOverlay />}
        </View>
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
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: COLOR.PRIMARY,
        fontWeight: '500',
        marginBottom: 30,
    },
    otpContainer: {
        width: '100%',
        marginBottom: 20,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resendText: {
        color: '#666',
        fontSize: 16,
    },
    resendButton: {
        minWidth: 0,
        paddingHorizontal: 0,
    },
    resendButtonText: {
        color: COLOR.PRIMARY,
        textDecorationLine: 'underline',
    },
})

export default VerifyActivationScreen