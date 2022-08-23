import {registerRootComponent} from 'expo'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'

import Main from './components/Main'

// Custom global alert utilizing absolute positioning available on any screen.
import Alert from './components/Alert'
import KeyboardAvoidingWrapper from './components/KeyboardAvoidingWrapper'

const store = createStore(rootReducer, applyMiddleware(thunk))

const App = () => {
    return (
        <Provider store={store}>
            <KeyboardAvoidingWrapper>
                <Main />
            </KeyboardAvoidingWrapper>
            <Alert />
        </Provider>
    )
}

export default registerRootComponent(App)
