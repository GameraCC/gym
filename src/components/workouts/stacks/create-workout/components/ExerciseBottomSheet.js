import {useRef, useMemo, useCallback} from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import ExerciseBottomSheetList from './ExerciseBottomSheetList'
import ExerciseBottomSheetInfo from './ExerciseBottomSheetInfo'

const BottomSheetStack = createNativeStackNavigator()

const ExerciseBottomSheet = props => {
    const {backdropComponent} = props

    const routeName = useRef(null)
    const navigationRef = useRef(null)

    const snapPoints = useMemo(() => ['10%', '35%', '65%'], [])

    // Reset navigation on bottomsheet back to exercise list if not already on exercise list upon collapse
    const onChangeIndex = useCallback(index => {
        if (index === 0 && routeName.current !== 'exercise-list') {
            navigationRef.current.reset({
                index: 0,
                routes: [{name: 'exercise-list'}]
            })
        }
    })

    return (
        <BottomSheet
            index={0}
            snapPoints={snapPoints}
            backdropComponent={backdropComponent}
            onChange={onChangeIndex}
        >
            <NavigationContainer
                independent={true}
                onStateChange={state =>
                    (routeName.current =
                        state.routes[state.routes.length - 1].name)
                }
                ref={navigationRef}
            >
                <BottomSheetStack.Navigator
                    screenOptions={{
                        title: 'Add Exercise'
                    }}
                >
                    <BottomSheetStack.Screen
                        name="exercise-list"
                        component={ExerciseBottomSheetList}
                        title="Exercises"
                        options={{headerShown: false}}
                    />
                    <BottomSheetStack.Screen
                        name="exercise-info"
                        component={ExerciseBottomSheetInfo}
                        title="Exercise Info"
                        options={{headerShown: false}}
                    ></BottomSheetStack.Screen>
                </BottomSheetStack.Navigator>
            </NavigationContainer>
        </BottomSheet>
    )
}

export default ExerciseBottomSheet
