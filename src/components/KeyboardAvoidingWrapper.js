import {Platform, View, KeyboardAvoidingView} from 'react-native'

const KeyboardAvoidingWrapper = props => {
    const {children, ...otherProps} = props
    return Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={8}
            {...otherProps}
        >
            {children}
        </KeyboardAvoidingView>
    ) : (
        // Android already implements keyboard avoiding view behavior well enough
        <View {...otherProps}>{children}</View>
    )
}

export default KeyboardAvoidingWrapper
