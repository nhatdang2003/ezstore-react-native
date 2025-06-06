import { View, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLOR } from '@/src/constants/color'
import { FONT } from '@/src/constants/font'
import CustomButton from '@/src/components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { deleteTokenFromServerAPI } from '@/src/services/fcm.service'

const AccountTab = () => {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const fcmToken = await AsyncStorage.getItem('fcmToken');

            if (fcmToken) {
                await deleteTokenFromServerAPI(fcmToken);
            }
        } catch (error) {
            console.error("Lỗi khi xóa FCM token lúc đăng xuất:", error);
        } finally {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
            await AsyncStorage.removeItem('fcmToken');
            router.replace('/(auth)/login');
        }
    };

    const MenuButton = ({ icon, title, onPress }: { icon: string, title: string, onPress: () => void }) => (
        <CustomButton
            onPress={onPress}
            variant="ghost"
            style={styles.menuItem}
            leftIcon={<MaterialCommunityIcons name={icon as any} size={24} color={COLOR.TEXT} />}
            rightIcon={<MaterialCommunityIcons name="chevron-right" size={24} color={COLOR.TEXT} />}
            title={title}
            textStyle={styles.menuText}
        />
    )

    return (
        <ScrollView style={styles.container}>
            {/* Activity Section */}
            <View style={styles.section}>
                <MenuButton
                    icon="account-details"
                    title="Chi tiết"
                    onPress={() => router.push('/account/details')}
                />
                <MenuButton icon="shopping" title="Đơn hàng"
                    onPress={() => { router.push('/account/orders') }} />
                <MenuButton icon="star" title="Địa chỉ" onPress={() => { router.push('/account/address') }} />
                <MenuButton icon="chart-bar" title="Thống kê" onPress={() => { router.push('/account/order_statistics') }} />
            </View>


            {/* Community Section */}
            <View style={styles.section}>
                <MenuButton
                    icon="account-group"
                    title="Community influencer program"
                    onPress={() => { }}
                />

            </View>

            {/* Support Section */}
            <View style={styles.section}>
                <MenuButton icon="frequently-asked-questions" title="FAQ" onPress={() => { }} />
                <MenuButton icon="chat" title="Chat with us" onPress={() => { }} />
                <MenuButton icon="shield-check" title="Privacy policy" onPress={() => { }} />
                <MenuButton icon="information" title="About us" onPress={() => { }} />

            </View>

            {/* Settings Section */}
            <View style={styles.section}>
                <MenuButton icon="earth" title="Location & Language" onPress={() => { }} />
            </View>

            <CustomButton
                onPress={handleLogout}
                title="Log out"
                variant="ghost"
                style={styles.logoutButton}
                textStyle={styles.logoutText}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
    },
    section: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    menuItem: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: COLOR.BACKGROUND,
    },
    menuText: {
        flex: 1,
        textAlign: 'left',
        marginLeft: 16,
        fontSize: 16,
        fontFamily: FONT.LORA,
        color: COLOR.TEXT,
    },
    logoutButton: {
        margin: 16,
        backgroundColor: '#fff',
    },
    logoutText: {
        color: COLOR.RED,
        fontSize: 16,
        fontFamily: FONT.LORA_MEDIUM,
    },
})

export default AccountTab