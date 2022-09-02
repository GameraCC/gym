import {useState, useRef, useEffect} from 'react'
import {StyleSheet, View, Pressable, Text, TextInput} from 'react-native'
import BackButton from './BackButton'
import {white, black, green, gray} from '@assets/colors'

/**
 * Header component
 *
 * @param {Object} params
 * @param {Object} params.canGoBack - Whether or not to render the back button
 * @param {Object} params.navigation - Navigation object
 * @param {string} params.title - Title of header
 * @param {string} params.description - Description of title
 * @param {string} params.buttonTitle - Title of button
 * @param {Object} params.buttonStyle - Additional style applied to button
 * @param {Object} parmas.buttonTextStyle - Additional style applied to button text
 * @param {Object} params.buttonHighlightedStyle - Style applied to highlighted button and buttonText
 * @param {Function} params.buttonCallback - Callback called upon button press
 */
const Header = params => {
    const {
        canGoBack,
        navigation,
        title,
        description,
        buttonTitle,
        buttonStyle,
        buttonTextStyle,
        buttonHighlightedStyle,
        buttonCallback
    } = params
    const [isHighlighted, setHighlighted] = useState(false)

    const handleOnPressIn = () => setHighlighted(true)
    const handleOnPressOut = () => setHighlighted(false)

    return (
        <View style={styles.headerContainer}>
            {canGoBack && ( // Add back button if can go back
                <BackButton
                    navigation={navigation}
                    style={{container: [styles.backButtonContainer]}}
                />
            )}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.titleDescription}>{description}</Text>
            </View>
            <View style={[styles.buttonContainer]}>
                <Pressable
                    onPress={buttonCallback}
                    onPressIn={handleOnPressIn}
                    onPressOut={handleOnPressOut}
                    style={[
                        styles.button,
                        buttonStyle,
                        isHighlighted && buttonHighlightedStyle
                    ]}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            buttonTextStyle,
                            isHighlighted && buttonHighlightedStyle
                        ]}
                    >
                        {buttonTitle}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

/**
 * Header which has editable text inputs
 *
 * @param {Object} params
 * @param {Object} params.canGoBack - Whether or not to render the back button
 * @param {Object} params.navigation - Navigation object
 * @param {string} params.title - Title of header
 * @param {Function} params.titleInputCallback - Callback called upon text input on title
 * @param {string} params.description - Description of title
 * @param {Function} params.descriptionInputCallback - Callback called upon text input on description
 * @param {string} params.buttonTitle - Title of button
 * @param {Object} params.buttonStyle - Additional style applied to button
 * @param {Object} parmas.buttonTextStyle - Additional style applied to button text
 * @param {Object} params.buttonHighlightedStyle - Style applied to highlighted button and buttonText
 * @param {Function} params.buttonCallback - Callback called upon button press
 */
const EditableHeader = params => {
    const {
        canGoBack,
        navigation,
        title,
        titleInputCallback,
        description,
        descriptionInputCallback,
        buttonTitle,
        buttonStyle,
        buttonTextStyle,
        buttonHighlightedStyle,
        buttonCallback
    } = params
    const [isHighlighted, setHighlighted] = useState(false)

    const placeholderTitle = useRef(title)
    const placeholderDescription = useRef(description)

    // Reset title & description default values stored in ref.current now
    useEffect(() => {
        titleInputCallback('')
        descriptionInputCallback('')
    }, [])

    const handleOnPressIn = () => setHighlighted(true)
    const handleOnPressOut = () => setHighlighted(false)

    return (
        <View style={styles.headerContainer}>
            {canGoBack && ( // Add back button if can go back
                <BackButton
                    navigation={navigation}
                    style={{container: [styles.backButtonContainer]}}
                />
            )}
            <View style={styles.titleContainer}>
                <TextInput
                    numberOfLines={1}
                    style={styles.title}
                    value={title}
                    onChangeText={titleInputCallback}
                    autoFocus={true}
                    placeholder={placeholderTitle.current}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                />
                <TextInput
                    numberOfLines={1}
                    style={styles.titleDescription}
                    value={description}
                    onChangeText={descriptionInputCallback}
                    placeholder={placeholderDescription.current}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                />
            </View>
            <View style={[styles.buttonContainer]}>
                <Pressable
                    onPress={buttonCallback}
                    onPressIn={handleOnPressIn}
                    onPressOut={handleOnPressOut}
                    style={[
                        styles.button,
                        buttonStyle,
                        isHighlighted && buttonHighlightedStyle
                    ]}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            buttonTextStyle,
                            isHighlighted && buttonHighlightedStyle
                        ]}
                    >
                        {buttonTitle}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    backButtonContainer: {
        position: 'relative',
        right: 14
    },
    headerContainer: {
        marginLeft: 32,
        marginRight: 32,
        marginTop: 64,
        marginBottom: 32,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    titleContainer: {
        width: '50%',
        height: '100%'
    },
    title: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 32
    },
    titleDescription: {
        marginTop: 6,
        paddingLeft: 2,
        color: gray,
        textAlign: 'left',
        fontFamily: 'Helvetica'
    },
    buttonContainer: {
        marginLeft: 'auto',
        marginRight: 2,
        height: 40,
        width: 112
    },
    button: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: green,
        borderColor: green,
        borderWidth: 1,
        borderRadius: 64
    },
    buttonText: {
        fontFamily: 'Helvetica-Bold',
        color: white,
        fontSize: 16
    },
    buttonHighlighted: {
        color: white,
        backgroundColor: black,
        borderColor: black
    }
})

export {Header, EditableHeader}
