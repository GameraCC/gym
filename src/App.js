import {registerRootComponent} from 'expo'
import {StyleSheet, View, SafeAreaView} from 'react-native'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers'
import Login from './components/Login'
import thunk from 'redux-thunk'
import {NavigationContainer} from '@react-navigation/native'

const store = createStore(rootReducer, applyMiddleware(thunk))

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <View styles={styles.container}>
                    <Login />
                </View>
            </NavigationContainer>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    }
})

export default registerRootComponent(App)
