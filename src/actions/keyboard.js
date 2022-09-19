import {
    SHOW_KEYBOARD,
    HIDE_KEYBOARD,
    KEYBOARD_INPUT,
    KEYBOARD_REMOVE_INPUT,
    KEYBOARD_INCREMENT,
    KEYBOARD_CONTINUE,
    KEYBOARD_INPUT_RESET
} from './types'

/**
 * Shows a keyboard
 *
 * @param {'numeric'} kind - The kind of keyboard
 */
const showKeyboard = kind => ({
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

const keyboardResetInput = input => ({
    type: KEYBOARD_INPUT_RESET
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
    showKeyboard,
    hideKeyboard,
    keyboardInput,
    keyboardResetInput,
    keyboardRemoveInput,
    keyboardIncrement,
    keyboardContinue
}
