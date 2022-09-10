import {useState} from 'react'
import {StyleSheet, View, Pressable, Image, Text} from 'react-native'

import Images from '@assets/images'
import {
    VALID_EXERCISE_REP_UNITS,
    VALID_EXERCISE_WEIGHT_UNITS
} from '@lib/constraints'

import ExerciseItemPart from './ExerciseItemPart'

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
    const {id, parts, setParts, deleteExercise} = props

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
        const newParts = [...object]
        newParts.splice(index, 1)
        setParts(newParts)
    }

    return (
        <View style={[styles.container, {height: 48 + 16 * parts.length}]}>
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
                        updateRepsValue={value => updateRepsValue(index, value)}
                        updateRepsUnit={value => updateRepsUnit(index, value)}
                        updateWeightValue={value =>
                            updateWeightValue(index, value)
                        }
                        updateWeightUnit={value =>
                            updateWeightUnit(index, value)
                        }
                    />
                )
            )}
            <View style={styles.addPartContainer}>
                <Pressable
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
                        source={Images.ADD}
                    />
                    <Text
                        style={[
                            styles.addPartText,
                            isAddHighlighted && styles.addHighlighted
                        ]}
                    >
                        Add super set
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 48 // 16 DIPs added for each part
    },
    deleteButton: {
        width: 48,
        height: 24
    },
    deleteImage: {
        width: 32,
        height: 32
    },
    addPartContainer: {},
    addPartButton: {},
    addPartImage: {},
    addPartText: {},
    addHighlighted: {}
})

export default ExerciseItem
