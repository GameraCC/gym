import {useState} from 'react'
import {StyleSheet, View, Pressable, Image, TextInput, Text} from 'react-native'

import Images from '@assets/images'
import {
    VALID_EXERCISE_REP_UNITS,
    VALID_EXERCISE_WEIGHT_UNITS
} from '@lib/constraints'

const ExerciseItemPart = props => {
    const {
        sets,
        repsValue,
        repsUnit,
        weightValue,
        weightUnit,
        updateRepsValue,
        updateRepsUnit,
        updateWeightValue,
        updateWeightUnit,
        updateSets,
        deletePart
    } = props

    const [isDeleteHighlighted, setDeleteHighlighted] = useState(false)
    const [isRepsHighlighted, setRepsHighlighted] = useState(false)
    const [isWeightHighlighted, setWeightHighlighted] = useState(false)

    const onPressInDeleteHandler = () => setDeleteHighlighted(false)
    const onPressOutDeleteHandler = () => setDeleteHighlighted(true)

    const onPressInRepsHandler = () => setRepsHighlighted(true)
    const onPressOutRepsHandler = () => setRepsHighlighted(false)
    const onPressRepsHandler = () => {
        // Rotate between rep units, default unit is first unit in array, assigned by the parent component upon adding a part
        const index = VALID_EXERCISE_REP_UNITS.findIndex(
            unit => unit === repsUnit
        )
        const unit =
            VALID_EXERCISE_REP_UNITS.length === index + 1
                ? VALID_EXERCISE_REP_UNITS[0]
                : VALID_EXERCISE_REP_UNITS[index]

        updateRepsUnit(unit)
    }

    const onPressInWeightHandler = () => setWeightHighlighted(true)
    const onPressOutWeightHandler = () => setWeightHighlighted(false)
    const onPressWeightHandler = () => {
        // Rotate between rep units, default unit is first unit in array, assigned by the parent component upon adding a part
        const index = VALID_EXERCISE_WEIGHT_UNITS.findIndex(
            unit => unit === weightUnit
        )
        const unit =
            VALID_EXERCISE_WEIGHT_UNITS.length === index + 1
                ? VALID_EXERCISE_WEIGHT_UNITS[0]
                : VALID_EXERCISE_WEIGHT_UNITS[index]

        updateWeightUnit(unit)
    }

    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={styles.subtitle}>Sets</Text>
                <TextInput
                    style={styles.valueInput}
                    value={sets}
                    onChangeText={updateSets}
                    numberOfLines={1}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.subtitle}>Reps</Text>
                <TextInput
                    style={styles.valueInput}
                    value={repsValue}
                    onChangeText={updateRepsValue}
                    numberOfLines={1}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                    keyboardType="numeric"
                />
                <Pressable
                    style={[
                        styles.unitButton,
                        isRepsHighlighted && styles.buttonHighlighted
                    ]}
                    onPressIn={onPressInRepsHandler}
                    onPressOut={onPressOutRepsHandler}
                    onPress={onPressRepsHandler}
                >
                    <Text
                        style={[
                            styles.unit,
                            isRepsHighlighted && styles.buttonHighlighted
                        ]}
                    >
                        {repsUnit}
                    </Text>
                </Pressable>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.subtitle}>Weight</Text>
                <TextInput
                    style={styles.valueInput}
                    value={weightValue}
                    onChangeText={updateWeightValue}
                    numberOfLines={1}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                    keyboard="numeric"
                />
                <Pressable
                    style={[
                        styles.unitButton,
                        isWeightHighlighted && styles.buttonHighlighted
                    ]}
                    onPressIn={onPressInWeightHandler}
                    onPressOut={onPressOutWeightHandler}
                    onPress={onPressWeightHandler}
                >
                    <Text
                        style={[
                            styles.unit,
                            isWeightHighlighted && styles.buttonHighlighted
                        ]}
                    >
                        {weightUnit}
                    </Text>
                </Pressable>
            </View>
            <View style={styles.itemContainer}>
                <Pressable
                    style={styles.deleteButton}
                    onPress={deletePart}
                    onPressIn={onPressInDeleteHandler}
                    onPressOut={onPressOutDeleteHandler}
                >
                    <Image
                        style={styles.deleteImage}
                        source={
                            isDeleteHighlighted
                                ? Images.REMOVE_CROSS_HIGHLIGHTED
                                : Images.REMOVE_CROSS
                        }
                    />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    itemContainer: {},
    subtitle: {},
    valueInput: {},
    unitButton: {},
    buttonHighlighted: {},
    unit: {},
    deleteButton: {},
    deleteImage: {}
})

export default ExerciseItemPart
