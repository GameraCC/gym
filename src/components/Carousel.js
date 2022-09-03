import {useBottomSheetDynamicSnapPoints} from '@gorhom/bottom-sheet'
import {useRef, useState} from 'react'
import {StyleSheet, View, ScrollView} from 'react-native'
import {black, light_black, white} from '../assets/colors'

/**
 * Pagination dots displayed below items
 *
 * @param {number} count - The count of pagination dots to display
 * @param {number} activeIndex - The active dot index (one-based)
 */
const PaginationDots = props => {
    const {count, activeIndex} = props

    return (
        <View style={styles.dotsContainer}>
            {Array(count)
                .fill(0)
                .map((_, i) => (
                    <View
                        style={
                            activeIndex === i ? styles.activeDot : styles.dot
                        }
                    />
                ))}
        </View>
    )
}

/**
 * Implements a carousel for an item with pagination dots
 *
 * @param {Object} props
 * @param {Function} props.Item - Item which takes a data prop to render
 * @param {Array.<Object>} props.data - Data to be passed to item
 */
const Carousel = props => {
    const {Item, data} = props

    const [activeIndex, setActiveIndex] = useState(0)
    const [snapPoint, setSnapPoint] = useState(0)

    const onLayoutHandler = e => {
        const {width} = e.nativeEvent.layout
        setSnapPoint(width)
    }

    const onScrollHandler = e => {
        // Find out what index is active by determining how much of the scroll view has been scrolled
        const scrollAmount = e.nativeEvent.contentOffset.x
        const index = Math.round(scrollAmount / snapPoint)

        // Set the active index to the new active index
        setActiveIndex(index)
    }

    return (
        <>
            <ScrollView
                style={styles.container}
                bounces={false}
                snapToInterval={snapPoint}
                snapToAlignment="center"
                decelerationRate="fast"
                onScroll={onScrollHandler}
                scrollEventThrottle={128}
                onLayout={onLayoutHandler}
                showsHorizontalScrollIndicator={false}
            >
                {data.map((_data, i) => (
                    <View
                        key={i}
                        style={[styles.itemContainer, {width: snapPoint}]}
                    >
                        <Item key={i} data={_data} />
                    </View>
                ))}
            </ScrollView>
            <PaginationDots count={data.length} activeIndex={activeIndex} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 64,
        paddingTop: 12,
        paddingBottom: 12
    },
    itemContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dotsContainer: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        height: 10,
        width: 10,
        marginLeft: 4,
        marginRight: 4,
        borderRadius: 12,
        backgroundColor: black,
        opacity: 0.25
    },
    activeDot: {
        height: 10,
        width: 10,
        marginLeft: 4,
        marginRight: 4,
        borderRadius: 12,
        backgroundColor: black,
        opacity: 0.75
    }
})

export default Carousel
