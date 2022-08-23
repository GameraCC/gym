import {background} from './colors'

import {
    Platform,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'

const KeyboardAvoidingWrapper = props => {
    const handleOnPress = () => Keyboard.dismiss()

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.wrapper}
            keyboardVerticalOffset={8}
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
