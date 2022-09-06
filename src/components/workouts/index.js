import {createNativeStackNavigator} from '@react-navigation/native-stack'

import ListedWorkouts from './stacks/listed-workout'
import CreateWorkout from './stacks/create-workout'

const Stack = createNativeStackNavigator()

const Workouts = props => {
    return (
        <Stack.Navigator
            screenOptions={{
                title: 'Gym',
                headerShown: false
            }}
        >
            <Stack.Screen
                name="listed-workouts"
                component={ListedWorkouts}
            ></Stack.Screen>
            <Stack.Screen
                name="create-workout"
                component={CreateWorkout}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}

export default Workouts
