import { View, Text, Image, StyleSheet } from "react-native";
import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Input from "@/src/components/Input";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomButton from "@/src/components/CustomButton";
import { COLOR } from "@/src/constants/color";
import Checkbox from "@/src/components/Checkbox";
import ErrorMessageInput from "@/src/components/ErrorMessageInput";
import { postLogin, postGoogleLogin } from "@/src/services/auth.service";
import SocialButtons from "@/src/components/SocialButtons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    GoogleSignin,
    statusCodes,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
    const router = useRouter();
    const [input, setInput] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
            offlineAccess: true
        });
    }, []);

    const validateForm = () => {
        const emailError = !input.email.trim()
            ? 'Email là bắt buộc'
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
                ? 'Email không đúng định dạng'
                : '';

        const passwordError = !input.password.trim()
            ? 'Mật khẩu là bắt buộc'
            : '';

        setErrors({
            email: emailError,
            password: passwordError
        });

        return !emailError && !passwordError;
    };

    const handleSuccessfulLogin = async (token: string) => {
        await AsyncStorage.setItem('access_token', token);
        router.replace('/(tabs)');
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await postLogin({
                email: input.email,
                password: input.password
            });
            // @ts-ignore
            if (response.statusCode === 200) {
                await handleSuccessfulLogin(response.data.access_token);
            } else {
                setErrors(prev => ({
                    ...prev,
                    password: 'Email hoặc mật khẩu không đúng'
                }));
            }
        } catch (error) {
            console.log(error);
            setErrors(prev => ({
                ...prev,
                password: 'Có lỗi xảy ra, vui lòng thử lại'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            
            // Get server auth code
            const serverAuthCode = userInfo.data?.serverAuthCode;
            console.log('Server Auth Code:', serverAuthCode);
            
            if (serverAuthCode) {
                const response = await postGoogleLogin(serverAuthCode);
                // @ts-ignore
                if (response.statusCode === 200) {
                    await handleSuccessfulLogin(response.data.access_token);
                } else {
                    throw new Error('Login failed');
                }
            } else {
                throw new Error('No access token received');
            }
        } catch (error: any) {
            console.log('Google Sign-In Error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // Operation is in progress already
            } else {
                setErrors(prev => ({
                    ...prev,
                    password: 'Đăng nhập Google thất bại, vui lòng thử lại'
                }));
            }
        }
    };

    const handleForgotPassword = () => {
        router.navigate('/(auth)/forget_password')
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("@/src/assets/images/icon.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.formContainer}>
                <View>
                    <Input
                        value={input.email}
                        onChangeText={(text) => {
                            setInput(prev => ({ ...prev, email: text }));
                            setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        placeholder="Email"
                        leftIcon={<MaterialCommunityIcons name="email-outline" size={24} />}
                        keyboardType="email-address"
                    />
                    <ErrorMessageInput message={errors.email} />
                </View>

                <View>
                    <Input
                        value={input.password}
                        onChangeText={(text) => {
                            setInput(prev => ({ ...prev, password: text }));
                            setErrors(prev => ({ ...prev, password: '' }));
                        }}
                        placeholder="Mật khẩu"
                        type="password"
                        leftIcon={<MaterialCommunityIcons name="lock-outline" size={24} />}
                    />
                    <ErrorMessageInput message={errors.password} />
                </View>

                <View style={styles.forgotPasswordContainer}>
                    <Checkbox
                        checked={input.remember}
                        onCheck={(checked) => setInput({ ...input, remember: checked })}
                        label="Ghi nhớ mật khẩu"
                    />
                    <CustomButton
                        title="Quên mật khẩu?"
                        variant="ghost"
                        style={styles.forgotButton}
                        textStyle={styles.forgotButtonText}
                        onPress={handleForgotPassword}
                    />
                </View>

                <CustomButton
                    onPress={handleLogin}
                    title="Đăng nhập"
                    style={styles.loginButton}
                    disabled={isLoading}
                />

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>hoặc tiếp tục với</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.googleButtonContainer}>
                    <GoogleSigninButton
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Light}
                        onPress={handleGoogleSignIn}
                        disabled={isLoading}
                        style={styles.googleButton}
                    />
                </View>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                    <Text
                        style={styles.registerLink}
                        onPress={() => router.navigate("/(auth)/register")}
                    >
                        Đăng ký
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    logoContainer: {
        alignItems: "center",
        marginTop: 60,
    },
    logo: {
        width: 200,
        height: 200,
    },
    formContainer: {
        gap: 5,
    },
    loginButton: {
        backgroundColor: COLOR.PRIMARY,
        marginTop: 10,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    orText: {
        color: '#666',
        paddingHorizontal: 10,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    registerText: {
        color: "#666",
    },
    registerLink: {
        color: COLOR.PRIMARY,
        fontWeight: "600",
        textDecorationLine: "underline",
    },
    forgotPasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    forgotButton: {
        minWidth: 0,
        paddingHorizontal: 0,
    },
    forgotButtonText: {
        color: COLOR.PRIMARY,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    googleButtonContainer: {
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    googleButton: {
        width: '100%',
        height: 40,
        borderRadius: 8,
    },
});

export default LoginScreen;
