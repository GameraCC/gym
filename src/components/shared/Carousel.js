import {useState, useRef, useEffect} from 'react'
import {StyleSheet, View, ScrollView, Text, Pressable} from 'react-native'

import {white, black} from '@assets/colors'

/**
 * Pagination displayed
 *
 * @param {number} count - The count of pagination dots to display
 * @param {number} activeIndex - The active dot index (one-based)
 */
const Pagination = props => {
    const {count, activeIndex, highlightedIndex, scrollToIndex} = props

    return (
        <View style={styles.paginationContainer}>
            {Array(count)
                .fill(0)
                .map((_, i) => (
                    <Pressable
                        onPress={() => scrollToIndex(i)}
                        key={i}
                        style={[
                            styles.pagination,
                            activeIndex === i && styles.activePagination
                        ]}
                    >
                        <Text
                            style={[
                                styles.paginationText,
                                activeIndex === i && styles.activePagination
                            ]}
                        >
                            {i + 1}
                        </Text>
                    </Pressable>
                ))}
        </View>
    )
}

/**
 * Implements a carousel for an item with pagination dots
 *
 * Pass in a child component to be added as a header on pagination
 *
 * @param {Object} props
 * @param {Function} props.Item - Item which takes a data prop to render
 * @param {Array.<Object>} props.data - Data to be passed to item
 */
const Carousel = props => {
    const {Item, data, children} = props

    const [activeIndex, setActiveIndex] = useState(0)
    const [snapPoint, setSnapPoint] = useState(0)

    const scrollRef = useRef(null)

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

    const scrollToIndex = i => {
        scrollRef.current.scrollTo({
            x: snapPoint * i,
            y: 0,
            animated: false
        })
        setActiveIndex(i)
    }

    return (
        <>
            <View style={styles.headerContainer}>
                {children}
                <Pagination
                    scrollToIndex={scrollToIndex}
                    count={data.length}
                    activeIndex={activeIndex}
                />
            </View>
            <ScrollView
                ref={scrollRef}
                style={styles.container}
                horizontal
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
        </>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container: {
        width: '100%',
        height: 64
    },
    itemContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'hidden'
    },
    paginationContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pagination: {
        width: 24,
        height: 24,
        marginLeft: 2,
        borderWidth: 0.5,
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: black
    },
    paginationText: {
        color: white,
        fontFamily: 'Helvetica-Bold',
        fontSize: 14
    },
    activePagination: {
        backgroundColor: white,
        color: black,
        borderColor: black
    }
})

export default Carousel
