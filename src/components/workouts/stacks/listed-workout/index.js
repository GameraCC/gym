import {StyleSheet, View, ScrollView, Text, RefreshControl} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {getAllWorkouts} from '@actions/user'
import Constants from 'expo-constants'

import ListedWorkoutHeader from './components/ListedWorkoutHeader'
import Workout from './components/Workout'

import {white, gray} from '@assets/colors'

const ListedWorkouts = props => {
    const dispatch = useDispatch()
    const workouts = useSelector(state => state.user.workouts)
    const isRefreshing = useSelector(state => state.user.isRefreshing)

    const handleWorkoutPress = () => {
        // navigate to workout screen with props to customize screen
        console.log('work out pressed')
    }

    const handleRefresh = () => dispatch(getAllWorkouts())

    return (
        <>
            <View style={styles.statusBarSafeView} />
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <ListedWorkoutHeader />
                {workouts.length ? (
                    workouts.map(({name, iat}) => (
                        <Workout
                            key={name + iat}
                            name={name}
                            iat={iat}
                            onPress={handleWorkoutPress}
                        />
                    ))
                ) : (
                    <View style={styles.noneContainer}>
                        <Text style={styles.noneText}>No Workouts</Text>
                    </View>
                )}
            </ScrollView>
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

export default ListedWorkouts
