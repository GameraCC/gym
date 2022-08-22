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

const setUsername = username => ({
    type: SET_USERNAME,
    username
})

const setEmail = email => ({
    type: SET_EMAIL,
    email
})

const setPassword = password => ({
    type: SET_PASSWORD,
    password
})

// Underscores are used for consistency with database schema
const setFirstName = first_name => ({
    type: SET_FIRST_NAME,
    first_name
})

// Underscores are used for consistency with database schema
const setLastName = last_name => ({
    type: SET_LAST_NAME,
    last_name
})

const setLocation = ({country, city, state}) => ({
    type: SET_LOCATION,
    location: {
        country: country ? country : '',
        city: city ? city : '',
        state: state ? state : ''
    }
})

const setProfilePicture = profile_picture => ({
    type: SET_PROFILE_PICTURE,
    profile_picture
})

const setBio = bio => ({
    type: SET_BIO,
    bio
})

// Hydrates user info with login response metadata
const hydrateUser = ({
    email,
    username,
    first_name,
    last_name,
    location: {city, state, country},
    profile_picture,
    bio
}) => ({
    type: HYDRATE_USER,
    email,
    username,
    first_name,
    last_name,
    location: {
        city,
        state,
        country
    },
    profile_picture,
    bio
})

const resetUser = () => ({
    type: RESET_USER
})

export {
    setUsername,
    setEmail,
    setPassword,
    setFirstName,
    setLastName,
    setLocation,
    setProfilePicture,
    setBio,
    hydrateUser,
    resetUser
}
