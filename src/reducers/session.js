import {
    SET_SESSION_LOADING,
    SET_SESSION_TOKEN,
    SET_SESSION_ERROR
} from '@actions/types'

/**
 * Contains all reducers to modify session-related state
 */

const initialState = {
    valid: false, // Whether or not the session is valid
    token: '', // The session token
    isLoading: false
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
                token: action.session,
                valid: true
            }
            break
        case SET_SESSION_ERROR:
            state = {
                ...state,
                isLoading: false,
                valid: false
            }
            break
        default:
            break
    }

    return {...state}
}

export default session
