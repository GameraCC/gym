import {useState} from 'react'
import {
    StyleSheet,
    Platform,
    Keyboard,
    Image,
    View,
    TextInput,
    Pressable,
    Text
} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {setFirstName, setLastName} from '@actions/user'
import {newAlert} from '@actions/alert'
import {useNavigation} from '@react-navigation/native'

import KeyboardAvoidingWrapper from '@shared/KeyboardAvoidingWrapper'

import Images from '@assets/images'
import {firstNameConstraint, lastNameConstraint} from '@lib/constraints'
import {background, black, white} from '@assets/colors'

const SignupNames = props => {
    const [isHighlighted, setHighlighted] = useState(false)

    // Underscores are used for consistency with database schema
    const first_name = useSelector(state => state.user.first_name)
    const last_name = useSelector(state => state.user.last_name)

    const dispatch = useDispatch()
    const changeFirstName = name => {
        // Capitalize first letter
        if (first_name.length === 0)
            name = name?.toUpperCase() ? name.toUpperCase() : name

        dispatch(setFirstName(name))
    }
    const changeLastName = name => {
        // Capitalize first letter
        if (last_name.length === 0)
            name = name?.toUpperCase() ? name.toUpperCase() : name

        dispatch(setLastName(name))
    }

    const navigation = useNavigation()

    const handleContinue = () => {
        if (!first_name)
            dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: 'First name required'
                })
            )

        if (!last_name)
            dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: 'Last name required'
                })
            )

        // Validate constraints on input, prompt error if constraints not met
        const firstNameConstraintCheck = firstNameConstraint(first_name)
        if (firstNameConstraintCheck !== true)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: firstNameConstraintCheck
                })
            )

        const lastNameConstraintCheck = lastNameConstraint(last_name)
        if (lastNameConstraintCheck !== true)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: lastNameConstraintCheck
                })
            )

        Keyboard.dismiss()
        navigation.navigate('signup-location')
    }

    return (
        <KeyboardAvoidingWrapper style={styles.signup}>
            <Image style={styles.logo} source={Images.ICON} />
            <View style={[styles.inputContainer, styles.namesInputContainer]}>
                <TextInput
                    style={[styles.input, styles.inputDivide]}
                    autocomplete="name-given"
                    keyboardType="default"
                    placeholder="First Name"
                    onChangeText={changeFirstName}
                    value={first_name}
                    autoCapitalize="words"
                    numberOfLines={1}
                ></TextInput>
                <TextInput
                    style={styles.input}
                    autocomplete="name-family"
                    keyboardType="default"
                    placeholder="Last Name"
                    onChangeText={changeLastName}
                    value={last_name}
                    autoCapitalize="words"
                    numberOfLines={1}
                ></TextInput>
            </View>
            <View
                style={[styles.buttonContainer, styles.singleButtonContainer]}
            >
                <Pressable
                    onPressIn={() => setHighlighted(true)}
                    onPressOut={() => setHighlighted(false)}
                    style={[styles.button, isHighlighted && styles.highlighted]}
                    android_disableSound={true}
                    onPress={handleContinue}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            isHighlighted && styles.highlighted
                        ]}
                    >
                        Continue
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingWrapper>
    )
}

const styles = StyleSheet.create({
    signup: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: background
    },
    logo: {
        width: 72,
        height: 72,
        marginTop: '40%'
    },
    input: {
        flex: 1,
        width: '100%',
        fontSize: 14,
        paddingLeft: 16,
        paddingRight: 16,
        textAlign: 'center',
        ...(Platform.OS === 'ios' ? {paddingVertical: 10} : {}) // Required on IOS to prevent textInput with numberOfLines={1} from wrapping. Ellipses are not added to the end with this solution
    },
    inputContainer: {
        width: '60%',
        marginTop: '10%',
        marginBottom: '10%',
        borderColor: black,
        borderWidth: 1,
        borderRadius: 7
    },
    inputDivide: {
        borderColor: black,
        borderBottomWidth: 1
    },
    namesInputContainer: {
        height: 96
    },
    buttonContainer: {
        width: '42.5%',
        height: 80,
        marginBottom: 256
    },
    button: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: black,
        borderColor: black,
        borderWidth: 1,
        borderRadius: 5
    },
    singleButtonContainer: {
        height: 40
    },
    buttonText: {
        fontFamily: 'Helvetica',
        color: white,
        fontSize: 16
    },
    highlighted: {
        color: black,
        backgroundColor: white
    }
})

export default SignupNames
