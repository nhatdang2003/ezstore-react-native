import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { FONT } from '@/src/constants/font';
import {
    useFonts,
    Lora_400Regular,
    Lora_500Medium
} from '@expo-google-fonts/lora';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFilterStore } from '@/src/store/filterStore';
import { useCartStore } from '@/src/store/cartStore';
import { getUserCartInfo } from '@/src/services/user.service';

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const router = useRouter()
    const segments = useSegments()
    const { resetFilters } = useFilterStore()
    const [loaded, error] = useFonts({
        [FONT.LORA]: Lora_400Regular,
        [FONT.LORA_MEDIUM]: Lora_500Medium,
    });
    const setCartCount = useCartStore(state => state.setCartCount);

    useEffect(() => {
        if (loaded || error) {
            const checkUserLoggedIn = async () => {
                const access_token = await AsyncStorage.getItem('access_token')
                if (access_token) {
                    router.navigate('/(tabs)')
                } else {
                    router.navigate('/(auth)/login')
                }
            }
            checkUserLoggedIn()
            SplashScreen.hideAsync();
        }
    }, [loaded, error, router]);

    useEffect(() => {
        console.log(segments)
        if (segments[segments.length - 1] !== 'filter'
            && segments[segments.length - 1] !== 'store'
            && segments[segments.length - 1] !== '[id]'
        ) {
            resetFilters()
        }
    }, [segments, resetFilters])

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserCartInfo();
                setCartCount(userInfo.data.cartItemsCount);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        };

        fetchUserInfo();
    }, []);

    if (!loaded && !error) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/forget_password" options={{ headerShown: false }} />
                <Stack.Screen name="store/filter" options={{ title: 'Bộ lọc', headerTitleAlign: 'center', headerShown: true }} />
                <Stack.Screen name="account/details" options={{ title: 'Thông tin chi tiết', headerTitleAlign: 'center', headerShown: true }} />
                <Stack.Screen name="account/verify_update" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ headerShown: true }} />
                <Stack.Screen name="(search)/search" options={{ headerShown: false }} />
                <Stack.Screen name="(search)/result" options={{ headerShown: false }} />
            </Stack>
        </View>
    );
}
