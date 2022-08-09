import {
    CHANGE_SESSION_LOADING,
    SET_SESSION_TOKEN,
    SET_SESSION_ERROR
} from '../actions/types'

/**
 * Contains all reducers to modify session-related state
 */

const initialState = {
    valid: false, // Whether or not the session is valid
    token: '', // The session token
    isLoading: false,
    error: ''
}

const session = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_SESSION_LOADING:
            state.isLoading = !state.isLoading
        case SET_SESSION_TOKEN:
            state.valid = true
            state.token = action.session
            state.isLoading = false
        case SET_SESSION_ERROR:
            state.valid = false
            state.error = action.error
        default:
            break
    }

    return state
}

export default session
