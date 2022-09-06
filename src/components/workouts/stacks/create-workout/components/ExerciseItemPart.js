import {StyleSheet, View} from 'react-native'

import Images from '@assets/images'

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

    const [isRepsHighlighted, setRepsHighlighted] = useState(false)
    const [isWeightHighlighted, setWeightHighlighted] = useState(false)

    const onPressInRepsHandler = () => setRepsHighlighted(true)
    const onPressOutRepsHandler = () => setRepsHighlighted(false)

    const onPressInWeightHandler = () => setWeightHighlighted(true)
    const onPressOutWeightHandler = () => setWeightHighlighted(false)

    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={styles.subtitle}>Sets</Text>
                <TextInput
                    style={styles.valueInput}
                    value={sets}
                    onChange={updateSets}
                />
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.subtitle}>Reps</Text>
                <TextInput
                    style={styles.valueInput}
                    value={repsValue}
                    onChange={updateRepsValue}
                />
                <Pressable
                    style={styles.unitButton}
                    onPressIn={onPressInRepsHandler}
                    onPressOut={onPressOutRepsHandler}
                    onPress={updateRepsUnit}
                >
                    <Text style={styles.unit}>{repsUnit}</Text>
                </Pressable>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.subtitle}>Weight</Text>
                <TextInput
                    style={styles.valueInput}
                    value={weightValue}
                    onChange={updateWeightValue}
                />
                <Pressable
                    style={styles.unitButton}
                    onPressIn={onPressInWeightHandler}
                    onPressOut={onPressOutWeightHandler}
                    onPress={updateWeightUnit}
                >
                    <Text style={styles.unit}>{weightUnit}</Text>
                </Pressable>
            </View>
            <View style={styles.itemContainer}>
                <Pressable style={styles.deleteButton} onPress={deletePart}>
                    <Image
                        style={styles.deleteImage}
                        source={
                            deleteHighlighted
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
    unit: {},
    deleteButton: {},
    deleteImage: {}
})

export default ExerciseItemPart
