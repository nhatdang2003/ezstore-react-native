import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import CloseKeyboard from '@/src/components/CloseKeyboard';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const router = useRouter()

    useEffect(() => {
        router.navigate('/(auth)/login')
        SplashScreen.hideAsync()
    }, [])

    return (
        <CloseKeyboard>
            <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)/login" />
                    <Stack.Screen name="(auth)/register" />
                    <Stack.Screen name="(auth)/forget_password" />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </View>
        </CloseKeyboard>
    );
}
