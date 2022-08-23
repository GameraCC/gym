import {Platform, KeyboardAvoidingView} from 'react-native'

const KeyboardAvoidingWrapper = props => {
    const {children, ...otherProps} = props
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={8}
            {...otherProps}
        >
            {children}
        </KeyboardAvoidingView>
    )
}

export default KeyboardAvoidingWrapper
