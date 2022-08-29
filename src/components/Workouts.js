import {useState} from 'react'
import {
    RefreshControl,
    TouchableOpacity,
    StyleSheet,
    View,
    Pressable,
    Text,
    ScrollView,
    Image
} from 'react-native'
import Constants from 'expo-constants'
import {useSelector, useDispatch} from 'react-redux'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {black, gray, green, white} from './colors'
import {deleteWorkout, getAllWorkouts} from '../actions/user'
import {Header, EditableHeader} from './Header'

const Stack = createNativeStackNavigator()

/**
 * Generates a date string given a UNIX timestamp
 *
 * If the iat is less than 24 hours old:
 *  - The date string contains hour, minute, and meridian (AM/PM)
 *
 * If the iat is greater 24 hours old and less than 1 year old:
 *  - The date string contains month, day, hour, minute and meridian (AM/PM)
 *
 * If the iat is older than 1 year:
 *  - The date string contains year, month, day, hour, minute and meridian (AM/PM)
 *
 * @param {number} iat
 * @returns {string} Formatted date string to display
 */
const generateDateString = iat => {
    const current = Date.now()

    let date
    if (current - iat < 86400000) {
        date = new Date(iat).toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: 'numeric'
        })
    } else if (current - iat > 86400000 && current - iat < 31536000000) {
        date = new Date(iat).toLocaleTimeString(undefined, {
            day: 'numeric',
            month: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        })
    } else {
        date = new Date(iat).toLocaleTimeString(undefined, {
            year: 'numeric',
            day: 'numeric',
            month: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        })
    }

    return date
}

const Workout = params => {
    const {name, iat, onPress} = params
    const [isHighlighted, setHighlighted] = useState(false)
    const [deleteHighlighted, setDeleteHighlighted] = useState(false)

    const dispatch = useDispatch()

    const handleWorkoutPressIn = () => setHighlighted(true)
    const handleWorkoutPressOut = () => setHighlighted(false)
    const handleDeletePressIn = () => setDeleteHighlighted(true)
    const handleDeletePressOut = () => setDeleteHighlighted(false)

    const handleDeletePress = () => dispatch(deleteWorkout(name))

    return (
        <Pressable
            style={[
                styles.workoutButton,
                isHighlighted && styles.workoutButtonHighlighted
            ]}
            onPressIn={handleWorkoutPressIn}
            onPressOut={handleWorkoutPressOut}
            onPress={onPress}
        >
            <View>
                <Text
                    style={[
                        styles.workoutName,
                        isHighlighted && styles.workoutButtonHighlighted
                    ]}
                    numberOfLines={1}
                >
                    {name}
                </Text>
                <Text
                    style={[
                        styles.workoutDate,
                        isHighlighted && styles.workoutButtonHighlighted
                    ]}
                    numberOfLines={1}
                >
                    {generateDateString(iat)}
                </Text>
            </View>
            <View style={styles.workoutDeleteButton}>
                <TouchableOpacity
                    onPress={handleDeletePress}
                    onPressIn={handleDeletePressIn}
                    onPressOut={handleDeletePressOut}
                >
                    <Image
                        style={styles.workoutDeleteIcon}
                        source={
                            deleteHighlighted
                                ? require('../assets/icons/delete-highlighted.png')
                                : require('../assets/icons/delete.png')
                        }
                        resizeMode="center"
                    />
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}

const ListedWorkoutHeader = params => {
    const {navigation} = params

    const buttonStyle = {
        backgroundColor: green,
        borderColor: green
    }

    const buttonTextStyle = {
        color: white
    }

    const buttonHighlightedStyle = {
        backgroundColor: black,
        borderColor: black
    }

    const buttonCallback = () => navigation.navigate('create-workout')

    return (
        <Header
            canGoBack={false}
            navigation={navigation}
            title="Workouts"
            description="View your workouts"
            buttonTitle="Create"
            buttonStyle={buttonStyle}
            buttonTextStyle={buttonTextStyle}
            buttonHighlightedStyle={buttonHighlightedStyle}
            buttonCallback={buttonCallback}
        />
    )
}

const ListedWorkouts = params => {
    const {navigation} = params

    const dispatch = useDispatch()
    const workouts = useSelector(state => state.user.workouts)
    const isRefreshing = useSelector(state => state.user.isRefreshing)

    const handleWorkoutPress = () => {
        // navigate to workout screen with params to customize screen
        console.log('work out pressed')
    }

    const handleRefresh = () => dispatch(getAllWorkouts())

    return (
        <>
            <View style={styles.statusBarSafeView} />
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <ListedWorkoutHeader navigation={navigation} />
                {workouts.length ? (
                    workouts.map(({name, iat}) => (
                        <Workout
                            key={name + iat}
                            name={name}
                            iat={iat}
                            onPress={handleWorkoutPress}
                        />
                    ))
                ) : (
                    <View style={styles.noneContainer}>
                        <Text style={styles.noneText}>No Workouts</Text>
                    </View>
                )}
            </ScrollView>
        </>
    )
}

const CreateWorkoutHeader = params => {
    const {navigation, onSave} = params

    const [title, setTitle] = useState('Add a title')
    const [description, setDescription] = useState('Add a description')

    const buttonStyle = {
        backgroundColor: green,
        borderColor: green
    }

    const buttonTextStyle = {
        color: white
    }

    const buttonHighlightedStyle = {
        backgroundColor: black,
        borderColor: black
    }

    return (
        <EditableHeader
            canGoBack={true}
            navigation={navigation}
            title={title}
            titleInputCallback={setTitle}
            description={description}
            descriptionInputCallback={setDescription}
            buttonTitle="Save"
            buttonStyle={buttonStyle}
            buttonTextStyle={buttonTextStyle}
            buttonHighlightedStyle={buttonHighlightedStyle}
            buttonCallback={onSave}
        />
    )
}

const CreateWorkout = params => {
    const {navigation} = params

    const onSave = () => {
        console.log('saved workout')
        // send request to create workout
    }

    return (
        <>
            <View style={styles.statusBarSafeView} />
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                style={styles.container}
            >
                <CreateWorkoutHeader navigation={navigation} onSave={onSave} />
                <View style={styles.noneContainer}>
                    <Text style={styles.noneText}>No Exercises</Text>
                </View>
            </ScrollView>
        </>
    )
}

const Workouts = () => {
    return (
        <Stack.Navigator
            screenOptions={({navigation}) => ({
                title: 'Gym',
                headerShown: false
            })}
        >
            <Stack.Screen
                name="listed-workouts"
                component={ListedWorkouts}
            ></Stack.Screen>
            <Stack.Screen
                name="create-workout"
                component={CreateWorkout}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    statusBarSafeView: {
        width: '100%',
        height: Constants.statusBarHeight,
        backgroundColor: white
    },
    home: {
        width: '100%',
        height: '100%'
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    workoutButton: {
        width: '100%',
        padding: 32,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: black,
        borderTopWidth: 0.75
    },
    workoutButtonHighlighted: {
        backgroundColor: black,
        color: white
    },
    workoutName: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 20
    },
    workoutDate: {
        marginTop: 8,
        fontSize: 15.5,
        color: gray
    },
    workoutDeleteButton: {
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 2,
        width: 24,
        height: 32
    },
    workoutDeleteIcon: {
        resizeMode: 'center',
        width: '100%',
        height: '100%'
    },
    noneContainer: {
        width: '100%',
        height: '75%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noneText: {
        color: gray,
        fontFamily: 'Helvetica',
        fontSize: 20
    }
})

export default Workouts
