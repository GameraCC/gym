import {View, TouchableOpacity, Image} from 'react-native'
import Images from '@assets/images'

/**
 * Custom navigation back buttons
 *
 * @param {Object} navigation - The navigation object
 * @param {Object} style - Styles to be applied
 * @param {Object} style.container - Container view styles
 */
const BackButton = props => {
    const {navigation, style} = props

    const handleBackButtonPress = () =>
        navigation.canGoBack() && navigation.pop()

    return (
        <View style={[style && style.container]}>
            <TouchableOpacity onPress={handleBackButtonPress}>
                <Image style={{width: 26, height: 26}} source={Images.BACK} />
            </TouchableOpacity>
        </View>
    )
}

export default BackButton
