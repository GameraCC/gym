import {useState} from 'react'
import {StyleSheet, View, Pressable, Image, Text} from 'react-native'
import {useDispatch} from 'react-redux'
import {addExercise} from '@actions/updates'
import {useBottomSheet} from '@gorhom/bottom-sheet'
import {useNavigation} from '@react-navigation/native'
import * as Haptics from 'expo-haptics'

import BackButton from '@shared/BackButton'

import Images from '@assets/images'
import {white} from '@assets/colors'

const ExerciseBottomSheetInfoHeader = props => {
    const {id, name} = props

    const [isHighlighted, setIsHighlighted] = useState(false)

    const bottomSheet = useBottomSheet()
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const onPressInHandler = () => setIsHighlighted(true)
    const onPressOutHandler = () => setIsHighlighted(false)
    const addExerciseHandler = () => {
        // Dispatch an add exercise action
        dispatch(addExercise(id))

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        // Close the bottom sheet and bring it back up
        bottomSheet.close()

        // While the bottom sheet is closed, navigate back to the main page to avoid automatic navigation upon collapse
        setTimeout(() => {
            navigation.goBack()

            // Show the collapsed bottom sheet after closing and resetting navigation
            setTimeout(() => {
                bottomSheet.snapToIndex(0)
            }, 200)
        }, 250)
    }

    return (
        <View style={styles.container}>
            <BackButton
                style={{container: styles.backButton}}
                navigation={navigation}
            />
            <Text style={styles.headerTitle}>{name}</Text>
            <Pressable
                style={styles.addExerciseButton}
                onPress={addExerciseHandler}
                onPressIn={onPressInHandler}
                onPressOut={onPressOutHandler}
            >
                <Image
                    style={styles.addExerciseImage}
                    source={isHighlighted ? Images.ADD_HIGHLIGHTED : Images.ADD}
                ></Image>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 48,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: white
    },
    headerTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 16
    },
    backButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        position: 'absolute',
        left: 20
    },
    addExerciseButton: {
        position: 'absolute',
        right: 20
    },
    addExerciseImage: {
        resizeMode: 'contain',
        width: 28,
        height: 28
    }
})

export default ExerciseBottomSheetInfoHeader
