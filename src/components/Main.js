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
                <Stack.Screen
                    name="signup-location"
                    component={SignupLocation}
                />
                {/* {isValid ? (
                    <>
                        <Stack.Screen name="home" component={Home} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="login" component={Login} />
                        <Stack.Screen
                            name="signup-metadata"
                            component={SignupMetadata}
                        />
                        <Stack.Screen
                            name="signup-names"
                            component={SignupNames}
                        />
                        <Stack.Screen
                            name="signup-location"
                            component={SignupLocation}
                        />
                    </>
                )} */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Main
