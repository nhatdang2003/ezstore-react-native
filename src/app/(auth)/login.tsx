import { View, Text, Image, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import Input from "@/src/components/Input";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomButton from "@/src/components/CustomButton";
import { COLOR } from "@/src/constants/color";
import Checkbox from "@/src/components/Checkbox";
import ErrorMessageInput from "@/src/components/ErrorMessageInput";
import { postLogin } from "@/src/services/auth.service";
import SocialButtons from "@/src/components/SocialButtons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connectWebSocket, refreshNotificationCount } from "@/src/services/websocket.service";

const LoginScreen = () => {
    const router = useRouter();
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);

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

    const handleLogin = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        console.log(input);
        try {
            const response = await postLogin({
                email: input.email,
                password: input.password
            });
            console.log(response);
            // @ts-ignore
            if (response.statusCode === 200) {
                await AsyncStorage.multiSet([
                    ['access_token', response.data.access_token || ''],
                    ['refresh_token', response.data.refresh_token || '']
                ]);
                // Initialize WebSocket connection
                await connectWebSocket();
                // Get initial notification count
                await refreshNotificationCount();
                router.replace('/(tabs)');
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

                <SocialButtons
                    onGooglePress={() => { }}
                />

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
        justifyContent: 'flex-end',
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
});

export default LoginScreen;
