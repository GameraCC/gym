import {useEffect, useState, useRef} from 'react'
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
import {background, black, white} from './colors'
import locations from '../assets/countries_states_cities.json'
import {
    usernameConstraint,
    emailConstraint,
    passwordConstraint,
    firstNameConstraint,
    lastNameConstraint
} from '../lib/constraints'
import KeyboardAvoidingWrapper from './KeyboardAvoidingWrapper'

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

    // State to manage whether state & cities are visible and editable
    const [isStateVisible, setStateVisible] = useState(true)
    const [isStateEditable, setStateEditable] = useState(false)
    const [isCityVisible, setCityVisible] = useState(true)
    const [isCityEditable, setCityEditable] = useState(false)

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
            setStateEditable(false)
            setStateVisible(false)
            setCityEditable(false)
            setCityVisible(false)
        } else {
            // Set available states and show state enabled input & city disabled input
            setAvailableStates(states)
            setStateEditable(true)
            setStateVisible(true)
            setCityVisible(true)
            setCityEditable(false)
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
            setCityEditable(false)
            setCityVisible(false)
        } else {
            // Set available cities and show city input
            setAvailableCities(processedCities)
            setCityEditable(true)
            setCityVisible(true)
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

        // Invalid handling, return to signup page
        if (isMounted.current && !isLoading && !valid) {
            Keyboard.dismiss()
            navigation.reset({
                index: 0,
                routes: [{name: 'signup-metadata'}]
            })
        } else {
            isMounted.current = true
        }
    }, [isLoading])

    return (
        <KeyboardAvoidingWrapper style={styles.signup}>
            <Image style={styles.logo} source={require('../assets/icon.png')} />
            <View
                style={[
                    styles.inputContainer,
                    {
                        height:
                            48 + (isStateVisible && 48) + (isCityVisible && 48),
                        zIndex: 4,
                        elevation: 4
                    }
                ]} // Grant 48 DPs of height for each visible button
            >
                <SearchableInputDropdown
                    editable={true}
                    data={countries}
                    onSelect={handleCountrySelect}
                    // onFilterCount={onCountryFilterCount}
                    placeholder="Country"
                    input={countryInput}
                    setInput={setCountryInput}
                    style={{
                        ...dropdownStyles,
                        dropdown: [
                            dropdownStyles.dropdown,
                            isStateVisible && styles.inputDivide
                        ], // Add divider to dropdown
                        wrapper: [
                            dropdownStyles.wrapper,
                            {zIndex: 3, elevation: 3}
                        ]
                    }}
                />
                {isStateVisible && (
                    <SearchableInputDropdown
                        editable={isStateEditable}
                        data={availableStates}
                        onSelect={handleStateSelect}
                        placeholder={'State'}
                        input={stateInput}
                        setInput={setStateInput}
                        style={{
                            ...dropdownStyles,
                            dropdown: [
                                dropdownStyles.dropdown,
                                isCityVisible && styles.inputDivide // Add divider to dropdown
                            ],
                            wrapper: [
                                dropdownStyles.wrapper,
                                {zIndex: 2, elevation: 2}
                            ]
                        }}
                    />
                )}
                {isCityVisible && (
                    <SearchableInputDropdown
                        editable={isCityEditable}
                        data={availableCities}
                        onSelect={handleCitySelect}
                        placeholder="City"
                        input={cityInput}
                        setInput={setCityInput}
                        style={{
                            ...dropdownStyles,
                            wrapper: [
                                dropdownStyles.wrapper,
                                {zIndex: 1, elevation: 1}
                            ]
                        }}
                    />
                )}
            </View>
            <View
                style={[styles.buttonContainer, styles.singleButtonContainer]}
            >
                <Pressable
                    onPressIn={() => setHighlighted(true)}
                    onPressOut={() => setHighlighted(false)}
                    style={[styles.button, isHighlighted && styles.highlighted]}
                    android_disableSound={true}
                    onPress={handleSignup}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            isHighlighted && styles.highlighted
                        ]}
                    >
                        Signup
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingWrapper>
    )
}

const SignupNames = ({navigation}) => {
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
            <Image style={styles.logo} source={require('../assets/icon.png')} />
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
            <Image style={styles.logo} source={require('../assets/icon.png')} />
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
        flexDirection: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: background
    },
    logo: {
        width: 72,
        height: 72,
        marginTop: '50%'
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
        borderBottomWidth: 2
    },
    inputContainer: {
        width: '60%',
        marginTop: '10%',
        marginBottom: '10%',
        borderColor: black,
        borderWidth: 2,
        borderRadius: 7
    },
    metadataInputContainer: {
        height: 144 // 48 dp per item
    },
    namesInputContainer: {
        height: 96
    },
    locationInputContainer: {
        zIndex: 3
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
        borderWidth: 2,
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

const dropdownStyles = StyleSheet.create({
    wrapper: {
        height: 48,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dropdown: {
        ...styles.input,
        textAlign: 'center',
        width: '100%',
        height: '100%'
    },
    list: {
        width: '101.5%',
        maxHeight: 144,
        position: 'absolute',
        top: 48,
        backgroundColor: white,
        borderColor: black,
        borderWidth: 1,
        borderRadius: 4
    },
    listItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    listItemDivider: {
        width: '100%',
        borderBottomColor: black,
        borderBottomWidth: 1
    },
    listItemHighlighted: {
        backgroundColor: black,
        color: white
    },
    listItemText: {
        fontSize: 13,
        color: black
    }
})

export {SignupMetadata, SignupNames, SignupLocation}
