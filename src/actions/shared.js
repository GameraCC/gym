import {newAlert} from './alert'

export const handleError =
    ({dispatch, title}) =>
    err => {
        // Handle various errors for non 2xx status codes
        if (err.response) {
            const data = err.response?.data || null

            if ([400, 500].includes(err.response.status) && data?.message)
                dispatch(
                    newAlert({
                        kind: 'error',
                        title,
                        message: data.message
                    })
                )
            else if (err.response.status === 500)
                dispatch(
                    newAlert({
                        kind: 'error',
                        title,
                        message: 'Internal server error'
                    })
                )
            else
                dispatch(
                    newAlert({
                        kind: 'error',
                        title,
                        message: 'Invalid server error'
                    })
                )
        } else
            dispatch(
                newAlert({
                    kind: 'error',
                    title,
                    message: 'Fatal error logging in'
                })
            )
    }
