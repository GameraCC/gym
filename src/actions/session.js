import {
    SET_SESSION_LOADING,
    SET_SESSION_ERROR,
    SET_SESSION_TOKEN,
    SET_SIGNING_UP
} from './types'
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

const setSessionError = error => ({
    type: SET_SESSION_ERROR,
    error
})

const login = (username, password) => async dispatch => {
    // Change loading status
    dispatch(setSessionLoading(false))

    const data = JSON.stringify({
        username,
        password
    })

    axios({
        method: 'POST',
        url: `https://${HOST}/login`,
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
                    dispatch(setSessionError(data.message))
                else if (err.response.status === 401)
                    dispatch(setSessionError('Invalid username or password'))
                else if (err.response.status === 500)
                    dispatch(setSessionError('Internal server error'))
                else dispatch(setSessionError('Invalid server error'))
            } else dispatch(setSessionError('Fatal error logging in'))
        })
}

export {login, setSessionError}
