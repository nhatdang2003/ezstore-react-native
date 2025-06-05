import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { COLOR } from '@/src/constants/color'

interface SocialButtonsProps {
    onGooglePress?: () => void;
}

const SocialButtons = ({
    onGooglePress,
}: SocialButtonsProps) => {
    return (
        <View style={styles.socialButtons}>
            <CustomButton
                title='Đăng nhập với Google'
                style={styles.socialButton}
                textStyle={styles.socialButtonText}
                variant='outlined'
                onPress={onGooglePress || (() => { })}
                leftIcon={
                    <Image
                        source={require('@/src/assets/images/google-logo.png')}
                        style={styles.socialIcon}
                    />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    socialButtons: {
        paddingHorizontal: 10
    },
    socialButton: {
        minHeight: 48,
    },
    socialButtonText: {
        color: '#666666',
        fontSize: 14,
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
})

export default SocialButtons