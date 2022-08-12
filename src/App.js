import {registerRootComponent} from 'expo'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'

import Main from './components/Main'

const store = createStore(rootReducer, applyMiddleware(thunk))

const App = () => {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    )
}

export default registerRootComponent(App)
