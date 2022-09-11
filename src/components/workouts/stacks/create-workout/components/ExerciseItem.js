import {useState} from 'react'
import {StyleSheet, View, Pressable, Image, Text, TextInput} from 'react-native'

import Images from '@assets/images'
import ExerciseItemPart from './ExerciseItemPart'

import {EXERCISES} from '@assets/static'
import {white, black, gray} from '@assets/colors'
import {
    VALID_EXERCISE_REP_UNITS,
    VALID_EXERCISE_WEIGHT_UNITS
} from '@lib/constraints'
import {TouchableOpacity} from 'react-native-gesture-handler'

/**
 * Updates a part
 *
 * @callback updateExpression
 *
 * @property {Object} part - The part being updated
 * @property {string} value - An updated property's value
 *
 * @returns {Object} The updated part object
 */

/**
 * Updates a nested part by:
 *
 * 1. Creating a new part array
 * 2. Extracting an individual part out of the part array
 * 3. Updating the part from a given updateExpression callback
 * 4. Replacing the old part, maintaining its index, the new part
 *
 * @param {Object} object - The stateful part object
 * @param {number} index - The index of the part to update
 * @param {string} value - A property value to update
 * @param {Function} callback - Update state callback, called with new reference of updated object
 * @param {Function} updateExpression
 *
 * @returns {Function} A callback to update a part given an index and value
 */
const updatePart = (object, callback, updateExpression) => (index, value) => {
    const newParts = [...object]

    let part = object[index]

    part = updateExpression(part, value)

    newParts.splice(index, 1, part)

    callback(newParts)
}

const ExerciseItem = props => {
    const {id, parts, setParts, deleteExercise, note, setNote} = props

    const [isDeleteHighlighted, setDeleteHighlighted] = useState(false)
    const [isAddHighlighted, setAddHighlighted] = useState(false)

    const onPressInDeleteHandler = () => setDeleteHighlighted(false)
    const onPressOutDeleteHandler = () => setDeleteHighlighted(true)
    const onPressDeleteHandler = () => deleteExercise(id)

    const onPressInAddHandler = () => setAddHighlighted(true)
    const onPressOutAddHandler = () => setAddHighlighted(false)
    const onPressAddHandler = () => {
        // Add new part to be rendered
        const part = {
            sets: '0',
            reps: {
                value: '0',
                unit: VALID_EXERCISE_REP_UNITS[0] // Choose first valid unit as default
            },
            weight: {
                value: '0',
                unit: VALID_EXERCISE_WEIGHT_UNITS[0] // Choose first valid unit as default
            }
        }

        setParts([...parts, part])
    }

    const updateWeightValue = updatePart(parts, setParts, (part, value) => ({
        ...part,
        weight: {
            ...part.weight,
            value
        }
    }))

    const updateWeightUnit = updatePart(parts, setParts, (part, unit) => ({
        ...part,
        weight: {
            ...part.weight,
            unit
        }
    }))

    const updateRepsUnit = updatePart(parts, setParts, (part, unit) => ({
        ...part,
        reps: {
            ...part.reps,
            unit
        }
    }))

    const updateRepsValue = updatePart(parts, setParts, (part, value) => {
        return {
            ...part,
            reps: {
                ...part.reps,
                value
            }
        }
    })

    const updateSets = updatePart(parts, setParts, (part, sets) => ({
        ...part,
        sets
    }))

    const deletePart = index => {
        const newParts = [...parts]
        newParts.splice(index, 1)
        setParts(newParts)
    }

    return (
        <View style={[styles.container]}>
            <View style={styles.headerContainer}>
                <Image style={styles.exerciseImage} source={Images[id]} />
                <Text style={styles.exerciseName} numberOfLines={1}>
                    {EXERCISES[id].name}
                </Text>
                <Pressable
                    onPressIn={onPressInDeleteHandler}
                    onPressOut={onPressOutDeleteHandler}
                    onPress={onPressDeleteHandler}
                    style={styles.deleteButton}
                >
                    <Image
                        style={styles.deleteImage}
                        source={
                            isDeleteHighlighted
                                ? Images.DELETE_HIGHLGIHTED
                                : Images.DELETE
                        }
                    />
                </Pressable>
            </View>
            <View
                style={[styles.partsContainer, {height: 48 * parts.length + 1}]}
            >
                {parts.map(
                    (
                        {
                            sets,
                            reps: {value: repsValue, unit: repsUnit},
                            weight: {value: weightValue, unit: weightUnit}
                        },
                        index
                    ) => (
                        <ExerciseItemPart
                            key={index}
                            deletePart={() => deletePart(index)}
                            sets={sets}
                            repsValue={repsValue}
                            repsUnit={repsUnit}
                            weightValue={weightValue}
                            weightUnit={weightUnit}
                            updateSets={updateSets}
                            updateRepsValue={value =>
                                updateRepsValue(index, value)
                            }
                            updateRepsUnit={value =>
                                updateRepsUnit(index, value)
                            }
                            updateWeightValue={value =>
                                updateWeightValue(index, value)
                            }
                            updateWeightUnit={value =>
                                updateWeightUnit(index, value)
                            }
                        />
                    )
                )}
            </View>
            <View style={styles.footerContainer}>
                <View style={styles.noteContainer}>
                    <Text style={styles.noteTitle}>Note</Text>
                    <TextInput
                        style={styles.notesInput}
                        keyboardType="default"
                        placeholder="Add a note"
                        onChangeText={setNote}
                        value={note}
                        autoCapitalize="none"
                        multiline={false}
                        numberOfLines={1}
                        maxLength={32}
                    />
                </View>
                <View style={styles.addPartContainer}>
                    {parts.length < 16 && (
                        <TouchableOpacity
                            style={[
                                styles.addPartButton,
                                isAddHighlighted && styles.addHighlighted
                            ]}
                            onPress={onPressAddHandler}
                            onPressIn={onPressInAddHandler}
                            onPressOut={onPressOutAddHandler}
                        >
                            <Image
                                style={[
                                    styles.addPartImage,
                                    isAddHighlighted && styles.addHighlighted
                                ]}
                                source={Images.ADD_GRAY}
                            />
                            <Text
                                style={[
                                    styles.addPartText,
                                    isAddHighlighted && styles.addHighlighted
                                ]}
                            >
                                Add super set
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: white,
        borderTopWidth: 0.75,
        borderBottomWidth: 0.75,
        borderColor: black
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 4
    },
    exerciseImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    exerciseName: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Helvetica'
    },
    deleteButton: {
        width: 24,
        height: 24
    },
    deleteImage: {
        width: 24,
        height: 24
    },
    partsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 48
    },
    addPartContainer: {},
    addPartButton: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addPartImage: {
        width: 24,
        height: 24
    },
    addPartText: {
        marginLeft: 4,
        color: gray,
        fontFamily: 'Helvetica',
        fontSize: 14
    },
    addHighlighted: {},
    noteContainer: {
        height: '100%',
        flex: 1,
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    noteTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 16,
        marginRight: 8
    },
    notesInput: {
        flex: 0.5,
        fontSize: 12,
        fontFamily: 'Helvetica-Bold'
    }
})

export default ExerciseItem
