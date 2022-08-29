import {
    Platform,
    Keyboard,
    StyleSheet,
    Image,
    View,
    Text,
    TextInput,
    Pressable
} from 'react-native'
import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {login} from '../actions/session'
import {setUsername, setPassword, resetUser} from '../actions/user'
import {usernameConstraint, passwordConstraint} from '../lib/constraints'
import {newAlert} from '../actions/alert'
import {background, white, black} from './colors'
import KeyboardAvoidingWrapper from './KeyboardAvoidingWrapper'

const Login = ({navigation}) => {
    const [isSignupHighlighted, setSignupHighlighted] = useState(false)
    const [isLoginHighlighted, setLoginHighlighted] = useState(false)

    const username = useSelector(state => state.user.username)
    const password = useSelector(state => state.user.password)

    const dispatch = useDispatch()
    const changeUsername = username => dispatch(setUsername(username))
    const changePassword = password => dispatch(setPassword(password))
    const resetUserInfo = () => dispatch(resetUser())

    const handleLogin = () => {
        // Validate constraints on input, prompt error if constraints not met
        if (!username)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Login Error',
                    message: 'Username required'
                })
            )
        if (!password)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Login Error',
                    message: 'Password required'
                })
            )

        const usernameConstraintCheck = usernameConstraint(username)
        if (usernameConstraintCheck !== true)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Login Error',
                    message: usernameConstraintCheck
                })
            )

        const passwordConstraintCheck = passwordConstraint(password)
        if (passwordConstraintCheck !== true)
            return dispatch(
                newAlert({
                    kind: 'error',
                    title: 'Login Error',
                    message: passwordConstraintCheck
                })
            )

        dispatch(login({username, password}))
    }
    const handleSignup = () => {
        resetUserInfo()
        Keyboard.dismiss()
        navigation.reset({
            index: 0,
            routes: [{name: 'signup-metadata'}]
        })
    }

    return (
        <KeyboardAvoidingWrapper style={styles.login}>
            <Image style={styles.logo} source={require('../assets/icon.png')} />
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, styles.inputDivide]}
                    autoComplete="username"
                    keyboardType="default"
                    placeholder="Username"
                    onChangeText={changeUsername}
                    value={username}
                    autoCapitalize="none"
                    multiline={false}
                    numberOfLines={1}
                ></TextInput>
                <TextInput
                    style={styles.input}
                    autoComplete="password"
                    keyboardType="default"
                    placeholder="Password"
                    onChangeText={changePassword}
                    secureTextEntry={true}
                    value={password}
                    autoCapitalize="none"
                    numberOfLines={1}
                ></TextInput>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                    onPressIn={() => setLoginHighlighted(true)}
                    onPressOut={() => setLoginHighlighted(false)}
                    style={[
                        styles.button,
                        styles.buttonDivide,
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
                <Pressable
                    onPressIn={() => setSignupHighlighted(true)}
                    onPressOut={() => setSignupHighlighted(false)}
                    style={[
                        styles.button,
                        isSignupHighlighted && styles.highlighted
                    ]}
                    android_disableSound={true}
                    onPress={handleSignup}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            isSignupHighlighted && styles.highlighted
                        ]}
                    >
                        Signup
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingWrapper>
    )
}

const styles = StyleSheet.create({
    login: {
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
        height: 96,
        marginTop: '10%',
        marginBottom: '10%',
        borderColor: black,
        borderWidth: 1,
        borderRadius: 7
    },
    buttonContainer: {
        width: '42.5%',
        height: 80,
        marginBottom: 256
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
        fontFamily: 'Helvetica-Bold',
        color: white,
        fontSize: 16
    },
    highlighted: {
        color: black,
        backgroundColor: white
    }
})

export default Login
