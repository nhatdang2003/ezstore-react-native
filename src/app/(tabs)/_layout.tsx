import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR } from '@/src/constants/color';
export default function TabLayout() {

    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: COLOR.PRIMARY,
            tabBarButton: (props) => (
                <TouchableOpacity {...(props as TouchableOpacityProps)} activeOpacity={1} />
            ),
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Trang chủ',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="category"
                options={{
                    title: 'Danh mục',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="menu" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="store"
                options={{
                    title: 'Cửa hàng',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="shopping-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Giỏ hàng',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cart-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Tài khoản',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
