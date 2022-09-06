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
        marginTop: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    instructionIndex: {
        fontFamily: 'Lora-Bold',
        fontSize: 16
    },
    instructionValue: {
        fontFamily: 'Lora-Regular',
        marginLeft: 16,
        width: '100%',
        textAlign: 'left',
        fontSize: 14
    }
})

export default Instruction
