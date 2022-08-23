import {SET_SESSION_LOADING, SET_SESSION_TOKEN} from './types'
import {hydrateUser} from './user'
import {newAlert} from './alert'
import axios from 'axios'
import Constants from 'expo-constants'

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
                const {session, user} = response.data

                // Hydrate user info
                dispatch(hydrateUser(user))

                // Set the session token
                dispatch(setSessionToken(session))
            })
            .catch(err => {
                // Handle various errors for non 2xx status codes
                if (err.response) {
                    const data = err.response?.data || null

                    if (
                        [400, 500].includes(err.response.status) &&
                        data?.message
                    )
                        dispatch(
                            newAlert({
                                kind: 'error',
                                title: 'Login Error',
                                message: data.message
                            })
                        )
                    else if (err.response.status === 401)
                        dispatch(
                            newAlert({
                                kind: 'error',
                                title: 'Login Error',
                                message: 'Invalid username or password'
                            })
                        )
                    else if (err.response.status === 500)
                        dispatch(
                            newAlert({
                                kind: 'error',
                                title: 'Login Error',
                                message: 'Internal server error'
                            })
                        )
                    else
                        dispatch(
                            newAlert({
                                kind: 'error',
                                title: 'Login Error',
                                message: 'Invalid server error'
                            })
                        )
                } else
                    dispatch(
                        newAlert({
                            kind: 'error',
                            title: 'Login Error',
                            message: 'Fatal error logging in'
                        })
                    )
            })
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
        .catch(err => {
            // Handle various errors for non 2xx status codes
            if (err.response) {
                const data = err.response?.data || null

                if ([400, 500].includes(err.response.status) && data?.message)
                    dispatch(
                        newAlert({
                            kind: 'error',
                            title: 'Signup Error',
                            message: data.message
                        })
                    )
                else if (err.response.status === 500)
                    dispatch(
                        newAlert({
                            kind: 'error',
                            title: 'Signup Error',
                            message: 'Internal server error'
                        })
                    )
                else
                    dispatch(
                        newAlert({
                            kind: 'error',
                            title: 'Signup Error',
                            message: 'Invalid server error'
                        })
                    )
            } else
                dispatch(
                    newAlert({
                        kind: 'error',
                        title: 'Signup Error',
                        message: 'Fatal error logging in'
                    })
                )
        })
}

export {login, signup}
