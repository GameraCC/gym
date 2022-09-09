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
        width: '100%'
    },
    tip: {
        fontFamily: 'Helvetica',
        fontSize: 14,
        textAlign: 'left'
    }
})

export default Tip
