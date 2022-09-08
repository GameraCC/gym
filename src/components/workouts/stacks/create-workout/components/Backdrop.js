import {useState, useRef, useCallback, useEffect} from 'react'
import {StyleSheet, View, ScrollView, Pressable, Text} from 'react-native'
import {useSelector} from 'react-redux'
import Animated, {
    useAnimatedStyle,
    interpolate,
    interpolateColor,
    Extrapolate
} from 'react-native-reanimated'
import {useBottomSheet} from '@gorhom/bottom-sheet'
import {useNavigation} from '@react-navigation/native'
import Constants from 'expo-constants'

import CreateWorkoutHeader from './CreateWorkoutHeader'

import {gray, white, black} from '@assets/colors'
import ExerciseItem from './ExerciseItem'

// The backdrop, which is everything except the bottomsheet, must be passed to the bottomsheet as the backdropComponent prop
const Backdrop = props => {
    const {animatedIndex} = props
    const [selectedExercises, setSelectedExercises] = useState([])

    const isAddExerciseRendered = useRef(false)

    // Id of exercise to be added, stored in global redux to avoid passing callbacks between components & wrapping screens in contexts
    const exerciseId = useSelector(state => state.updates.exercise.id)

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
            console.log('added exericse:', exerciseId)
            setSelectedExercises('')
        }
    }, [exerciseId])

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

    const setParts = useCallback(
        (parts, index) => {
            // Create new reference to trigger re-render
            const newExercises = [...selectedExercises]

            // Find the exercise and update it's parts
            const exercise = selectedExercises[index]
            exercise.parts = parts

            // Update the exercise while maintaining its position in the array
            newExercises.splice(i, 1, exercise)

            // Dispatch re-render
            setSelectedExercises(newExercises)
        },
        [selectedExercises]
    )

    const deleteExercise = useCallback(
        index => {
            const newExercises = [...selectedExercises]

            newExercises.splice(index, 1)

            setSelectedExercises(newExercises)
        },
        [selectedExercises]
    )

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
                {selectedExercises.map(({id, parts}, index) => (
                    <ExerciseItem
                        key={id + index}
                        index={index}
                        id={id}
                        parts={parts}
                        setParts={setParts}
                        deleteExercise={deleteExercise}
                    />
                ))}
                {!selectedExercises.length && (
                    <View style={styles.noneContainer}>
                        <Text style={styles.noneText}>No Exercises</Text>
                    </View>
                )}
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

const styles = StyleSheet.create({
    statusBarSafeView: {
        width: '100%',
        height: Constants.statusBarHeight,
        backgroundColor: white
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    exerciseList: {
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

export default Backdrop