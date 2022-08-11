import {
    StyleSheet,
    View,
    Button,
    Text,
    TextInput,
    Pressable
} from 'react-native'
import {useState} from 'react'
import {useSelector, useDispatch, shallowEqual} from 'react-redux'
import {login} from '../actions/session'

const Login = () => {
    const [isSignup, setIsSignup] = useState(true)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const error = useSelector(state => state.session.error)
    const session = useSelector(state => state.session.token)
    const dispatch = useDispatch()

    const handleAuth = () => {
        if (isSignup) false
        else dispatch(login(username, password))
    }

    console.log('session:', session)
    console.log('err:', error)

    return (
        <View style={styles.login}>
            <View style={styles.title}>
                <Text>Gym</Text>
            </View>
            {isSignup && (
                <TextInput
                    styles={styles.input}
                    autoComplete="email"
                    keyboardType="email-address"
                    placeholder="Email Address"
                    onChangeText={setEmail}
                    value={email}
                ></TextInput>
            )}
            <TextInput
                styles={styles.input}
                autoComplete="username"
                keyboardType="default"
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
            ></TextInput>
            <TextInput
                styles={styles.input}
                autoComplete={isSignup ? 'password-new' : 'password'}
                keyboardType="default"
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
            ></TextInput>
            <Pressable
                styles={styles.button}
                android_disableSound={true}
                onPress={() => handleAuth()}
            >
                <Text>{isSignup ? 'Sign up' : 'Login'}</Text>
            </Pressable>
            <Text>OR</Text>
            <Pressable
                styles={styles.button}
                android_disableSound={true}
                onPress={() => {
                    setUsername('')
                    setEmail('')
                    setPassword('')
                    setIsSignup(!isSignup)
                }}
            >
                <Text>{!isSignup ? 'Sign up' : 'Login'}</Text>
            </Pressable>
            <Text>{error}</Text>
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
        width: 100,
        height: 200,
        color: '#ffffff',
        backgroundColor: '#ffffff',
        flex: 1
    }
})

export default Login
