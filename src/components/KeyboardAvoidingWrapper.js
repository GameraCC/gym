import {background} from './colors'

import {useState} from 'react'

import {
    Platform,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'

const KeyboardAvoidingWrapper = props => {
    const handleOnPress = () => Keyboard.dismiss()
    const [shouldCauseRerender, setCauseRerender] = useState(false)

    Keyboard.addListener('keyboardWillHide', setCauseRerender)

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.wrapper}
            keyboardVerticalOffset={8}
            causeRerender={shouldCauseRerender}
        >
            <TouchableWithoutFeedback onPress={handleOnPress}>
                {props.children}
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: background,
        flex: 1
    }
})

export default KeyboardAvoidingWrapper
