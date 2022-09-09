import {StyleSheet, View, Text} from 'react-native'

const Instruction = props => {
    const {index, instruction} = props

    return (
        <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionIndex}>{index}</Text>
            <Text style={styles.instructionValue} numberOfLines={3}>
                {instruction}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    instructionTextContainer: {
        marginTop: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    instructionIndex: {
        fontFamily: 'Helvetica',
        fontSize: 14
    },
    instructionValue: {
        fontFamily: 'Helvetica',
        marginLeft: 24,
        marginRight: 24,
        textAlign: 'left',
        fontSize: 14
    }
})

export default Instruction
