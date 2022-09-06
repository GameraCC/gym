import {useState, useRef, useEffect} from 'react'
import {
    StyleSheet,
    Platform,
    Keyboard,
    View,
    Pressable,
    Text,
    Image
} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {signup} from '@actions/session'
import {setLocation} from '@actions/user'
import {useNavigation} from '@react-navigation/native'

import KeyboardAvoidingWrapper from '@shared/KeyboardAvoidingWrapper'
import SearchableInputDropdown from '@shared/SearchableInputDropdown'

import Images from '@assets/images'
import {COUNTRIES_STATES_CITIES} from '@assets/static'
import {background, black, white} from '@assets/colors'

const locations = COUNTRIES_STATES_CITIES.map(({name, iso3, states}) => ({
    name,
    iso3,
    states
}))

const SignupLocation = props => {
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

    const {city, state, country} = useSelector(state => state.user.location)
    const valid = useSelector(state => state.session.valid)
    const isLoading = useSelector(state => state.session.isLoading)

    const navigation = useNavigation()

    const dispatch = useDispatch()
    const changeCity = _city =>
        dispatch(setLocation({city: _city, state, country}))
    const changeState = _state =>
        dispatch(setLocation({city, state: _state, country}))
    const changeCountry = _country =>
        dispatch(setLocation({city, state, country: _country}))
    const resetCityState = () =>
        dispatch(setLocation({country, state: '', city: ''}))

    const handleCountrySelect = data => {
        // Clear state & city if not the same country
        if (data.iso3 !== country) {
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
            changeCity('')
            setCityInput('')
            setAvailableCities([])
        }

        console.log({...data, cities: []})

        // Set state, using short form state name / code in database
        changeState(data.state_code)

        // Find cities for chosen state
        const {states} = locations.find(({iso3}) => iso3 === country)
        const {cities} = states.find(({name}) => name === data.name)
        const processedCities = cities.map(city => ({name: city}))

        if (!processedCities.length) {
            // If no cities, remove city input and allow submission
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
    }

    const handleSignup = () => {
        // If no country, state, or city ensure the global redux state has no values set to it
        // This can occur when the user selects a state, navigates back to the previous navigation stack screen
        // then selects a country which has no states or cities

        if (!countryInput) changeCountry('')
        else if (countryInput && !cityInput && !stateInput) resetCityState('')
        else if (!stateInput && cityInput) changeCity('')

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
            <Image style={styles.logo} source={Images.ICON} />
            <View
                style={[
                    styles.inputContainer,
                    {
                        height:
                            48 + (isStateVisible && 48) + (isCityVisible && 48),
                        zIndex: 4
                    }
                ]} // Grant 48 DPs of height for each visible button
            >
                <SearchableInputDropdown
                    editable={true}
                    data={locations}
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
                        wrapper: [dropdownStyles.wrapper, {zIndex: 3}]
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
                            wrapper: [dropdownStyles.wrapper, {zIndex: 2}]
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
                            wrapper: [dropdownStyles.wrapper, {zIndex: 1}]
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
    buttonContainer: {
        width: '42.5%',
        height: 80,
        marginBottom: 256
    },
    singleButtonContainer: {
        height: 40
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
        fontFamily: 'Helvetica',
        fontSize: 13,
        color: black
    }
})

export default SignupLocation
