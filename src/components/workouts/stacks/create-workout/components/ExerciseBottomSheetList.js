import {useState, useCallback, useEffect} from 'react'
import {
    Platform,
    Keyboard,
    StyleSheet,
    View,
    Image,
    TextInput,
    SectionList,
    Text
} from 'react-native'
import {useBottomSheet} from '@gorhom/bottom-sheet'
import {useNavigation} from '@react-navigation/native'

import ExerciseBottomSheetItem from './ExerciseBottomSheetItem'
import ExerciseBottomSheetSection from './ExerciseBottomSheetSection'

import Images from '@assets/images'
import {EXERCISES} from '@assets/static'
import {black, white, light_white, gray} from '@assets/colors'

// Load exercises into SectionList section data prop format
const EXERCISE_SECTIONED_DATA = Object.keys(EXERCISES).reduce((acc, key) => {
    const exercise = EXERCISES[key]

    exercise.categories.simple.forEach(category => {
        const found = acc.find(({title}) => title === category)

        if (found) {
            found.data.push({id: key, ...exercise})
        } else {
            acc.push({
                title: category,
                data: [{id: key, ...exercise}]
            })
        }
    })

    return acc
}, [])

const Seperator = () => <View style={styles.seperator} />

const ExerciseBottomSheetList = props => {
    const [input, setInput] = useState('')
    const [filteredExercises, setFilteredExercises] = useState(
        EXERCISE_SECTIONED_DATA
    )

    const navigation = useNavigation()
    const bottomSheet = useBottomSheet()

    useEffect(() => {
        const filtered = EXERCISE_SECTIONED_DATA.reduce((acc, section) => {
            const results = section.data.filter(({name}) =>
                name.toLowerCase().includes(input.toLowerCase())
            )

            if (results.length) acc.push({...section, data: results})

            return acc
        }, [])

        setFilteredExercises(filtered)
    }, [input])

    const handleKeyboardFocus = () => bottomSheet.expand()

    const handleItemClick = useCallback(
        ({id, categories, name, description, instructions, tips}) => {
            // Dismiss keyboard if present
            Keyboard.dismiss()

            // Navigate to info screen with id, categories, name & description
            const props = {
                id,
                categories,
                name,
                description,
                instructions,
                tips
            }

            navigation.navigate('exercise-info', props)
        },
        []
    )

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Image style={styles.searchIcon} source={Images.SEARCH} />
                <TextInput
                    style={styles.search}
                    keyboardType="default"
                    placeholder="Search Exercises"
                    onChangeText={setInput}
                    value={input}
                    autoCapitalize="none"
                    multiline={false}
                    numberOfLines={1}
                    onFocus={handleKeyboardFocus}
                ></TextInput>
            </View>
            <Seperator />
            <SectionList
                style={styles.list}
                sections={filteredExercises}
                renderItem={({
                    item: {
                        id,
                        categories,
                        name,
                        description,
                        instructions,
                        tips
                    },
                    index,
                    section: {title}
                }) => {
                    const sectionLength = filteredExercises.find(
                        ({title: _title}) => _title === title
                    ).data.length

                    const firstItem = index === 0
                    const lastItem = index === sectionLength - 1

                    return (
                        <ExerciseBottomSheetItem
                            key={id + title}
                            id={id}
                            name={name}
                            description={description}
                            categories={categories}
                            instructions={instructions}
                            tips={tips}
                            firstItem={firstItem}
                            lastItem={lastItem}
                            handleItemClick={handleItemClick}
                        />
                    )
                }}
                renderSectionHeader={({section: {title}}) => {
                    return <ExerciseBottomSheetSection title={title} />
                }}
                stickySectionHeadersEnabled={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
            ></SectionList>
            {!filteredExercises.length && (
                <View style={styles.noneContainer}>
                    <Text style={styles.noneText}>No Exercises Found</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    seperator: {
        width: '100%',
        height: 0.5,
        backgroundColor: black
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    searchContainer: {
        overflow: 'hidden',
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        borderColor: black,
        borderWidth: 0.75,
        backgroundColor: light_white
    },
    searchIcon: {
        marginLeft: 8,
        marginRight: 8,
        width: 24,
        height: '50%',
        resizeMode: 'contain'
    },
    search: {
        flex: 1,
        marginRight: 16,
        ...(Platform.OS === 'ios' ? {paddingVertical: 10} : {}) // Required on IOS to prevent textInput with numberOfLines={1} from wrapping. Ellipses are not added to the end with this solution
    },
    list: {
        width: '100%',
        height: '1%'
    },
    noneContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noneText: {
        position: 'absolute',
        top: '17.5%',
        color: gray,
        fontFamily: 'Helvetica',
        fontSize: 20
    }
})

export default ExerciseBottomSheetList
