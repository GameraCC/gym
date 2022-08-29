import {
    SET_USERNAME,
    SET_EMAIL,
    SET_PASSWORD,
    SET_FIRST_NAME,
    SET_LAST_NAME,
    SET_LOCATION,
    SET_PROFILE_PICTURE,
    SET_BIO,
    SET_REFRESHING,
    SET_WORKOUTS,
    DELETE_WORKOUT,
    HYDRATE_USER,
    RESET_USER
} from '../actions/types'
import axios from 'axios'
import Constants from 'expo-constants'
import {handleError} from './shared'

const {HOST} = Constants.manifest.extra

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

const setWorkouts = workouts => ({
    type: SET_WORKOUTS,
    workouts
})

const deleteWorkoutLocal = name => ({
    type: DELETE_WORKOUT,
    name
})

const setRefreshing = isRefreshing => ({
    type: SET_REFRESHING,
    isRefreshing
})

const getAllWorkouts = () => async (dispatch, getState) => {
    const {
        session: {token: session}
    } = getState()

    dispatch(setRefreshing(true))

    axios({
        url: `https://${HOST}/workouts`,
        method: 'GET',
        headers: {
            'authorization': session
        }
    })
        .then(response => {
            const {workouts} = response.data
            dispatch(setWorkouts(workouts))
            dispatch(setRefreshing(false))
        })
        .catch(handleError({dispatch, title: 'Refresh Error'}))
}

const deleteWorkout = name => async (dispatch, getState) => {
    const {
        session: {token: session}
    } = getState()

    const data = JSON.stringify({
        name
    })

    axios({
        url: `https://${HOST}/workouts/delete`,
        method: 'POST',
        headers: {
            'authorization': session
        },
        data
    })
        .then(() => dispatch(deleteWorkoutLocal(name)))
        .catch(handleError({dispatch, title: 'Delete Error'}))
}

// Hydrates user info with login response metadata
const hydrateUser = ({
    email,
    username,
    first_name,
    last_name,
    location: {city, state, country},
    profile_picture,
    bio,
    workouts
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
    bio,
    workouts
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
    setWorkouts,
    deleteWorkout,
    hydrateUser,
    resetUser,
    getAllWorkouts
}
