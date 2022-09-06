import {useState, useCallback} from 'react'
import {StyleSheet} from 'react-native'
import {useNavigation} from '@react-navigation/native'

import {EditableHeader} from '@shared/Header'

import {white, green, black} from '@assets/colors'

const CreateWorkoutHeader = props => {
    const {onSave} = props

    const [title, setTitle] = useState('Add a title')
    const [description, setDescription] = useState('Add a description')

    const navigation = useNavigation()

    const _onSave = useCallback(() => onSave(title, description), [])

    return (
        <EditableHeader
            canGoBack={true}
            navigation={navigation}
            title={title}
            titleInputCallback={setTitle}
            description={description}
            descriptionInputCallback={setDescription}
            buttonTitle="Save"
            buttonStyle={styles.buttonStyle}
            buttonTextStyle={styles.buttonTextStyle}
            buttonHighlightedStyle={styles.buttonHighlightedStyle}
            buttonCallback={_onSave}
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

export default CreateWorkoutHeader
