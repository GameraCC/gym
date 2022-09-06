import {useSelector} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import Home from '../home'
import Login from '../auth/login/Login'
import {SignupMetadata, SignupNames, SignupLocation} from '../auth/signup'

import BackButton from '@shared/BackButton'
import Workouts from '../workouts'

import TabBar from './components/TabBar'
import {white} from '@assets/colors'
import Images from '@assets/images'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const Main = props => {
    const isValid = useSelector(state => state.session.valid)

    return (
        <NavigationContainer>
            {isValid ? (
                <Tab.Navigator
                    screenOptions={{headerShown: false}}
                    tabBar={props => <TabBar {...props} />}
                >
                    <Tab.Screen
                        name="home"
                        component={Home}
                        title="Home"
                        options={{
                            image: Images.HOME,
                            imageHighlighted: Images.HOME_HIGHLIGHTED
                        }}
                    />
                    <Tab.Screen
                        name="workouts"
                        component={Workouts}
                        options={{
                            image: Images.HOME,
                            imageHighlighted: Images.HOME_HIGHLIGHTED
                        }}
                    />
                </Tab.Navigator>
            ) : (
                <Stack.Navigator
                    screenOptions={({navigation}) => ({
                        headerStyle: {
                            backgroundColor: white
                        },
                        headerLeft: ({canGoBack}) =>
                            canGoBack ? <BackButton /> : null
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
