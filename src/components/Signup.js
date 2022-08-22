import {useEffect, useState, useRef} from 'react'
import {StyleSheet, View, Text, TextInput, Pressable} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {
    setUsername,
    setPassword,
    setEmail,
    setFirstName,
    setLastName,
    setLocation,
    resetUser
} from '../actions/user'
import {signup} from '../actions/session'
import {newAlert} from '../actions/alert'
import SearchableInputDropdown from './SearchableInputDropdown'
import locations from '../assets/countries_states_cities.json'
import {
    usernameConstraint,
    emailConstraint,
    passwordConstraint,
    firstNameConstraint,
    lastNameConstraint
} from '../lib/constraints'

const countries = locations.map(({name, iso3}) => ({name, iso3}))

const SignupLocation = ({navigation}) => {
    // Component did mount check
    const isMounted = useRef(false)

    // Displayed inputs
    const [countryInput, setCountryInput] = useState('')
    const [stateInput, setStateInput] = useState('')
    const [cityInput, setCityInput] = useState('')

    // Available states & cities contingent on selection of state & country
    const [availableStates, setAvailableStates] = useState([])
    const [availableCities, setAvailableCities] = useState([])

    // Button handling
    const [isHighlighted, setHighlighted] = useState(false)
    const [canSubmit, setCanSubmit] = useState(false)

    const {city, state, country} = useSelector(state => state.user.location)
    const valid = useSelector(state => state.session.valid)
    const isLoading = useSelector(state => state.session.isLoading)

    const dispatch = useDispatch()
    const changeCity = _city =>
        dispatch(setLocation({city: _city, state, country}))
    const changeState = _state =>
        dispatch(setLocation({city, state: _state, country}))
    const changeCountry = _country =>
        dispatch(setLocation({city, state, country: _country}))

    const handleCountrySelect = data => {
        // Clear state & city if not the same country
        if (data.iso3 !== country) {
            setCanSubmit(false)
            changeState('')
            setStateInput('')
            setAvailableStates([])
            changeCity('')
            setCityInput('')
            setAvailableCities('')
        }

        // Set country, using short form country name / code in database
        changeCountry(data.iso3)

        // Find states for the given country
        const {states} = locations.find(({name}) => name === data.name)

        if (!states.length) {
            // If no states, remove city and state input and allow submission
            setCanSubmit(true)
        } else {
            // Set available states and show state input
            setAvailableStates(states)
        }
    }

    const handleStateSelect = data => {
        // Clear city if not the same state
        if (data.state_code !== state) {
            setCanSubmit(false)
            changeCity('')
            setCityInput('')
            setAvailableCities([])
        }

        // Set state, using short form state name / code in database
        changeState(data.state_code)

        // Find cities for chosen state
        const {states} = locations.find(({iso3}) => iso3 === country)
        const {cities} = states.find(({name}) => name === data.name)
        const processedCities = cities.map(city => ({name: city}))

        if (!processedCities.length) {
            // If no cities, remove city input and allow submission
            setCanSubmit(true)
        } else {
            // Set available cities and show city input
            setAvailableCities(processedCities)
        }
    }

    const handleCitySelect = ({name}) => {
        changeCity(name)
        setCanSubmit(true)
    }

    const handleSignup = () => {
        dispatch(signup())
    }

    useEffect(() => {
        // If valid, this will navigate to the home page, and remove this view as valid
        // is checked in the main component to navigate between authentication & application screen stack
        if (isMounted.current && !isLoading && !valid) {
            navigation.reset({
                index: 0,
                routes: [{name: 'signup-metadata'}]
            })
        } else {
            isMounted.current = true
        }
    }, [isLoading])

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
            {availableStates.length > 0 && (
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
                        editable={true}
                        data={availableStates}
                        onSelect={handleStateSelect}
                        placeholder={'State'}
                        input={stateInput}
                        setInput={setStateInput}
                    />
                </View>
            )}
            {availableCities.length > 0 && (
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
                        editable={true}
                        data={availableCities}
                        onSelect={handleCitySelect}
                        placeholder="City"
                        input={cityInput}
                        setInput={setCityInput}
                    />
                </View>
            )}
            {canSubmit && (
                <Pressable
                    onPressIn={() => setHighlighted(true)}
                    onPressOut={() => setHighlighted(false)}
                    style={[styles.button, isHighlighted && styles.highlighted]}
                    android_disableSound={true}
                    onPress={handleSignup}
                >
                    <Text>Signup</Text>
                </Pressable>
            )}
        </View>
    )
}

const SignupNames = ({navigation}) => {
    const [isHighlighted, setHighlighted] = useState(false)

    // Underscores are used for consistency with database schema
    const first_name = useSelector(state => state.user.first_name)
    const last_name = useSelector(state => state.user.last_name)

    const dispatch = useDispatch()
    const changeFirstName = name => dispatch(setFirstName(name))
    const changeLastName = name => dispatch(setLastName(name))

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

        navigation.navigate('signup-location')
    }

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
                onChangeText={changeFirstName}
                value={first_name}
            ></TextInput>
            <TextInput
                style={styles.input}
                autocomplete="name-family"
                keyboardType="default"
                placeholder="Last Name"
                onChangeText={changeLastName}
                value={last_name}
            ></TextInput>
            <Pressable
                onPressIn={() => setHighlighted(true)}
                onPressOut={() => setHighlighted(false)}
                style={[styles.button, isHighlighted && styles.highlighted]}
                android_disableSound={true}
                onPress={handleContinue}
            >
                <Text>Continue</Text>
            </Pressable>
        </View>
    )
}

const SignupMetadata = ({navigation}) => {
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

        navigation.navigate('signup-names')
    }
    const handleLogin = () => {
        resetUserInfo()
        navigation.reset({
            index: 0,
            routes: [{name: 'login'}]
        })
    }

    return (
        <View style={styles.signup}>
            <View style={styles.title}>
                <Text>Gym</Text>
            </View>
            <TextInput
                style={styles.input}
                title="Email"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="Email Address"
                onChangeText={changeEmail}
                value={email}
            ></TextInput>
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
                autoComplete="password-new"
                keyboardType="default"
                placeholder="Password"
                onChangeText={changePassword}
                value={password}
            ></TextInput>
            <Pressable
                onPressIn={() => setContinueHighlighted(true)}
                onPressOut={() => setContinueHighlighted(false)}
                style={[
                    styles.button,
                    isContinueHighlighted && styles.highlighted
                ]}
                android_disableSound={true}
                onPress={handleContinue}
            >
                <Text>Continue</Text>
            </Pressable>
            <Text>OR</Text>
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
    text: {
        width: 256,
        height: 24
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

export {SignupMetadata, SignupNames, SignupLocation}
