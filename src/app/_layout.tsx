import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useLayoutEffect } from "react";
import { Alert, PermissionsAndroid, Platform, View } from "react-native";
import { FONT } from "@/src/constants/font";
import {
    useFonts,
    Lora_400Regular,
    Lora_500Medium,
} from "@expo-google-fonts/lora";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFilterStore } from "@/src/store/filterStore";
import { connectWebSocket } from "@/src/services/websocket.service";
import { refreshNotificationCount } from "@/src/services/websocket.service";
import messaging from '@react-native-firebase/messaging';
import { sendTokenToServerAPI } from "@/src/services/fcm.service";
import { markReadNotification } from "@/src/services/notification.service";

// Hàm yêu cầu quyền thông báo
async function requestUserPermission() {
    if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Quyền thông báo trên iOS đã được cấp!');
        } else {
            console.log('Người dùng iOS đã từ chối quyền thông báo.');
        }
    } else if (Platform.OS === 'android') {
        try {
            if (Platform.Version >= 33) { // Android 13+ (API 33)
                const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                if (res === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Quyền thông báo trên Android 13+ đã được cấp!');
                } else {
                    console.log('Người dùng Android 13+ đã từ chối quyền thông báo.');
                }
            } else { // Android < 13
                const authStatus = await messaging().requestPermission(); // Mặc dù thường được cấp sẵn, gọi để đồng bộ
                if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                    console.log('Quyền thông báo trên Android < 13 đã được cấp.');
                } else {
                    console.log('Không thể xin quyền thông báo trên Android < 13.');
                }
            }
        } catch (err) {
            console.warn('Lỗi khi yêu cầu quyền thông báo trên Android:', err);
        }
    }
}

// Hàm lấy FCM token
async function getFCMToken() {
    try {
        const token = await messaging().getToken();
        if (token) {
            console.log('FCM Token mới:', token);
            await AsyncStorage.setItem('fcmToken', token); // Lưu token mới
            await sendTokenToServerAPI(token);
            return token;
        } else {
            console.log('Không thể lấy FCM token.');
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi lấy FCM token:', error);
        return null;
    }
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const { resetFilters } = useFilterStore();
    const [loaded, error] = useFonts({
        [FONT.LORA]: Lora_400Regular,
        [FONT.LORA_MEDIUM]: Lora_500Medium,
    });

    // Request notification permission at app startup
    useEffect(() => {
        requestUserPermission();
    }, []);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const access_token = await AsyncStorage.getItem("access_token");
            if (access_token) {
                // Initialize WebSocket connection
                await connectWebSocket();
                // Get initial notification count
                await refreshNotificationCount();
                // Get FCM token if user is logged in
                await getFCMToken();
                router.replace("/(tabs)");
            } else {
                router.replace("/(auth)/login");
            }
            await SplashScreen.hideAsync();
        };

        if (loaded || error) {
            checkUserLoggedIn();
        }
    }, [loaded, error, router]);

    // Lắng nghe sự kiện token được làm mới
    useEffect(() => {
        const unsubscribeTokenRefresh = messaging().onTokenRefresh(async newToken => {
            console.log('FCM Token được làm mới:', newToken);
            await AsyncStorage.setItem('fcmToken', newToken);
            await sendTokenToServerAPI(newToken);
        });
        return unsubscribeTokenRefresh;
    }, []);

    // Xử lý khi người dùng nhấn vào thông báo lúc ứng dụng đang ở background hoặc bị tắt
    useEffect(() => {
        // Xử lý khi app mở từ trạng thái background
        messaging().onNotificationOpenedApp(async remoteMessage => {
            console.log(
                'Thông báo mở app từ background:',
                JSON.stringify(remoteMessage),
            );
            if (remoteMessage && remoteMessage.data) {
                const { navigateTo, orderId, notificationId } = remoteMessage.data;

                if (navigateTo === 'order_details' && orderId) {
                    router.push(`/account/order_details?orderId=${orderId}`);
                    markReadNotification(Number(notificationId));
                    await AsyncStorage.setItem('last_handled_notification', notificationId as string);
                }
            }
        });

        // Xử lý khi app mở từ trạng thái bị tắt (quit/killed)
        messaging()
            .getInitialNotification()
            .then(async remoteMessage => {
                if (remoteMessage && remoteMessage.data) {
                    console.log(
                        'Thông báo mở app từ quit state:',
                        JSON.stringify(remoteMessage),
                    );
                    const { navigateTo, orderId, notificationId } = remoteMessage.data;

                    const lastHandledNotification = await AsyncStorage.getItem('last_handled_notification');
                    if (lastHandledNotification === notificationId) {
                        return;
                    }

                    if (navigateTo === 'order_details' && orderId) {
                        setTimeout(() => {
                            router.push(`/account/order_details?orderId=${orderId}`);
                            markReadNotification(Number(notificationId));
                        }, 1000);
                    }
                }
            });
    }, [router]);

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
                <Stack.Screen name="account/change_password" options={{ headerShown: false }} />
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
                <Stack.Screen name="notification/promo_campaign" options={{ headerShown: false }} />
            </Stack>
        </View>
    );
}
