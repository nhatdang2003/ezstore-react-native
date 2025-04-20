import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR } from '@/src/constants/color';
import { useCartStore } from '@/src/store/cartStore';
import { useNotificationStore } from '@/src/store/notificationStore';
import { FONT } from '@/src/constants/font';

export default function TabLayout() {
    const router = useRouter()
    const cartCount = useCartStore(state => state.cartCount);
    const unreadCount = useNotificationStore(state => state.unreadCount);

    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: COLOR.PRIMARY,
            tabBarButton: (props) => (
                <TouchableOpacity {...(props as TouchableOpacityProps)} activeOpacity={1} />
            ),
            headerTitleStyle: {
                fontFamily: FONT.LORA_MEDIUM
            },
            headerRight: () => (
                <View style={{ marginRight: 10 }}>
                    <TouchableOpacity onPress={() => router.push('/(search)/search')}>
                        <MaterialCommunityIcons name="magnify" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Trang chủ',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "home" : "home-outline"} color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="category"
                options={{
                    title: 'Danh mục',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name={"menu"} color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="store"
                options={{
                    title: 'Cửa hàng',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "store" : "store-outline"} color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Giỏ hàng',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View>
                            <MaterialCommunityIcons
                                name={focused ? "cart" : "cart-outline"}
                                color={color}
                                size={size}
                            />
                            {cartCount > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>
                                        {cartCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Thông báo',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View>
                            <MaterialCommunityIcons
                                name={focused ? "bell" : "bell-outline"}
                                color={color}
                                size={size}
                            />
                            {unreadCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationBadgeText}>
                                        {unreadCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Tài khoản',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "account" : "account-outline"} color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    cartBadge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: '#FF424E',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    notificationBadge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: '#FF424E',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
