import {
    SET_SESSION_LOADING,
    SET_SESSION_TOKEN,
    SET_SESSION_ERROR,
    SET_SIGNING_UP
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
        case SET_SESSION_LOADING:
            state = {
                ...state,
                isLoading: action.loading
            }
            break
        case SET_SESSION_TOKEN:
            state = {
                ...state,
                isLoading: false,
                error: '',
                token: action.session,
                valid: true
            }
            break
        case SET_SESSION_ERROR:
            state = {
                ...state,
                isLoading: false,
                error: action.error,
                valid: false
            }
            break
        default:
            break
    }

    return {...state}
}

export default session
