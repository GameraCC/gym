import {useState} from 'react'
import {
    StyleSheet,
    Platform,
    Keyboard,
    Image,
    View,
    Text,
    TextInput,
    Pressable
} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {setUsername, setPassword, setEmail, resetUser} from '@actions/user'
import {newAlert} from '@actions/alert'
import {useNavigation} from '@react-navigation/native'

import KeyboardAvoidingWrapper from '@shared/KeyboardAvoidingWrapper'

import Images from '@assets/images'
import {background, black, white} from '@assets/colors'
import {
    usernameConstraint,
    emailConstraint,
    passwordConstraint
} from '@lib/constraints'

const SignupMetadata = props => {
    const [isContinueHighlighted, setContinueHighlighted] = useState(false)
    const [isLoginHighlighted, setLoginHighlighted] = useState(false)

    const email = useSelector(state => state.user.email)
    const username = useSelector(state => state.user.username)
    const password = useSelector(state => state.user.password)

    const dispatch = useDispatch()
    const changeEmail = email => {
        dispatch(setEmail(email))
    }
    const changeUsername = username => {
        dispatch(setUsername(username))
    }
    const changePassword = password => {
        dispatch(setPassword(password))
    }
    const resetUserInfo = () => dispatch(resetUser())

    const navigation = useNavigation()

    const handleContinue = () => {
        // Validate constraints on input, prompt error if constraints not met
        if (!email)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: 'Email required'
                })
            )
        if (!username)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: 'Username required'
                })
            )
        if (!password)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: 'Password required'
                })
            )

        const emailConstraintCheck = emailConstraint(email)
        if (emailConstraintCheck !== true)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: emailConstraintCheck
                })
            )

        const usernameConstraintCheck = usernameConstraint(username)
        if (usernameConstraintCheck !== true)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: usernameConstraintCheck
                })
            )

        const passwordConstraintCheck = passwordConstraint(password)
        if (passwordConstraintCheck !== true)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Signup Error',
                    message: passwordConstraintCheck
                })
            )

        Keyboard.dismiss()
        navigation.navigate('signup-names')
    }
    const handleLogin = () => {
        resetUserInfo()
        Keyboard.dismiss()
        navigation.reset({
            index: 0,
            routes: [{name: 'login'}]
        })
    }

    return (
        <KeyboardAvoidingWrapper style={styles.signup}>
            <Image style={styles.logo} source={Images.ICON} />
            <View
                style={[styles.inputContainer, styles.metadataInputContainer]}
            >
                <TextInput
                    style={[styles.input, styles.inputDivide]}
                    title="Email"
                    autoComplete="email"
                    keyboardType="email-address"
                    placeholder="Email Address"
                    onChangeText={changeEmail}
                    value={email}
                    autoCapitalize="none"
                    numberOfLines={1}
                ></TextInput>
                <TextInput
                    style={[styles.input, styles.inputDivide]}
                    autoComplete="username"
                    keyboardType="default"
                    placeholder="Username"
                    onChangeText={changeUsername}
                    value={username}
                    autoCapitalize="none"
                    numberOfLines={1}
                ></TextInput>
                <TextInput
                    style={styles.input}
                    autoComplete="password-new"
                    keyboardType="default"
                    placeholder="Password"
                    onChangeText={changePassword}
                    value={password}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    numberOfLines={1}
                ></TextInput>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                    onPressIn={() => setContinueHighlighted(true)}
                    onPressOut={() => setContinueHighlighted(false)}
                    style={[
                        styles.button,
                        styles.buttonDivide,
                        isContinueHighlighted && styles.highlighted
                    ]}
                    android_disableSound={true}
                    onPress={handleContinue}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            isContinueHighlighted && styles.highlighted
                        ]}
                    >
                        Continue
                    </Text>
                </Pressable>
                <Pressable
                    onPressIn={() => setLoginHighlighted(true)}
                    onPressOut={() => setLoginHighlighted(false)}
                    style={[
                        styles.button,
                        isLoginHighlighted && styles.highlighted
                    ]}
                    android_disableSound={true}
                    onPress={handleLogin}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            isLoginHighlighted && styles.highlighted
                        ]}
                    >
                        Login
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
    inputDivide: {
        borderColor: black,
        borderBottomWidth: 1
    },
    inputContainer: {
        width: '60%',
        marginTop: '10%',
        marginBottom: '10%',
        borderColor: black,
        borderWidth: 1,
        borderRadius: 7
    },
    metadataInputContainer: {
        height: 144 // 48 dp per item
    },
    buttonContainer: {
        width: '42.5%',
        height: 80,
        marginBottom: 256
    },
    singleButtonContainer: {
        height: 40
    },
    buttonDivide: {
        marginBottom: 4
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

export default SignupMetadata
