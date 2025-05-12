import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { router, useRouter } from "expo-router";
import Input from "@/src/components/Input";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomButton from "@/src/components/CustomButton";
import { COLOR } from "@/src/constants/color";
import ErrorMessageInput from "@/src/components/ErrorMessageInput";
import DatePicker from "@/src/components/Datepicker";
import Select from "@/src/components/Select";
import CloseKeyboard from "@/src/components/CloseKeyboard";
import SocialButtons from "@/src/components/SocialButtons";
import { getActiveCode, postRegister } from "@/src/services/auth.service";
import { Gender } from "@/src/types/auth.type";

const RegisterScreen = () => {
    const router = useRouter();
    const [input, setInput] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        birthDate: new Date(),
        gender: "",
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const genderOptions = [
        { label: 'Nam', value: 'male' },
        { label: 'Nữ', value: 'female' },
        { label: 'Khác', value: 'other' },
    ];

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
        if (password.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        return '';
    }

    const handleInputChange = (field: keyof typeof input, value: any) => {
        setInput(prev => ({ ...prev, [field]: value }));
    }

    const validateForm = () => {
        const emailError = validateEmail(input.email);
        const passwordError = validatePassword(input.password);
        const firstNameError = !input.firstName.trim() ? 'Họ là bắt buộc' : '';
        const lastNameError = !input.lastName.trim() ? 'Tên là bắt buộc' : '';
        const genderError = !input.gender ? 'Giới tính là bắt buộc' : '';

        setErrors({
            email: emailError,
            password: passwordError,
            firstName: firstNameError,
            lastName: lastNameError,
            gender: genderError,
        });

        return !emailError && !passwordError && !firstNameError && !lastNameError && !genderError;
    };

    const handleRegister = async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await postRegister({
                    email: input.email,
                    password: input.password,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    birthDate: input.birthDate,
                    gender: input.gender as Gender,
                });

                // @ts-ignore
                if (response.statusCode === 201) {
                    router.push({
                        pathname: '/(auth)/verify',
                        params: { email: input.email }
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <CloseKeyboard>
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

                        <View style={styles.nameContainer}>
                            <View style={styles.nameField}>
                                <Input
                                    value={input.lastName}
                                    onChangeText={(text) => {
                                        setInput(prev => ({ ...prev, lastName: text }));
                                        setErrors(prev => ({ ...prev, lastName: '' }));
                                    }}
                                    placeholder="Họ"
                                    leftIcon={<MaterialCommunityIcons name="account-outline" size={24} />}
                                />
                                <ErrorMessageInput message={errors.lastName} />
                            </View>

                            <View style={styles.nameField}>
                                <Input
                                    value={input.firstName}
                                    onChangeText={(text) => {
                                        setInput(prev => ({ ...prev, firstName: text }));
                                        setErrors(prev => ({ ...prev, firstName: '' }));
                                    }}
                                    placeholder="Tên"
                                    leftIcon={<MaterialCommunityIcons name="account-outline" size={24} />}
                                />
                                <ErrorMessageInput message={errors.firstName} />
                            </View>
                        </View>

                        <DatePicker
                            value={input.birthDate}
                            onChange={(date) => {
                                setInput(prev => ({ ...prev, birthDate: date }));
                                setErrors(prev => ({ ...prev, birthDate: '' }));
                            }}
                            placeholder="Ngày sinh"
                        />

                        <Select
                            value={input.gender}
                            onChange={(value) => {
                                setInput(prev => ({ ...prev, gender: value }));
                                setErrors(prev => ({ ...prev, gender: '' }));
                            }}
                            options={genderOptions}
                            placeholder="Giới tính"
                            icon={<MaterialCommunityIcons name="gender-male-female" size={24} />}
                        />
                        <ErrorMessageInput message={errors.gender} />

                        <CustomButton
                            onPress={handleRegister}
                            title="Đăng ký"
                            style={styles.registerButton}
                            disabled={isLoading}
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Đã có tài khoản? </Text>
                            <Text
                                style={styles.loginLink}
                                onPress={() => router.navigate("/(auth)/login")}
                            >
                                Đăng nhập
                            </Text>
                        </View>

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
                    </View>
                </View>
            </CloseKeyboard>
        </ScrollView>
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
    },
    logo: {
        width: 200,
        height: 200,
    },
    formContainer: {
        gap: 5,
    },
    nameContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    nameField: {
        flex: 1,
    },
    registerButton: {
        backgroundColor: COLOR.PRIMARY,
        marginTop: 10,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loginText: {
        color: "#666",
    },
    loginLink: {
        color: COLOR.PRIMARY,
        fontWeight: "600",
        textDecorationLine: "underline",
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
});

export default RegisterScreen;