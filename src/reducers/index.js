import {combineReducers} from 'redux'
import session from './session'
import user from './user'
import alert from './alert'

export default combineReducers({
    session,
    user,
    alert
})
