import {useSelector} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import Home from './Home'
import Login from './Login'
import {SignupMetadata, SignupNames, SignupLocation} from './Signup'

const Stack = createNativeStackNavigator()

const Main = () => {
    const isValid = useSelector(state => state.session.valid)

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isValid ? (
                    <>
                        <Stack.Screen
                            name="home"
                            component={Home}
                            options={{title: 'Home'}}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="login"
                            component={Login}
                            options={{title: 'Login'}}
                        />
                        <Stack.Screen
                            name="signup-metadata"
                            component={SignupMetadata}
                            options={{title: 'Signup'}}
                        />
                        <Stack.Screen
                            name="signup-names"
                            component={SignupNames}
                            options={{title: 'Signup'}}
                        />
                        <Stack.Screen
                            name="signup-location"
                            component={SignupLocation}
                            options={{title: 'Signup'}}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Main
