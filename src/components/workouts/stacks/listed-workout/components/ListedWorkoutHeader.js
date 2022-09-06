import {StyleSheet} from 'react-native'
import {useNavigation} from '@react-navigation/native'

import {Header} from '@shared/Header'
import {black, white, green} from '@assets/colors'

const ListedWorkoutHeader = props => {
    const navigation = useNavigation()

    const buttonCallback = () => navigation.navigate('create-workout')

    return (
        <Header
            canGoBack={false}
            navigation={navigation}
            title="Workouts"
            description="View your workouts"
            buttonTitle="Create"
            buttonStyle={styles.buttonStyle}
            buttonTextStyle={styles.buttonTextStyle}
            buttonHighlightedStyle={styles.buttonHighlightedStyle}
            buttonCallback={buttonCallback}
        />
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: green,
        borderColor: green
    },
    buttonTextStyle: {
        color: white
    },
    buttonHighlightedStyle: {
        backgroundColor: black,
        borderColor: black
    }
})

export default ListedWorkoutHeader
