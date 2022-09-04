import {useCallback, useEffect} from 'react'
import {registerRootComponent} from 'expo'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'
import {View} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import {fonts} from '@assets/fonts'
import {useFonts} from 'expo-font'

// Custom global alert utilizing absolute positioning available on any screen.
import Alert from './components/Alert'
import Main from './components/Main'

const store = createStore(rootReducer, applyMiddleware(thunk))

// Don't automatically remove splash screen
SplashScreen.preventAutoHideAsync()

const App = () => {
    const [fontsLoaded] = useFonts(fonts)

    // Hide splash screen upon fonts being loaded asynchronously
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync()
        }
        return
    }, [fontsLoaded])

    return (
        <Provider store={store}>
            <StatusBar style="light" />
            <Main />
            <Alert />
        </Provider>
    )
}

export default registerRootComponent(App)
