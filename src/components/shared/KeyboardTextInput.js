import {
    useState,
    useRef,
    useEffect,
    useImperativeHandle,
    forwardRef
} from 'react'
import {TextInput} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {
    hideKeyboard,
    showKeyboard,
    keyboardResetInput,
    keyboardInput
} from '@actions/keyboard'
import keyboard from '../../reducers/keyboard'

/**
 * Wraps a TextInput to provide custom keyboard handling
 *
 * Can pass any TextInput prop, must contain an onChangeText method
 *
 * e.g:
 *
 * <KeyboardWrapper normalTextInputProp={true}/>
 *
 * @param {Object} props - Props
 * @param {string} props.kind - The kind of keyboard (Check reducer for available kinds)
 * @param {Function} props.onChangeText - Required onChangeText method called on keyboard text change
 * @param {String} props.value - Value to be passed to TextInput
 * @param {Object} props.continueRef - The next KeyboardWrapper component ref to focus on the keyboard's continue button being clicked
 */
const KeyboardWrapper = (props, ref) => {
    const {onChangeText, kind, value, continueRef, ...otherProps} = props

    const [isSubscribed, setSubscribed] = useState(false)

    const textInputRef = useRef(textInputRef)

    const input = useSelector(state => state.keyboard.input)
    const continueCount = useSelector(state => state.keyboard.continueCount)
    const isVisible = useSelector(state => state.keyboard.visible)

    const dispatch = useDispatch()

    // Update text upon input being changed if subscribed
    useEffect(() => {
        if (isSubscribed) onChangeText(input)
    }, [input])

    // Continue button handling
    useEffect(() => {
        if (isSubscribed && continueRef) {
            // If the keyboard continue button is clicked, unsubscribe this keyboard, and subscribe to the continue ref
            setSubscribed(false)
            continueRef?.current?.continue()
        } else if (isSubscribed && !continueRef) {
            // If the keyboard continue button is clicked, and theres no chained continueRef, hide the keyboard to imply the input process has finished
            setSubscribed(false)
            dispatch(hideKeyboard())
            textInputRef?.current?.blur()
        }
    }, [continueCount])

    // Unsubscribe and blur TextInput element upon keyboard hide button pressed
    useEffect(() => {
        if (!isVisible && isSubscribed) {
            setSubscribed(false)
            textInputRef?.current?.blur()
        }
    }, [isVisible])

    // Expose methods on ref which allows chaining between the continue button
    useImperativeHandle(ref, () => ({
        continue: () => {
            // Focus the TextInput on continue
            textInputRef?.current?.focus()
        }
    }))

    const textInputOnFocus = () => {
        // Set keyboard input to current TextInput value to continue input
        dispatch(keyboardInput(value))
        if (!isVisible) dispatch(showKeyboard(kind))
        setSubscribed(true)
    }

    const textInputOnBlur = () => {
        // Unsubscribe and reset keyboard input
        setSubscribed(false)
        dispatch(keyboardResetInput(''))
    }

    const textInputOnSelection = e => {
        console.log(e)
        console.log(e.nativeEvent)
    }

    return (
        <TextInput
            showSoftInputOnFocus={false} // Disable default keyboard
            onFocus={textInputOnFocus}
            onBlur={textInputOnBlur}
            ref={textInputRef}
            value={value}
            {...otherProps}
            onSelectionChange={textInputOnSelection}
            editable={true}
        ></TextInput>
    )
}

export default forwardRef(KeyboardWrapper)
