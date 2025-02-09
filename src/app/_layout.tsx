import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import CloseKeyboard from '@/src/components/CloseKeyboard';
import { View } from 'react-native';
import { FONT } from '@/src/constants/font';
import {
    useFonts,
    Lora_400Regular,
    Lora_500Medium
} from '@expo-google-fonts/lora';

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const router = useRouter()
    const [loaded, error] = useFonts({
        [FONT.LORA]: Lora_400Regular,
        [FONT.LORA_MEDIUM]: Lora_500Medium,
    });


    useEffect(() => {
        if (loaded || error) {
            // router.navigate('/(auth)/login')
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

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
