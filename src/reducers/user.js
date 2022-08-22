const {
    SET_USERNAME,
    SET_EMAIL,
    SET_PASSWORD,
    SET_FIRST_NAME,
    SET_LAST_NAME,
    SET_LOCATION,
    RESET_USER
} = require('../actions/types')

/**
 * Contains all reducers to modify user data related state
 */

const initialState = {
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    location: {
        country: '',
        state: '',
        city: ''
    }
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERNAME:
            state = {
                ...state,
                username: action.username
            }
            break
        case SET_EMAIL:
            state = {
                ...state,
                email: action.email
            }
            break
        case SET_PASSWORD:
            state = {
                ...state,
                password: action.password
            }
            break
        case SET_FIRST_NAME:
            state = {
                ...state,
                first_name: action.first_name
            }
            break
        case SET_LAST_NAME:
            state = {
                ...state,
                last_name: action.last_name
            }
            break
        case SET_LOCATION:
            state = {
                ...state,
                location: action.location
            }
            break
        case RESET_USER:
            state = {
                ...initialState
            }
            break
    }

    return state
}

export default user
