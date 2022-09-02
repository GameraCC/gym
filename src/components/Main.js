import {
    View,
    StyleSheet,
    Pressable,
    Image,
    TouchableOpacity
} from 'react-native'
import {useSelector} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import * as Haptics from 'expo-haptics'

import Home from './Home'
import Login from './Login'
import BackButton from './BackButton'
import {SignupMetadata, SignupNames, SignupLocation} from './Signup'
import Workouts from './Workouts'
import {white} from '@assets/colors'
import Images from '@assets/images'
import {gray} from '../assets/colors'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabItem = props => {
    const {onPress, onLongPress, isFocused, image, imageHighlighted} = props

    return (
        <TouchableOpacity
            style={styles.tabBarItemContainer}
            onLongPress={onLongPress}
            onPress={onPress}
        >
            <Image
                style={styles.tabBarItemImage}
                source={isFocused ? imageHighlighted : image}
            ></Image>
        </TouchableOpacity>
    )
}

const TabBar = props => {
    const {state, descriptors, navigation} = props

    const onPress = ({key, name, isFocused}) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

        const event = navigation.emit({
            type: 'tabPress',
            target: key,
            canPreventDefault: true
        })

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({name: name, merge: true})
        }
    }

    const onLongPress = ({key}) =>
        navigation.emit({
            type: 'tabLongPress',
            target: key
        })

    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key]
                const isFocused = state.index === index

                return (
                    <TabItem
                        key={route.key}
                        isFocused={isFocused}
                        onLongPress={() => onLongPress(route)}
                        onPress={() => onPress({...route, isFocused})}
                        image={options.image}
                        imageHighlighted={options.imageHighlighted}
                    />
                )
            })}
        </View>
    )
}

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

const styles = StyleSheet.create({
    tabBarContainer: {
        width: '100%',
        paddingBottom: 20,
        paddingTop: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',

        borderTopColor: gray,
        borderTopWidth: 1
    },
    tabBarItemContainer: {
        width: 64,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48
    },
    tabBarItemImage: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    }
})

export default Main
