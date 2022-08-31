import {combineReducers} from 'redux'
import session from './session'
import user from './user'
import alert from './alert'
import updates from './updates'

export default combineReducers({
    session,
    user,
    alert,
    updates
})
