import {StyleSheet, View, Text} from 'react-native'

const Tip = props => {
    const {data: tip} = props

    return (
        <View style={styles.container}>
            <Text style={styles.tip} numberOfLines={2}>
                {tip}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 24,
        marginRight: 24
    },
    tip: {
        fontFamily: 'Lora-Regular',
        fontSize: 14,
        textAlign: 'center'
    }
})

export default Tip
