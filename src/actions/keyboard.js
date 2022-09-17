import {
    SHOW_KEYBOARD,
    HIDE_KEYBOARD,
    KEYBOARD_INPUT,
    KEYBOARD_REMOVE_INPUT,
    KEYBOARD_INCREMENT,
    KEYBOARD_CONTINUE
} from './types'

/**
 * Shows a keyboard
 *
 * @param {'numeric'} kind - The kind of keyboard
 */
const showNumericKeyboard = kind => ({
    type: SHOW_KEYBOARD,
    kind
})

const hideKeyboard = () => ({
    type: HIDE_KEYBOARD
})

const keyboardInput = input => ({
    type: KEYBOARD_INPUT,
    input
})

const keyboardIncrement = amount => ({
    type: KEYBOARD_INCREMENT,
    amount
})

const keyboardContinue = () => ({
    type: KEYBOARD_CONTINUE
})

const keyboardRemoveInput = () => ({
    type: KEYBOARD_REMOVE_INPUT
})

export {
    showNumericKeyboard,
    hideKeyboard,
    keyboardInput,
    keyboardRemoveInput,
    keyboardIncrement,
    keyboardContinue
}
