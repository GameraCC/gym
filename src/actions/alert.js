import {NEW_ALERT, RESET_ALERT} from './types'

/**
 * Sends a new alert
 *
 * @param {Object} args
 * @param {'error'} args.kind - The kind of alert
 * @param {string} args.title - The title of the alert
 * @param {string} args.message - The message in the alert
 */
const newAlert = ({kind, title, message}) => {
    return {
        type: NEW_ALERT,
        kind,
        title,
        message
    }
}

const resetAlert = () => ({
    type: RESET_ALERT
})

export {newAlert, resetAlert}
