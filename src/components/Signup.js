import {useState} from 'react'
import {StyleSheet, View, Text, TextInput, Pressable} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {setSessionError} from '../actions/session'
import SearchableInputDropdown from './SearchableInputDropdown'
import locations from '../assets/countries_states_cities.json'

const countries = locations.map(({name, iso3}) => ({name, iso3}))

const SignupLocation = () => {
    // Displayed inputs
    const [countryInput, setCountryInput] = useState('')
    const [stateInput, setStateInput] = useState('')
    const [cityInput, setCityInput] = useState('')

    // Stored selected value outputs
    const [city, setCity] = useState({})
    const [state, setState] = useState({})
    const [country, setCountry] = useState({})

    // Available states & cities contingent on selection of state & country
    const [availableStates, setAvailableStates] = useState([])
    const [availableCities, setAvailableCities] = useState([])

    const handleCountrySelect = data => {
        // Clear state & city if not the same country
        if (data.iso3 !== country) {
            setState({})
            setStateInput('')
            setCity({})
            setCityInput('')
        }

        // Set country, using short form country name / code in database
        setCountry(data.iso3)

        // Find states for the given country
        const {states} = locations.find(({name}) => name === data.name)

        // Set available states
        setAvailableStates(states)
    }

    const handleStateSelect = data => {
        // Clear city if not the same state
        if (data.state_code !== state) {
            setCity({})
            setCityInput('')
        }

        // Set state, using short form state name / code in database
        setState(data.state_code)

        const {states} = locations.find(({iso3}) => iso3 === country)
        const {cities} = states.find(({name}) => name === data.name)

        const processedCities = cities.map(city => ({name: city}))

        // Find cities for the available states
        setAvailableCities(processedCities)
    }

    const handleCitySelect = ({name}) => setCity(name)

    return (
        <View style={styles.signup}>
            <View
                style={{
                    width: '50%',
                    height: '5%',
                    top: -200,
                    marginBottom: 50,
                    zIndex: 3,
                    elevation: 3
                }}
            >
                <SearchableInputDropdown
                    editable={true}
                    data={countries}
                    onSelect={handleCountrySelect}
                    placeholder="Country"
                    input={countryInput}
                    setInput={setCountryInput}
                />
            </View>
            <View
                style={{
                    width: '50%',
                    height: '5%',
                    top: -200,
                    marginBottom: 50,
                    zIndex: 2,
                    elevation: 2
                }}
            >
                <SearchableInputDropdown
                    editable={availableStates.length > 0}
                    data={availableStates}
                    onSelect={handleStateSelect}
                    placeholder={'State'}
                    input={stateInput}
                    setInput={setStateInput}
                />
            </View>
            <View
                style={{
                    width: '50%',
                    height: '5%',
                    top: -200,
                    zIndex: 1,
                    elevation: 1
                }}
            >
                <SearchableInputDropdown
                    editable={availableCities.length > 0}
                    data={availableCities}
                    onSelect={handleCitySelect}
                    placeholder="City"
                    input={cityInput}
                    setInput={setCityInput}
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
