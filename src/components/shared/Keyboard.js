import {useState} from 'react'
import {StyleSheet, View, Pressable, Text, Image} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {
    hideKeyboard,
    keyboardInput,
    keyboardRemoveInput,
    keyboardIncrement,
    keyboardContinue
} from '@actions/keyboard'
import * as Haptics from 'expo-haptics'

import Images from '@assets/images'
import {
    black,
    gray,
    white,
    dark_gray,
    darker_gray,
    light_black
} from '@assets/colors'

const Button = props => {
    const {text, image, extra, left, right, isContinue, imageStyle, onPress} =
        props

    const [isHighlighted, setHighlighted] = useState(false)

    const onPressInHandler = () => {
        setHighlighted(true)
    }
    const onPressOutHandler = () => {
        setHighlighted(false)
    }

    const onPressHandler = text => {
        if (extra) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

        onPress(text)
    }

    return (
        <Pressable
            style={[
                left
                    ? [styles.incrementButton, styles.left]
                    : right
                    ? [styles.incrementButton, styles.right]
                    : extra
                    ? styles.extraButton
                    : styles.button,
                isContinue && styles.continue,
                isHighlighted &&
                    (extra
                        ? styles.extraButtonHighlighted
                        : styles.buttonHighlighted)
            ]}
            onPress={onPressHandler}
            onPressIn={onPressInHandler}
            onPressOut={onPressOutHandler}
        >
            {image ? (
                <Image style={imageStyle} source={image} />
            ) : (
                <Text
                    style={[
                        styles.buttonText,
                        isHighlighted &&
                            (extra
                                ? styles.extraButtonHighlighted
                                : styles.buttonHighlighted)
                    ]}
                >
                    {text}
                </Text>
            )}
        </Pressable>
    )
}

const NumericKeyboard = () => {
    const dispatch = useDispatch()

    return (
        <View style={styles.container}>
            <View style={styles.numericInputContainer}>
                <View style={styles.inputRow}>
                    {[1, 2, 3].map(x => (
                        <Button
                            key={x}
                            text={x.toString()}
                            onPress={() =>
                                dispatch(keyboardInput(x.toString()))
                            }
                        />
                    ))}
                </View>
                <View style={styles.inputRow}>
                    {[4, 5, 6].map(x => (
                        <Button
                            key={x}
                            text={x.toString()}
                            onPress={() =>
                                dispatch(keyboardInput(x.toString()))
                            }
                        />
                    ))}
                </View>
                <View style={styles.inputRow}>
                    {[7, 8, 9].map(x => (
                        <Button
                            key={x}
                            text={x.toString()}
                            onPress={() =>
                                dispatch(keyboardInput(x.toString()))
                            }
                        />
                    ))}
                </View>
                <View style={styles.inputRow}>
                    <View style={styles.placeholder} />
                    <Button
                        text={0}
                        onPress={() => dispatch(keyboardInput('0'))}
                    />
                    <Button
                        text="."
                        onPress={() => dispatch(keyboardInput('.'))}
                    />
                </View>
            </View>
            <View style={styles.extraContainer}>
                <View style={styles.inputRow}>
                    <Button
                        image={Images.KEYBOARD_HIDE}
                        imageStyle={styles.hideImage}
                        onPress={() => dispatch(hideKeyboard())}
                        extra={true}
                    />
                </View>
                <View style={[styles.inputRow]}>
                    <Button
                        onPress={() => dispatch(keyboardIncrement(2.5))}
                        image={Images.KEYBOARD_INCREMENT}
                        imageStyle={styles.incrementImage}
                        extra={true}
                        left={true}
                    />
                    <Button
                        image={Images.KEYBOARD_DECREMENT}
                        onPress={() => dispatch(keyboardIncrement(-2.5))}
                        imageStyle={styles.decrementImage}
                        extra={true}
                        right={true}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Button
                        image={Images.KEYBOARD_REMOVE_INPUT}
                        onPress={() => dispatch(keyboardRemoveInput())}
                        imageStyle={styles.removeInputImage}
                        extra={true}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Button
                        image={Images.KEYBOARD_CONTINUE}
                        onPress={() => dispatch(keyboardContinue())}
                        imageStyle={styles.continueImage}
                        extra={true}
                        isContinue={true}
                    />
                </View>
            </View>
        </View>
    )
}

const Keyboard = () => {
    const isVisible = useSelector(state => state.keyboard.visible)
    const kind = useSelector(state => state.keyboard.kind)

    if (isVisible) {
        switch (kind) {
            case 'numeric':
                return <NumericKeyboard />
            default:
                return <></>
        }
    } else return <></>
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '28.5%',
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: dark_gray,
        paddingBottom: 32,
        paddingLeft: 8,
        paddingTop: 8,
        paddingRight: 8
    },
    numericInputContainer: {
        width: '70%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    inputRow: {
        flex: 1,
        width: '100%',
        marginTop: 4,
        marginBottom: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    button: {
        flex: 0.33,
        height: '100%',
        marginLeft: 4,
        marginRight: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: white,
        borderColor: white,
        borderRadius: 8,
        borderWidth: 1,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2
    },
    placeholder: {
        flex: 0.33,
        height: '100%',
        marginLeft: 4,
        marginRight: 4
    },
    buttonText: {
        fontSize: 20,
        fontFamily: 'Helvetica',
        color: black
    },
    buttonHighlighted: {
        backgroundColor: dark_gray,
        borderColor: dark_gray,
        color: black
    },
    extraButtonHighlighted: {
        opacity: 0.9
    },
    extraContainer: {
        width: '30%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    extraButton: {
        flex: 1,
        height: '100%',
        marginLeft: 4,
        marginRight: 4,
        backgroundColor: darker_gray,
        borderColor: darker_gray,
        borderRadius: 8,
        borderWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2
    },
    incrementButton: {
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darker_gray,
        borderColor: darker_gray
    },
    left: {
        marginLeft: 4,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderRightColor: gray,
        borderRightWidth: 0.2
    },
    right: {
        marginRight: 4,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    hideImage: {
        resizeMode: 'cover',
        width: 15,
        height: 7.5
    },
    incrementImage: {
        width: 20,
        height: 20
    },
    decrementImage: {
        width: 20,
        height: 20
    },
    removeInputImage: {
        resizeMode: 'cover',
        width: 20,
        height: 12
    },
    continueImage: {
        resizeMode: 'cover',
        width: 20,
        height: 12
    },
    continue: {
        backgroundColor: light_black,
        borderColor: light_black
    }
})

export default Keyboard
