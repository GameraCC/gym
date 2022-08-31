import {useState, useCallback, useRef, useMemo, useEffect} from 'react'
import {
    Platform,
    RefreshControl,
    TouchableOpacity,
    StyleSheet,
    View,
    Pressable,
    Text,
    ScrollView,
    Image,
    TextInput,
    SectionList
} from 'react-native'
import Constants from 'expo-constants'
import {useSelector, useDispatch} from 'react-redux'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {black, gray, green, white} from '@assets/colors'
import {deleteWorkout, getAllWorkouts} from '../actions/user'
import {Header, EditableHeader} from './Header'
import Animated, {FadeInUp, FadeOutLeft} from 'react-native-reanimated'
import BottomSheet, {useBottomSheet} from '@gorhom/bottom-sheet'
import Images from '@assets/images'
import {EXERCISES} from '@assets/static'
import {light_black, light_white} from '../assets/colors'

const Stack = createNativeStackNavigator()
const BottomSheetStack = new createNativeStackNavigator()

// Load exercises into SectionList section data prop format
const EXERCISE_SECTIONED_DATA = Object.keys(EXERCISES).reduce((acc, key) => {
    const exercise = EXERCISES[key]

    exercise.categories.simple.forEach(category => {
        const found = acc.find(({title}) => title === category)

        if (found) {
            found.data.push({id: key, ...exercise})
        } else {
            acc.push({
                title: category,
                data: [{id: key, ...exercise}]
            })
        }
    })

    return acc
}, [])

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

const Workout = props => {
    const {name, iat, onPress} = props
    const [isHighlighted, setHighlighted] = useState(false)
    const [deleteHighlighted, setDeleteHighlighted] = useState(false)

    const dispatch = useDispatch()

    const handleWorkoutPressIn = () => setHighlighted(true)
    const handleWorkoutPressOut = () => setHighlighted(false)
    const handleDeletePressIn = () => setDeleteHighlighted(true)
    const handleDeletePressOut = () => setDeleteHighlighted(false)

    const handleDeletePress = () => dispatch(deleteWorkout(name))

    return (
        <Animated.View
            entering={FadeInUp}
            exiting={FadeOutLeft.duration(500)}
            style={{
                backgroundColor: white
            }}
        >
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
                                    ? Images.DELETE_HIGHLIGHTED
                                    : Images.DELETE
                            }
                            resizeMode="center"
                        />
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Animated.View>
    )
}

const ListedWorkoutHeader = props => {
    const {navigation} = props

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

const ListedWorkouts = props => {
    const {navigation} = props

    const dispatch = useDispatch()
    const workouts = useSelector(state => state.user.workouts)
    const isRefreshing = useSelector(state => state.user.isRefreshing)

    const handleWorkoutPress = () => {
        // navigate to workout screen with props to customize screen
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

const CreateWorkoutHeader = props => {
    const {navigation, onSave} = props

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

    const _onSave = useCallback(() => onSave(title, description), [])

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
            buttonCallback={_onSave}
        />
    )
}

const ExerciseBottomSheetInfo = props => {
    const {name} = props

    // Display info sheet
    return <View>{name}</View>
}

const ExerciseBottomSheetSection = props => {
    const {title} = props

    return (
        <View style={styles.exerciseBottomSheetSection}>
            <Text style={styles.exerciseBottomSheetSectionName}>{title}</Text>
        </View>
    )
}

/**
 * Wraps the SectionList item to enable style application on the parent container, specifically a shadow
 */
const ExerciseBottomSheetItemContainer = props => {
    const {children, ...otherProps} = props

    // A section's item property has a nested data property
    const isSection = otherProps.item.hasOwnProperty('data')

    return (
        <View
            {...otherProps}
            style={[
                isSection
                    ? styles.exerciseBottomSheetSectionContainer
                    : styles.exerciseBottomSheetItemContainer
            ]}
        >
            {children}
        </View>
    )
}

const ExerciseBottomSheetItem = props => {
    const {id, categories, name, description, firstItem, lastItem} = props
    const [highlighted, setHighlighted] = useState(false)

    const handlePressIn = () => setHighlighted(true)
    const handlePressOut = () => setHighlighted(false)
    const handlePress = () => {
        // navigate to info screen with id, categories, name & description
        const props = {
            id,
            categories,
            name,
            description
        }
    }

    return (
        <View
            style={[
                styles.exerciseBottomSheetItem,
                firstItem && styles.exerciseBottomSheetFirstItem,
                lastItem && styles.exerciseBottomSheetLastItem
            ]}
        >
            <Pressable
                style={[
                    styles.exerciseBottomSheetItemButton,
                    highlighted && styles.exerciseBottomSheetItemHighlighted
                ]}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Image
                    style={styles.exerciseBottomSheetItemImage}
                    source={Images[id]}
                ></Image>
                <Text
                    style={[
                        styles.exerciseBottomSheetItemName,
                        highlighted && styles.exerciseBottomSheetItemHighlighted
                    ]}
                    numberOfLines={1}
                >
                    {name}
                </Text>
                <Image
                    style={styles.exerciseBottomSheetItemExpand}
                    source={
                        highlighted
                            ? Images.FORWARD_WHITE
                            : Images.FORWARD_BLACK
                    }
                ></Image>
            </Pressable>
        </View>
    )
}

const ExerciseBottomSheetList = () => {
    const [input, setInput] = useState('')

    const {expand} = useBottomSheet()

    const [filteredExercises, setFilteredExercises] = useState(
        EXERCISE_SECTIONED_DATA
    )

    useEffect(() => {
        const filtered = EXERCISE_SECTIONED_DATA.reduce((acc, section) => {
            const results = section.data.filter(({name}) =>
                name.toLowerCase().includes(input.toLowerCase())
            )

            if (results.length) acc.push({...section, data: results})

            return acc
        }, [])

        setFilteredExercises(filtered)
    }, [input])

    const handleKeyboardFocus = () => expand()

    const Seperator = () => <View style={styles.exerciseBottomSheetSeperator} />

    return (
        <View style={styles.bottomSheetContainer}>
            <TextInput
                style={styles.exerciseBottomSheetSearch}
                keyboardType="default"
                placeholder="Search for an exercise"
                onChangeText={setInput}
                value={input}
                autoCapitalize="none"
                multiline={false}
                numberOfLines={1}
                onFocus={handleKeyboardFocus}
            ></TextInput>
            <Seperator />
            <SectionList
                style={styles.exerciseBottomSheetList}
                sections={filteredExercises}
                renderItem={({
                    item: {id, categories, name, description},
                    index,
                    section: {title}
                }) => {
                    const sectionLength = filteredExercises.find(
                        ({title: _title}) => _title === title
                    ).data.length

                    const firstItem = index === 0
                    const lastItem = index === sectionLength - 1

                    return (
                        <ExerciseBottomSheetItem
                            key={id + title}
                            id={id}
                            name={name}
                            description={description}
                            categories={categories}
                            firstItem={firstItem}
                            lastItem={lastItem}
                        />
                    )
                }}
                renderSectionHeader={({section: {title}}) => {
                    return <ExerciseBottomSheetSection title={title} />
                }}
                CellRendererComponent={ExerciseBottomSheetItemContainer} // Wrap item with this component
                stickySectionHeadersEnabled={false}
            ></SectionList>
        </View>
    )
}

const ExerciseBottomSheet = props => {
    const {backdropComponent} = props

    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['10%', '35%', '65%'], [])

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={backdropComponent}
        >
            <BottomSheetStack.Navigator
                screenOptions={{
                    title: 'Add Exercise'
                }}
            >
                <BottomSheetStack.Screen
                    name="exercise-list"
                    component={ExerciseBottomSheetList}
                    title="Exercises"
                    options={{headerShown: false}}
                />
                <BottomSheetStack.Screen
                    name="exercise-info"
                    component={ExerciseBottomSheetInfo}
                    title="Exercise Info"
                ></BottomSheetStack.Screen>
            </BottomSheetStack.Navigator>
        </BottomSheet>
    )
}

const CreateWorkout = props => {
    const {navigation} = props

    const [selectedExercises, setSelectedExercises] = useState([])

    // Name of exercise to be added, stored in global redux to avoid passing callbacks between components & wrapping screens in contexts
    const exerciseName = useSelector(state => state.updates.exercise.name)
    const isAddExerciseRendered = useRef(false)

    const onSave = useCallback(({title, description}) => {
        // validate constraints on inputs
        // send on save request
        console.log('saved')
    }, [])

    // Add a new exercise
    useEffect(() => {
        // Don't run on first mount
        if (!isAddExerciseRendered.current) isAddExerciseRendered.current = true
        else {
            // exerciseName
            setSelectedExercises('')
        }
    }, [exerciseName])

    // The backdrop, which is everything except the bottomsheet, must be passed to the bottomsheet as the backdropComponent prop
    const BackdropComponent = () => (
        <View>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                style={styles.container}
            >
                <CreateWorkoutHeader navigation={navigation} onSave={onSave} />
                <View style={styles.noneContainer}>
                    <Text style={styles.noneText}>No Exercises</Text>
                </View>
            </ScrollView>
        </View>
    )

    return (
        <>
            <View style={styles.statusBarSafeView} />
            <ExerciseBottomSheet backdropComponent={BackdropComponent} />
        </>
    )
}

const Workouts = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                title: 'Gym',
                headerShown: false
            }}
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
        fontFamily: 'Helvetica',
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
    },
    bottomSheetContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    exerciseBottomSheetSearch: {
        fontFamily: 'Helvetica',
        height: 36,
        marginTop: 4,
        marginRight: 8,
        marginLeft: 8,
        marginBottom: 24,
        textAlign: 'left',
        paddingLeft: 16,

        borderRadius: 4,
        borderColor: black,
        borderWidth: 1,

        ...(Platform.OS === 'ios' ? {paddingVertical: 10} : {}) // Required on IOS to prevent textInput with numberOfLines={1} from wrapping. Ellipses are not added to the end with this solution
    },
    exerciseBottomSheetSeperator: {
        width: '100%',
        height: 0.5,
        backgroundColor: black
    },
    exerciseBottomSheetList: {
        width: '100%',
        height: '100%'
    },
    exerciseBottomSheetSection: {
        marginTop: 32,
        marginBottom: 16,
        marginRight: 16,
        marginLeft: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    exerciseBottomSheetSectionName: {
        color: gray,
        fontFamily: 'Helvetica',
        fontSize: 14.5,
        textAlign: 'left'
    },
    exerciseBottomSheetItemContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4
    },
    exerciseBottomSheetSectionContainer: {},
    exerciseBottomSheetItem: {
        overflow: 'hidden',
        height: 64,
        marginRight: 16,
        marginLeft: 16
    },
    exerciseBottomSheetFirstItem: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    },
    exerciseBottomSheetLastItem: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    exerciseBottomSheetItemButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    exerciseBottomSheetItemImage: {
        width: 48,
        height: 48,
        marginLeft: 8,
        borderRadius: 8,
        resizeMode: 'cover'
    },
    exerciseBottomSheetItemName: {
        fontFamily: 'Helvetica',
        marginLeft: 8,
        color: black,
        fontSize: 18
    },
    exerciseBottomSheetItemExpand: {
        marginLeft: 'auto',
        marginRight: 16,
        width: 20,
        height: 20
    },
    exerciseBottomSheetItemHighlighted: {
        backgroundColor: light_black,
        color: light_white
    }
})

export default Workouts
