import { TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'

const CloseKeyboard = ({ children }: { children: ReactNode }) => {

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <>
            {isKeyboardVisible ? (
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    {children}
                </TouchableWithoutFeedback>
            ) : (
                children
            )}
        </>
    )
}

export default CloseKeyboard