import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { postGoogleLogin } from '@/src/services/auth.service';
import messaging from '@react-native-firebase/messaging';
import { sendTokenToServerAPI } from '@/src/services/fcm.service';

const LoginGoogleScreen = () => {
    const router = useRouter();

    useEffect(() => {
        const initGoogleSignIn = async () => {
            try {
                GoogleSignin.configure({
                    scopes: ['email', 'profile'],
                    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
                    offlineAccess: true,
                    forceCodeForRefreshToken: true,
                });

                await GoogleSignin.signOut();
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                
                // Get server auth code
                const serverAuthCode = userInfo.data?.serverAuthCode;
                console.log('Server Auth Code:', serverAuthCode);
                
                if (serverAuthCode) {
                    const response = await postGoogleLogin(serverAuthCode);
                    // @ts-ignore
                    if (response.statusCode === 200) {
                        await AsyncStorage.setItem('access_token', response.data.access_token);
                        
                        // Get FCM token after successful Google login
                        try {
                            const fcmToken = await messaging().getToken();
                            if (fcmToken) {
                                await AsyncStorage.setItem('fcmToken', fcmToken);
                                await sendTokenToServerAPI(fcmToken);
                            }
                        } catch (error) {
                            console.error('Error getting FCM token after Google login:', error);
                        }
                        
                        router.replace('/(tabs)');
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
                    router.back();
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    // Operation is in progress already
                } else {
                    router.back();
                }
            }
        };

        initGoogleSignIn();
    }, []);

    return (
        <View style={styles.container}>
            {/* This screen will be briefly shown while Google Sign-In is processing */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default LoginGoogleScreen;
