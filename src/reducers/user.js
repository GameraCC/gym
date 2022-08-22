const {
    SET_USERNAME,
    SET_EMAIL,
    SET_PASSWORD,
    SET_FIRST_NAME,
    SET_LAST_NAME,
    SET_LOCATION,
    SET_PROFILE_PICTURE,
    SET_BIO,
    HYDRATE_USER,
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
    },
    profile_picture: '',
    bio: ''
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
        case SET_PROFILE_PICTURE:
            state = {
                ...state,
                profile_picture: action.profile_picture
            }
            break
        case SET_BIO:
            state = {
                ...state,
                bio: action.bio
            }
            break
        case HYDRATE_USER:
            state = {
                ...state,
                email: action.email,
                username: action.username,
                first_name: action.first_name,
                last_name: action.last_name,
                location: action.location,
                profile_picture: action.profile_picture,
                bio: action.bio
            }
            break
        case RESET_USER:
            state = {
                ...initialState
            }
            break
    }

    console.log(state)

    return state
}

export default user
