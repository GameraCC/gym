import {SET_SESSION_LOADING, SET_SESSION_TOKEN} from './types'
import {hydrateUser} from './user'
import axios from 'axios'
import Constants from 'expo-constants'
import {handleError} from './shared'

const {HOST} = Constants.manifest.extra

const setSessionLoading = loading => ({
    type: SET_SESSION_LOADING,
    loading
})

const setSessionToken = session => ({
    type: SET_SESSION_TOKEN,
    session
})

const login =
    ({username, password}) =>
    async dispatch => {
        // Change loading status

        const data = JSON.stringify({
            username,
            password
        })

        dispatch(setSessionLoading(true))

        axios({
            url: `https://${HOST}/login`,
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            data
        })
            .then(response => {
                // 2xx status code
                // Get the session token
                const {session, user, workouts} = response.data

                // Hydrate user info
                dispatch(hydrateUser({...user, workouts}))

                // Set the session token
                dispatch(setSessionToken(session))
            })
            .catch(handleError({dispatch, title: 'Login Error'}))
    }

const signup = () => async (dispatch, getState) => {
    const {
        user: {
            username,
            email,
            password,
            first_name,
            last_name,
            location: {city, state, country}
        }
    } = getState()

    const data = JSON.stringify({
        username,
        email,
        password,
        first_name,
        last_name,
        city,
        state,
        country
    })

    dispatch(setSessionLoading(true))

    axios({
        url: `https://${HOST}/signup`,
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        data
    })
        .then(response => {
            // 2xx status code
            // Get the session token
            const {session} = response.data

            // Set the session token
            dispatch(setSessionToken(session))
        })
        .catch(handleError({dispatch, title: 'Signup Error'}))
}

export {login, signup}
