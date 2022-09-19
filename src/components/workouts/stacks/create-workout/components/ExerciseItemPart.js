import {useState, useRef} from 'react'
import {StyleSheet, View, Pressable, Image, Text} from 'react-native'

import KeyboardTextInput from '@shared/KeyboardTextInput'

import Images from '@assets/images'
import {gray} from '@assets/colors'
import {black, white} from '@assets/colors'
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

    const repsValueRef = useRef(null)
    const weightValueRef = useRef(null)

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
                : VALID_EXERCISE_REP_UNITS[index + 1]

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
                : VALID_EXERCISE_WEIGHT_UNITS[index + 1]

        updateWeightUnit(unit)
    }

    /**
     * Handling for displaying custom numeric keyboard
     */

    return (
        <View style={styles.container}>
            <View style={[styles.itemContainer, styles.borderContainer]}>
                <KeyboardTextInput
                    kind="numeric"
                    onChangeText={updateSets}
                    continueRef={repsValueRef}
                    style={styles.setInput}
                    value={sets}
                    numberOfLines={1}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                />
            </View>
            <View style={[styles.itemContainer, styles.borderContainer]}>
                <View style={styles.unitValueContainer}>
                    <KeyboardTextInput
                        kind="numeric"
                        onChangeText={updateRepsValue}
                        ref={repsValueRef}
                        continueRef={weightValueRef}
                        style={styles.valueInput}
                        value={repsValue}
                        numberOfLines={1}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="always"
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
            </View>
            <View style={[styles.itemContainer, styles.borderContainer]}>
                <View style={styles.unitValueContainer}>
                    <KeyboardTextInput
                        kind="numeric"
                        onChangeText={updateWeightValue}
                        ref={weightValueRef}
                        style={styles.valueInput}
                        value={weightValue}
                        numberOfLines={1}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="always"
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
        height: 48,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    borderContainer: {
        borderColor: black,
        borderWidth: 1,
        borderRadius: 4
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemSeperator: {
        width: 48,
        height: 48
    },
    unitValueContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    index: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 16
    },
    setInput: {
        width: 32,
        padding: 8,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Helvetica'
    },
    valueInput: {
        width: 48,
        padding: 8,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Helvetica'
    },
    unitButton: {
        width: 52,
        height: '100%',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: black
    },
    buttonHighlighted: {
        backgroundColor: gray,
        color: white
    },
    unit: {
        fontSize: 12,
        textAlign: 'center',
        color: white,
        fontFamily: 'Helvetica'
    },
    deleteButton: {
        width: 32,
        height: 32
    },
    deleteImage: {
        width: 32,
        height: 32
    }
})

export default ExerciseItemPart
