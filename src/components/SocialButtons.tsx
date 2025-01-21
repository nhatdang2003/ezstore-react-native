import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

interface SocialButtonsProps {
    onGooglePress?: () => void;
    onFacebookPress?: () => void;
    onApplePress?: () => void;
}

const SocialButtons = ({
    onGooglePress,
    onFacebookPress,
    onApplePress
}: SocialButtonsProps) => {
    return (
        <View style={styles.socialButtons}>
            <CustomButton
                style={styles.socialButton}
                variant='outlined'
                onPress={onGooglePress || (() => { })}
            >
                <Image
                    source={require('@/src/assets/images/google-logo.png')}
                    style={styles.socialIcon}
                />
            </CustomButton>
            <CustomButton
                style={styles.socialButton}
                variant='outlined'
                onPress={onFacebookPress || (() => { })}
            >
                <Image
                    source={require('@/src/assets/images/facebook-logo.png')}
                    style={styles.socialIcon}
                />
            </CustomButton>
            <CustomButton
                style={styles.socialButton}
                variant='outlined'
                onPress={onFacebookPress || (() => { })}
            >
                <Image
                    source={require('@/src/assets/images/apple-logo.png')}
                    style={styles.socialIcon}
                />
            </CustomButton>
        </View>
    )
}

const styles = StyleSheet.create({
    socialButtons: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
        paddingHorizontal: 10
    },
    socialButton: {
        flex: 1,
        minHeight: 48,
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
})

export default SocialButtons