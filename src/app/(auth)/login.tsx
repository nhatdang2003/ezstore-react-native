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
    })

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email là bắt buộc';
        }
        if (!emailRegex.test(email)) {
            return 'Email không đúng định dạng';
        }
        return '';
    }

    const validatePassword = (password: string) => {
        if (!password) {
            return 'Mật khẩu là bắt buộc';
        }
        return '';
    }

    const handleInputChange = (field: 'email' | 'password', value: string) => {
        setInput(prev => ({ ...prev, [field]: value }))
    }

    const isFormInput = useMemo(() => {
        return input.email.trim() !== '' &&
            input.password.trim() !== ''
    }, [input.email, input.password])

    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        const emailError = validateEmail(input.email);
        const passwordError = validatePassword(input.password);

        setErrors({
            email: emailError,
            password: passwordError
        });

        if (!emailError && !passwordError) {
            setIsLoading(true);
            try {
                const response = await postLogin({
                    email: input.email,
                    password: input.password
                });
                console.log(response)
                if (response.data) {
                    router.navigate('/(tabs)');
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        }
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
                        onChangeText={(text) => handleInputChange('email', text)}
                        placeholder="Email"
                        leftIcon={<MaterialCommunityIcons name="email-outline" size={24} />}
                        keyboardType="email-address"
                    />
                    <ErrorMessageInput message={errors.email} />
                </View>

                <View>
                    <Input
                        value={input.password}
                        onChangeText={(text) => handleInputChange('password', text)}
                        placeholder="Mật khẩu"
                        type="password"
                        leftIcon={<MaterialCommunityIcons name="lock-outline" size={24} />}
                    />
                    <ErrorMessageInput message={errors.password} />
                </View>

                <Checkbox
                    checked={input.remember}
                    onCheck={(checked) => setInput({ ...input, remember: checked })}
                    label="Ghi nhớ mật khẩu"
                />

                <CustomButton
                    onPress={handleLogin}
                    title="Đăng nhập"
                    style={styles.loginButton}
                    disabled={!isFormInput || isLoading}
                />

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>hoặc tiếp tục với</Text>
                    <View style={styles.divider} />
                </View>

                <SocialButtons
                    onGooglePress={() => { }}
                    onFacebookPress={() => { }}
                    onApplePress={() => { }}
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
            </View >
        </View >
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
});

export default LoginScreen;
