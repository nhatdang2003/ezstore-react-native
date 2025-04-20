import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useLayoutEffect } from "react";
import { View } from "react-native";
import { FONT } from "@/src/constants/font";
import {
    useFonts,
    Lora_400Regular,
    Lora_500Medium,
} from "@expo-google-fonts/lora";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFilterStore } from "@/src/store/filterStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const { resetFilters } = useFilterStore();
    const [loaded, error] = useFonts({
        [FONT.LORA]: Lora_400Regular,
        [FONT.LORA_MEDIUM]: Lora_500Medium,
    });

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const access_token = await AsyncStorage.getItem("access_token");
            if (access_token) {
                router.navigate("/(tabs)");
            } else {
                router.navigate("/(auth)/login");
            }
            await SplashScreen.hideAsync();
        };

        if (loaded || error) {
            checkUserLoggedIn();
        }
    }, [loaded, error, router]);

    useEffect(() => {
        console.log(segments);
        if (
            segments[segments.length - 1] !== "filter" &&
            segments[segments.length - 1] !== "store" &&
            segments[segments.length - 1] !== "[id]" &&
            segments[segments.length - 1] !== "result"
        ) {
            resetFilters();
        }
    }, [segments, resetFilters]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerTitleStyle: {
                        fontFamily: FONT.LORA_MEDIUM,
                    },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                <Stack.Screen
                    name="(auth)/forget_password"
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="store/filter" options={{ headerShown: false }} />
                <Stack.Screen name="account/details" options={{ headerShown: false }} />
                <Stack.Screen name="account/verify_update" options={{ headerShown: false }} />
                <Stack.Screen name="account/orders" options={{ headerShown: false }} />
                <Stack.Screen name="account/order_details" options={{ headerShown: false }} />
                <Stack.Screen name="account/add_address" options={{ headerShown: false }} />
                <Stack.Screen name="account/edit_address" options={{ headerShown: false }} />
                <Stack.Screen name="account/reviews" options={{ headerShown: false }} />
                <Stack.Screen name="account/list-review" options={{ headerShown: false }} />
                {/* <Stack.Screen name="account/notifications" options={{ headerShown: false }} /> */}
                <Stack.Screen name="account/order_statistics" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ headerShown: true }} />
                <Stack.Screen name="(search)/search" options={{ headerShown: false }} />
                <Stack.Screen name="(search)/result" options={{ headerShown: false }} />
                <Stack.Screen name="cart/checkout" options={{ headerShown: false }} />
                <Stack.Screen name="cart/choose_address" options={{ headerShown: false }} />
                <Stack.Screen name="payment/success" options={{ headerShown: false }} />
                <Stack.Screen name="payment/fail" options={{ headerShown: false }} />
                <Stack.Screen name="payment/payment" options={{ headerShown: false }} />
            </Stack>
        </View>
    );
}
