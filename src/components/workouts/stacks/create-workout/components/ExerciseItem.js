import {StyleSheet, View, Pressable} from 'react-native'

import Images from '@assets/images'

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
const updateNestedPart = (object, callback, updateExpression) = (index, value) => {
    const newParts = [...object]

    let part = object[index]

    part = updateExpression(part, value)

    newParts.splice(index, 1, part)

    callback(newParts)
}

const ExerciseItem = props => {
    const {index, id, parts, setParts, deleteExercise} = props

    const [isHighlighted, setHighlighted] = useState(false)

    const onPressInHandler = () => setHighlighted(false)
    const onPressOutHandler = () => setHighlighted(true)
    const onPressHandler = () => deleteExercise(id)

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

    const updateRepsValue = updatePart(parts, setParts, (part, value) => ({
        ...part,
        reps: {
            ...part.reps,
            value
        }
    }))

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
                onPressIn={onPressInHandler}
                onPressOut={onPressOutHandler}
                onPress={onPressHandler}
                style={styles.deleteButton}
            >
                <Image
                    style={styles.deleteImage}
                    source={
                        isHighlighted
                            ? Images.DELETE_HIGHLGIHTED
                            : Images.DELETE
                    }
                />
            </Pressable>
            {parts.map(
                ({
                    sets,
                    reps: {repsValue, repsUnit},
                    weight: {weightValue, weightUnit}
                }, index) => 
                    <ExerciseItemPart
                        deletePart={() => deletePart(index)}
                        sets={sets}
                        repsValue={repsValue}
                        repsUnit={repsUnit}
                        weightValue={weightValue}
                        weightUnit={weightUnit}
                        updateSets={updateSets}
                        updateRepsValue={updateRepsValue}
                        updateRepsUnit={updateRepsUnit}
                        updateWeightValue={updateWeightValue}
                        updateWeightUnit={updateWeightUnit}
                    />
            )}
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
    }
})

export default ExerciseItem
