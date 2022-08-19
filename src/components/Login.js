import {StyleSheet, View, Text, TextInput, Pressable} from 'react-native'
import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {login, setSessionError} from '../actions/session'

const Login = ({navigation}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const error = useSelector(state => state.session.error)
    const dispatch = useDispatch()

    const handleAuth = () => {
        dispatch(login(username, password))
    }

    const resetError = () => dispatch(setSessionError(''))

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
                onChangeText={setUsername}
                value={username}
            ></TextInput>
            <TextInput
                style={styles.input}
                autoComplete="password"
                keyboardType="default"
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
            ></TextInput>
            <Pressable
                style={styles.button}
                android_disableSound={true}
                onPress={() => handleAuth()}
            >
                <Text>Login</Text>
            </Pressable>
            <Text>OR</Text>
            <Pressable
                style={styles.button}
                android_disableSound={true}
                onPress={() => {
                    setUsername('')
                    setPassword('')
                    resetError()
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'signup-metadata'}]
                    })
                }}
            >
                <Text>Signup</Text>
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
