import {useState} from 'react'
import {StyleSheet, View, Text, TextInput, Pressable} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {setSessionError} from '../actions/session'
import SearchableInputDropdown from './SearchableInputDropdown'

const SignupLocation = () => {
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')

    const data = [
        {name: 'Canada'},
        {name: 'United States'},
        {name: 'Mexico'},
        {name: 'Greenland'},
        {name: 'Iceland'},
        {name: 'United Kingdom'},
        {name: 'France'},
        {name: 'Belgium'},
        {name: 'China'},
        {name: 'Russia'},
        {name: 'Ukraine'}
    ]

    const onCountrySelect = data => {
        console.log('selected data:', data)
    }

    return (
        <View style={styles.signup}>
            <View style={{width: '50%', height: '5%', top: -200}}>
                <SearchableInputDropdown
                    editable={true}
                    data={data}
                    onSelect={onCountrySelect}
                    placeholder="Country"
                />
            </View>
        </View>
    )
}

const SignupNames = ({navigation}) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const handleContinue = () => navigation.navigate('signup-location')

    return (
        <View style={styles.signup}>
            <View style={styles.title}>
                <Text>Gym</Text>
            </View>
            <TextInput
                style={styles.input}
                autocomplete="name-given"
                keyboardType="default"
                placeholder="First Name"
                onChangeText={setFirstName}
                value={firstName}
            ></TextInput>
            <TextInput
                style={styles.input}
                autocomplete="name-family"
                keyboardType="default"
                placeholder="Last Name"
                onChangeText={setLastName}
                value={lastName}
            ></TextInput>
            <Pressable
                style={styles.button}
                android_disableSound={true}
                onPress={() => handleContinue()}
            >
                <Text>Continue</Text>
            </Pressable>
        </View>
    )
}

const SignupMetadata = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const error = useSelector(state => state.session.error)
    const dispatch = useDispatch()

    const handleContinue = () => navigation.navigate('signup-names')

    const resetError = () => dispatch(setSessionError(''))

    return (
        <View style={styles.signup}>
            <View style={styles.title}>
                <Text>Gym</Text>
            </View>
            <TextInput
                style={styles.input}
                autoComplete="email"
                keyboardType="email-address"
                placeholder="Email Address"
                onChangeText={setEmail}
                value={email}
            ></TextInput>
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
                autoComplete="password-new"
                keyboardType="default"
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
            ></TextInput>
            <Pressable
                style={styles.button}
                android_disableSound={true}
                onPress={() => handleContinue()}
            >
                <Text>Continue</Text>
            </Pressable>
            <Text>OR</Text>
            <Pressable
                style={styles.button}
                android_disableSound={true}
                onPress={() => {
                    setUsername('')
                    setEmail('')
                    setPassword('')
                    resetError()
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'login'}]
                    })
                }}
            >
                <Text>Login</Text>
            </Pressable>
            <Text>{error}</Text>
        </View>
    )
}

const styles = new StyleSheet.create({
    signup: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
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

export {SignupMetadata, SignupNames, SignupLocation}
