import { StyleSheet } from 'react-native'
import React from 'react'
import OTPTextView from 'react-native-otp-textinput';
import { COLOR } from '../constants/color';

const OtpInput = ({ setValue }: { setValue: (value: string) => void }) => {

    return (
        <OTPTextView
            autoFocus
            handleTextChange={(text) => setValue(text)}
            containerStyle={styles.textInputContainer}
            textInputStyle={styles.roundedTextInput}
            tintColor={'#000'}
            inputCount={6}
            inputCellLength={1}
        />
    )
}

const styles = StyleSheet.create({
    textInputContainer: {

    },
    roundedTextInput: {
        borderWidth: 1,
        borderColor: COLOR.BACKGROUND,
        borderBottomWidth: 1,
        borderRadius: 8,
        backgroundColor: COLOR.BACKGROUND
    }
})

export default OtpInput