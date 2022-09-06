import {StyleSheet, View, TouchableOpacity, Image} from 'react-native'
import * as Haptics from 'expo-haptics'

import {gray} from '@assets/colors'

const TabItem = props => {
    const {onPress, onLongPress, isFocused, image, imageHighlighted} = props

    return (
        <TouchableOpacity
            style={styles.tabBarItemContainer}
            onLongPress={onLongPress}
            onPress={onPress}
        >
            <Image
                style={styles.tabBarItemImage}
                source={isFocused ? imageHighlighted : image}
            ></Image>
        </TouchableOpacity>
    )
}

const TabBar = props => {
    const {state, descriptors, navigation} = props

    const onPress = ({key, name, isFocused}) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

        const event = navigation.emit({
            type: 'tabPress',
            target: key,
            canPreventDefault: true
        })

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({name: name, merge: true})
        }
    }

    const onLongPress = ({key}) =>
        navigation.emit({
            type: 'tabLongPress',
            target: key
        })

    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key]
                const isFocused = state.index === index

                return (
                    <TabItem
                        key={route.key}
                        isFocused={isFocused}
                        onLongPress={() => onLongPress(route)}
                        onPress={() => onPress({...route, isFocused})}
                        image={options.image}
                        imageHighlighted={options.imageHighlighted}
                    />
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    tabBarContainer: {
        width: '100%',
        paddingBottom: 20,
        paddingTop: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',

        borderTopColor: gray,
        borderTopWidth: 1
    },
    tabBarItemContainer: {
        width: 64,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48
    },
    tabBarItemImage: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    }
})

export default TabBar
