import {useSelector} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import Home from './Home'
import Login from './Login'
import BackButton from './BackButton'
import {SignupMetadata, SignupNames, SignupLocation} from './Signup'
import Workouts from './Workouts'
import {white} from '@assets/colors'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const Main = () => {
    const isValid = useSelector(state => state.session.valid)

    return (
        <NavigationContainer>
            {isValid ? (
                <Tab.Navigator screenOptions={{headerShown: false}}>
                    <Tab.Screen
                        name="home"
                        component={Home}
                        title="Home"
                        options={{title: 'Home'}}
                    />
                    <Tab.Screen
                        name="workouts"
                        component={Workouts}
                        options={{title: 'Workouts'}}
                    />
                </Tab.Navigator>
            ) : (
                <Stack.Navigator
                    screenOptions={({navigation}) => ({
                        headerStyle: {
                            backgroundColor: white
                        },
                        headerLeft: ({canGoBack}) =>
                            canGoBack ? (
                                <BackButton navigation={navigation} />
                            ) : null
                    })}
                >
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
                </Stack.Navigator>
            )}
        </NavigationContainer>
    )
}

export default Main
