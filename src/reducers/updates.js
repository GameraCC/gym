import {ADD_EXERCISE} from '@actions/types'

/**
 * Used for all updates from nested components / child components / screen components to parent components
 *
 * Parent components subscribe to an object who's reference is changed on each update (not a nested property)
 * Updates are contingent on a dispatch updating the global state from a child
 *
 * Similar to a global event emitter
 */

// Value must be wrapped in an object to always trigger a re-render, select the object in the useSelector method rather than a nested property
const initialState = {
    exercise: {
        id: '' // Id of exercise to be added, stored in global redux to avoid passing callbacks between components & wrapping screens in contexts
    }
}

const updates = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EXERCISE:
            state = {
                ...state,
                exercise: {
                    id: action.id
                }
            }
            break
        default:
            break
    }

    return state
}

export default updates
