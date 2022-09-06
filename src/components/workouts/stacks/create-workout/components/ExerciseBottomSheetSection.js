import {StyleSheet, View, Text} from 'react-native'

import {gray} from '@assets/colors'

const ExerciseBottomSheetSection = props => {
    const {title} = props

    return (
        <View style={styles.section}>
            <Text style={styles.name}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        marginTop: 32,
        marginBottom: 16,
        marginRight: 16,
        marginLeft: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    name: {
        color: gray,
        fontFamily: 'Helvetica',
        fontSize: 14.5,
        textAlign: 'left'
    }
})

export default ExerciseBottomSheetSection
