import { TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { ReactNode } from 'react'

const CloseKeyboard = ({ children }: { children: ReactNode }) => {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {children}
        </TouchableWithoutFeedback>
    )
}

export default CloseKeyboard