import {ADD_EXERCISE} from '../actions/types'

/**
 * Used for all updates from nested components / child components / screen components to parent components
 *
 * Parent components subscribe to state and handle updates contingent on a dispatch updating the global state from a child
 *
 * Similar to a global event emitter
 */

const initialState = {
    exercise: {
        name: '' // Name of exercise to be added, stored in global redux to avoid passing callbacks between components & wrapping screens in contexts
    }
}

const misc = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EXERCISE:
            state = {
                ...state,
                exercise: {
                    name: action.name
                }
            }
            break
        default:
            break
    }

    return state
}

export default misc
