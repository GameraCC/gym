import React, {useState, useCallback, useRef, useMemo, useEffect} from 'react'
import {
    Keyboard,
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
import {NavigationContainer, useNavigation} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {black, gray, green, white} from '@assets/colors'
import {deleteWorkout, getAllWorkouts} from '../actions/user'
import {Header, EditableHeader} from './Header'
import Animated, {
    FadeInUp,
    FadeOutLeft,
    useAnimatedStyle,
    interpolate,
    interpolateColor,
    Extrapolate
} from 'react-native-reanimated'
import BottomSheet, {useBottomSheet} from '@gorhom/bottom-sheet'
import Images from '@assets/images'
import {EXERCISES} from '@assets/static'
import {light_black, light_white} from '../assets/colors'
import BackButton from './BackButton'
import * as Haptics from 'expo-haptics'
import Carousel from './Carousel'

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

    const handleDeletePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        dispatch(deleteWorkout(name))
    }

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
    const navigation = useNavigation()

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
                <ListedWorkoutHeader />
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
    const {onSave} = props

    const [title, setTitle] = useState('Add a title')
    const [description, setDescription] = useState('Add a description')

    const navigation = useNavigation()

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

const ExerciseBottomSheetHeader = props => {
    const {name} = props
    const navigation = useNavigation()

    return (
        <View style={styles.bottomSheetHeader}>
            <BackButton
                style={{container: styles.bottomSheetHeaderBackButton}}
                navigation={navigation}
            />
            <Text style={styles.bottomSheetHeaderTitle}>{name}</Text>
        </View>
    )
}

const ExerciseBottomSheetInfo = props => {
    const {
        route: {
            params: {categories, id, name, instructions, tips}
        }
    } = props

    const description = `Standing shoulder presses are better for functional strength and for people who do CrossFit, powerlifting, weightlifting, or Strongman. Seated shoulder presses are better for hypertrophy because they isolate the shoulders more. They're also a better option for people who haven't yet built up a lot of core strength`

    const styles = {
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: white
        },
        infoContainer: {
            padding: 8,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
        },
        seperatorContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        seperator: {
            marginTop: 12,
            marginBottom: 12,
            backgroundColor: black,
            width: '90%',
            height: 1
        },
        exerciseImage: {
            resizeMode: 'contain',
            width: 148,
            height: 148,
            marginRight: 16
        },
        exerciseDescriptionContainer: {
            height: 176,
            flex: 1
        },
        exerciseDescription: {
            marginRight: 16,
            fontSize: 14
        },
        instructionContainer: {
            padding: 8
        },
        instructionTitle: {
            width: '100%',
            marginLeft: 24,
            textAlign: 'left',
            fontFamily: 'Helvetica-Bold',
            fontSize: 14
        },
        instructionsContainer: {
            marginTop: 12,
            marginRight: 24,
            marginLeft: 24
        },
        instructionTextContainer: {
            marginTop: 4,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        instructionIndex: {
            fontFamily: 'Helvetica-Bold',
            fontSize: 16
        },
        instructionValue: {
            marginLeft: 16,
            width: '100%',
            textAlign: 'left',
            fontSize: 14
        },
        tipContainer: {
            width: '100%',
            padding: 8
        },
        tipTitle: {
            width: '100%',
            fontSize: 14,
            fontFamily: 'Helvetica-Bold',
            textAlign: 'center'
        },
        tipTextContainer: {
            marginLeft: 24,
            marginRight: 24
        },
        tip: {
            textAlign: 'center'
        },
        demonstrationContainer: {
            padding: 8,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        demonstrationTitle: {
            width: '100%',
            marginBottom: 16,
            fontSize: 14,
            fontFamily: 'Helvetica-Bold',
            textAlign: 'center'
        },
        demonstrationImage: {
            marginLeft: 24,
            marginRight: 24,
            resizeMode: 'cover'
        }
    }

    const Tip = ({data: tip}) => {
        return (
            <View style={styles.tipTextContainer}>
                <Text style={styles.tip} numberOfLines={2}>
                    {tip}
                </Text>
            </View>
        )
    }

    const Seperator = () => (
        <View style={styles.seperatorContainer}>
            <View style={styles.seperator} />
        </View>
    )

    const Instruction = props => {
        const {index, instruction} = props

        return (
            <View style={styles.instructionTextContainer}>
                <Text style={styles.instructionIndex}>{index}</Text>
                <Text style={styles.instructionValue} numberOfLines={3}>
                    {instruction}
                </Text>
            </View>
        )
    }

    // Display info sheet
    return (
        <>
            <ExerciseBottomSheetHeader name={name} />
            <ScrollView bounces={true} style={styles.container}>
                <View style={styles.infoContainer}>
                    <Image style={styles.exerciseImage} source={Images[id]} />
                    <View style={styles.exerciseDescriptionContainer}>
                        <Text style={styles.exerciseDescription}>
                            {description}
                        </Text>
                    </View>
                </View>
                <Seperator />
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionTitle}>Instructions</Text>
                    <View style={styles.instructionsContainer}>
                        {instructions.map((instruction, i) => (
                            <Instruction
                                index={i + 1}
                                instruction={instruction}
                            />
                        ))}
                    </View>
                </View>
                <Seperator />
                <View style={styles.tipContainer}>
                    <Text style={styles.tipTitle}>Tips</Text>
                    <Carousel data={tips} Item={Tip} />
                </View>
                <Seperator />
                <View style={styles.demonstrationContainer}>
                    <Text style={styles.demonstrationTitle}>Demonstration</Text>
                    <Image
                        style={styles.demonstrationImage}
                        source={Images[id]}
                    />
                </View>
            </ScrollView>
        </>
    )
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
    const {
        id,
        categories,
        name,
        description,
        instructions,
        tips,
        handleItemClick,
        firstItem,
        lastItem
    } = props
    const [highlighted, setHighlighted] = useState(false)

    const handlePressIn = () => setHighlighted(true)
    const handlePressOut = () => setHighlighted(false)
    const handlePress = () =>
        handleItemClick({id, categories, name, description, instructions, tips})

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

const ExerciseBottomSheetList = props => {
    const [input, setInput] = useState('')
    const [filteredExercises, setFilteredExercises] = useState(
        EXERCISE_SECTIONED_DATA
    )

    const navigation = useNavigation()
    const {expand} = useBottomSheet()

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

    const handleItemClick = useCallback(
        ({id, categories, name, description, instructions, tips}) => {
            // Dismiss keyboard if present
            Keyboard.dismiss()

            // Navigate to info screen with id, categories, name & description
            const props = {
                id,
                categories,
                name,
                description,
                instructions,
                tips
            }

            navigation.navigate('exercise-info', props)
        },
        []
    )

    const Seperator = () => <View style={styles.exerciseBottomSheetSeperator} />

    return (
        <View style={styles.bottomSheetContainer}>
            <View style={styles.exerciseBottomSheetSearchContainer}>
                <Image
                    style={styles.exerciseBottomSheetSearchIcon}
                    source={Images.SEARCH}
                />
                <TextInput
                    style={styles.exerciseBottomSheetSearch}
                    keyboardType="default"
                    placeholder="Search Exercises"
                    onChangeText={setInput}
                    value={input}
                    autoCapitalize="none"
                    multiline={false}
                    numberOfLines={1}
                    onFocus={handleKeyboardFocus}
                ></TextInput>
            </View>
            <Seperator />
            <SectionList
                style={styles.exerciseBottomSheetList}
                sections={filteredExercises}
                renderItem={({
                    item: {
                        id,
                        categories,
                        name,
                        description,
                        instructions,
                        tips
                    },
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
                            instructions={instructions}
                            tips={tips}
                            firstItem={firstItem}
                            lastItem={lastItem}
                            handleItemClick={handleItemClick}
                        />
                    )
                }}
                renderSectionHeader={({section: {title}}) => {
                    return <ExerciseBottomSheetSection title={title} />
                }}
                CellRendererComponent={ExerciseBottomSheetItemContainer} // Wrap item with this component
                stickySectionHeadersEnabled={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
            ></SectionList>
        </View>
    )
}

// The backdrop, which is everything except the bottomsheet, must be passed to the bottomsheet as the backdropComponent prop
const ExerciseBottomSheetBackdropComponent = props => {
    const {animatedIndex, routeName} = props
    const [selectedExercises, setSelectedExercises] = useState([])

    const isAddExerciseRendered = useRef(false)

    // Name of exercise to be added, stored in global redux to avoid passing callbacks between components & wrapping screens in contexts
    const exerciseName = useSelector(state => state.updates.exercise.name)

    const bottomSheetRef = useBottomSheet()
    const navigation = useNavigation()

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

    const opacity = useAnimatedStyle(() => {
        const style = {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: animatedIndex.value === 0 ? 0 : '100%',
            height: animatedIndex.value === 0 ? 0 : '100%',
            backgroundColor: interpolateColor(
                animatedIndex.value,
                [0, 2],
                [white, black]
            ),
            opacity: interpolate(
                animatedIndex.value,
                [0, 1, 2],
                [0, 0.5, 0.6],
                Extrapolate.CLAMP
            )
        }

        return style
    })

    const handleOpacityPress = () => bottomSheetRef.collapse()

    return (
        <>
            <View style={styles.statusBarSafeView} />
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                style={styles.container}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
            >
                <CreateWorkoutHeader navigation={navigation} onSave={onSave} />
                <View style={styles.noneContainer}>
                    <Text style={styles.noneText}>No Exercises</Text>
                </View>
            </ScrollView>
            <Animated.View style={opacity}>
                <Pressable
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    onPress={handleOpacityPress}
                />
            </Animated.View>
        </>
    )
}

const ExerciseBottomSheet = props => {
    const {backdropComponent} = props

    const routeName = useRef(null)
    const navigationRef = useRef(null)

    const snapPoints = useMemo(() => ['10%', '35%', '65%'], [])

    // Reset navigation on bottomsheet back to exercise list if not already on exercise list upon collapse
    const onChangeIndex = useCallback(index => {
        if (index === 0 && routeName.current !== 'exercise-list') {
            navigationRef.current.reset({
                index: 0,
                routes: [{name: 'exercise-list'}]
            })
        }
    })

    return (
        <BottomSheet
            index={0}
            snapPoints={snapPoints}
            backdropComponent={backdropComponent}
            onChange={onChangeIndex}
        >
            <NavigationContainer
                independent={true}
                onStateChange={state =>
                    (routeName.current =
                        state.routes[state.routes.length - 1].name)
                }
                ref={navigationRef}
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
                        options={{headerShown: false}}
                    ></BottomSheetStack.Screen>
                </BottomSheetStack.Navigator>
            </NavigationContainer>
        </BottomSheet>
    )
}

const CreateWorkout = props => {
    return (
        <ExerciseBottomSheet
            backdropComponent={ExerciseBottomSheetBackdropComponent}
        />
    )
}

const Workouts = props => {
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
    backdropContainer: {
        backgroundColor: black
    },
    bottomSheetContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    exerciseBottomSheetSearchContainer: {
        overflow: 'hidden',
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        borderColor: black,
        borderWidth: 0.75,
        backgroundColor: light_white
    },
    exerciseBottomSheetSearchIcon: {
        marginLeft: 8,
        marginRight: 8,
        width: 24,
        height: '50%',
        resizeMode: 'contain'
    },
    exerciseBottomSheetSearch: {
        flex: 1,
        marginRight: 16,
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
        height: 20,
        resizeMode: 'contain'
    },
    exerciseBottomSheetItemHighlighted: {
        backgroundColor: light_black,
        color: light_white
    },
    bottomSheetHeader: {
        width: '100%',
        height: 48,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    bottomSheetHeaderTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 16
    },
    bottomSheetHeaderBackButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        position: 'absolute',
        left: 20
    },
    exerciseBottomSheetInfo: {}
})

export default Workouts
