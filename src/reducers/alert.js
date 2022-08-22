import {NEW_ALERT, RESET_ALERT} from '../actions/types'

const initialState = {
    isVisible: false,
    title: '',
    message: '',
    kind: ''
}

const alert = (state = initialState, action) => {
    switch (action.type) {
        case NEW_ALERT:
            state = {
                isVisible: true,
                title: action.title,
                message: action.message,
                kind: action.kind
            }
            break
        case RESET_ALERT:
            state = {
                ...initialState
            }
            break
        default:
            break
    }

    return state
}

export default alert
