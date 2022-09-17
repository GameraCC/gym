import {combineReducers} from 'redux'
import session from './session'
import user from './user'
import alert from './alert'
import updates from './updates'
import keyboard from './keyboard'

export default combineReducers({
    session,
    user,
    alert,
    updates,
    keyboard
})
