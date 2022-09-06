import {useState} from 'react-native'
import {
    StyleSheet,
    Pressable,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native'
import Animated, {FadeInUp, FadeOutLeft} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

import Images from '@assets/images'
import {black, white} from '@assets/colors'

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

const styles = StyleSheet.create({
    workoutButtonHighlighted: {
        backgroundColor: black,
        color: white
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
    }
})

export default Workout
