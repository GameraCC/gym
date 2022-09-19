import {
    SHOW_KEYBOARD,
    HIDE_KEYBOARD,
    KEYBOARD_INPUT,
    KEYBOARD_INCREMENT,
    KEYBOARD_CONTINUE,
    KEYBOARD_INPUT_RESET
} from '@actions/types'
import {KEYBOARD_REMOVE_INPUT} from '../actions/types'

/**
 * Reducer used to handle showing custom keyboard inputs
 */

/**
 * @property {boolean} visible - Whether or not the keyboard is visible
 * @property {'numeric'} keyboard - The kind of keyboard to display
 * @property {string} input - The input of the keyboard
 * @property {number} continueCount - The number of times the continue button has been pressed
 */
const initialState = {
    kind: 'numeric',
    visible: false,
    input: '',
    continueCount: 0
}

const keyboard = (state = initialState, action) => {
    console.log(action)

    switch (action.type) {
        case KEYBOARD_INPUT:
            state = {
                ...state,
                input: state.input ? state.input + action.input : action.input
            }
            break
        case KEYBOARD_INPUT_RESET:
            state = {
                ...state,
                input: ''
            }
            break
        case KEYBOARD_REMOVE_INPUT:
            state = {
                ...state,
                input: state.input.slice(0, -1)
            }
            break
        case KEYBOARD_INCREMENT:
            const originalValue = isNaN(parseFloat(state.input))
                ? 0
                : parseFloat(state.input)

            state = {
                ...state,
                input: Math.max(originalValue + action.amount, 0).toString()
            }
            break
        case KEYBOARD_CONTINUE:
            state = {
                ...state,
                continueCount: state.continueCount + 1
            }
            break
        case SHOW_KEYBOARD:
            state = {
                ...state,
                kind: action.kind,
                visible: true
            }
            break
        case HIDE_KEYBOARD:
            state = {
                ...state,
                kind: state.kind,
                visible: false,
                input: ''
            }
            break
        default:
            break
    }

    console.log(state)

    return state
}

export default keyboard
