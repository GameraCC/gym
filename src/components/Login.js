import {StyleSheet, View, Text, TextInput, Pressable} from 'react-native'
import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {login} from '../actions/session'
import {setUsername, setPassword, resetUser} from '../actions/user'
import {usernameConstraint, passwordConstraint} from '../lib/constraints'
import {newAlert} from '../actions/alert'

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
        navigation.reset({
            index: 0,
            routes: [{name: 'signup-metadata'}]
        })
    }

    return (
        <View style={styles.login}>
            <View style={styles.title}>
                <Text>Gym</Text>
            </View>
            <TextInput
                style={styles.input}
                autoComplete="username"
                keyboardType="default"
                placeholder="Username"
                onChangeText={changeUsername}
                value={username}
            ></TextInput>
            <TextInput
                style={styles.input}
                autoComplete="password"
                keyboardType="default"
                placeholder="Password"
                onChangeText={changePassword}
                value={password}
            ></TextInput>
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
                <Text>Login</Text>
            </Pressable>
            <Text>OR</Text>
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
                <Text>Signup</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    login: {
        width: '100%',
        height: '100%',
        flexDirection: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        flex: 1
    },
    button: {
        width: '50%',
        height: '5%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#000'
    },
    highlighted: {
        backgroundColor: '#0091FF'
    }
})

export default Login
