import {registerRootComponent} from 'expo'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'
import {StatusBar} from 'expo-status-bar'

import Main from './components/Main'

// Custom global alert utilizing absolute positioning available on any screen.
import Alert from './components/Alert'

const store = createStore(rootReducer, applyMiddleware(thunk))

const App = () => {
    return (
        <Provider store={store}>
            <StatusBar style="light" />
            <Main />
            <Alert />
        </Provider>
    )
}

export default registerRootComponent(App)
