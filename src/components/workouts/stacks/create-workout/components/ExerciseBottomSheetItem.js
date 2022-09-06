import {useState} from 'react'
import {View, Pressable, Image, Text} from 'react-native'
import {StyleSheet} from 'react-native'

import Images from '@assets/images'

import {white, light_black, light_white, black} from '@assets/colors'

const ExerciseBottomSheetItem = props => {
    const {
        id,
        categories,
        name,
        description,
        instructions,
        tips,
        handleItemClick,
        firstItem,
        lastItem
    } = props
    const [highlighted, setHighlighted] = useState(false)

    const handlePressIn = () => setHighlighted(true)
    const handlePressOut = () => setHighlighted(false)
    const handlePress = () =>
        handleItemClick({id, categories, name, description, instructions, tips})

    return (
        <View
            style={[
                styles.item,
                firstItem && styles.firstItem,
                lastItem && styles.lastItem
            ]}
        >
            <Pressable
                style={[
                    styles.itemButton,
                    highlighted && styles.highlighted,
                    firstItem && styles.firstItemButton,
                    lastItem && styles.lastItemButton
                ]}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Image style={styles.image} source={Images[id]}></Image>
                <Text
                    style={[styles.name, highlighted && styles.highlighted]}
                    numberOfLines={1}
                >
                    {name}
                </Text>
                <Image
                    style={styles.expand}
                    source={
                        highlighted
                            ? Images.FORWARD_WHITE
                            : Images.FORWARD_BLACK
                    }
                ></Image>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        marginRight: 16,
        marginLeft: 16,
        overflow: 'hidden',
        height: 64,
        borderBottomWidth: 1
    },
    firstItem: {
        borderTopWidth: 1,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    lastItem: {
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    itemButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    firstItemButton: {
        borderTopRightRadius: 9,
        borderTopLeftRadius: 9
    },
    lastItemButton: {
        borderBottomRightRadius: 9,
        borderBottomLeftRadius: 9
    },
    image: {
        width: 48,
        height: 48,
        marginLeft: 8,
        borderRadius: 8,
        resizeMode: 'cover'
    },
    name: {
        fontFamily: 'Helvetica',
        marginLeft: 8,
        color: black,
        fontSize: 18
    },
    expand: {
        marginLeft: 'auto',
        marginRight: 16,
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    highlighted: {
        backgroundColor: light_black,
        color: light_white
    }
})

export default ExerciseBottomSheetItem
