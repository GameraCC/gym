import {useState, useEffect, useRef} from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    VirtualizedList,
    Pressable,
    Text,
    Keyboard
} from 'react-native'

/**
 * An individual item to be rendered as a dropdown option
 *
 * Highlights upon press in and removes highlight upon press out
 * Works with parent to ensure the default first item is highlighted
 * or unhighlighted upon a different item being highlighted
 *
 * @param {Object}
 */
const Item = props => {
    const {name, isFirst, isFirstHighlighted, setFirstHighlighted, onSelect} =
        props

    let [isHighlighted, setHighlighted] = useState(isFirst)

    const onPressInHandler = e => {
        console.log('press in')
        e.preventDefault()
        if (!isFirst) {
            // Make this item highlighted
            setHighlighted(true)
            // Make default first item unhighlighted
            setFirstHighlighted(false)
        } else {
            setFirstHighlighted(false)
        }
    }

    const onPressOutHandler = e => {
        console.log('press out')
        e.preventDefault()
        if (!isFirst) {
            // Make this item unhighlighted
            setHighlighted(false)
            // Make default first item highlighted
            setFirstHighlighted(true)
        } else {
            setFirstHighlighted(true)
        }
    }

    const onPressHandler = e => {
        console.log('press')
        e.preventDefault()
        onSelect(name)

        if (!isFirst) setFirstHighlighted(true)
    }

    return (
        <Pressable
            style={[
                styles.item,
                (isFirst ? isFirstHighlighted : isHighlighted) &&
                    styles.highlighted
            ]}
            onPress={onPressHandler}
            onPressIn={onPressInHandler}
            onPressOut={onPressOutHandler}
            android_disableSound={true}
        >
            <Text style={styles.text}>{name}</Text>
        </Pressable>
    )
}

/**
 * @callback onSelectCallback
 *
 * @param {Object} item - The selected item
 */

/**
 * Creates a searchable dropdown list
 *
 * Compares input and option names by standardizing to lowercase
 *
 * Ensure the parent container is styled with a correct z-index for the dropdown list
 * to overlap other elements
 *
 * @param {Object} props
 * @param {Array.<{name: string}>} props.data - Displayed names of items
 * @param {onSelectCallback} props.onSelect - Callback which is called upon an item selection
 * @param {boolean} props.editable - Whether or not the text input is editable
 * @param {string} props.placeholder - The placeholder text for the text input
 * @param {string} props.input - The search input stateful variable
 * @param {string} props.setInput - Callback to update stateful input variable
 */
const SearchableInputDropdown = props => {
    const {data, onSelect, editable, placeholder, input, setInput} = props
    const [filteredData, setFilteredData] = useState(data)
    const [isFocused, setIsFocused] = useState(false)
    const [isFirstHighlighted, setFirstHighlighted] = useState(true)
    const virtualizedListEl = useRef(null)

    useEffect(() => {
        // Find data names matching input, if theres any input
        let matches
        if (input.length) {
            matches = data.filter(({name}) =>
                name.toLowerCase().includes(input.toLowerCase())
            )
        } else matches = []

        // Set new filtered data, and highlight the first
        setFilteredData(matches)
        setFirstHighlighted(true)

        // Scroll back to top of list on input
        const scrollElement = virtualizedListEl?.current?.getScrollRef()
        scrollElement?.scrollTo({x: 0, y: 0, animated: false})
    }, [input])

    const onSelectWrapper = selected => {
        // Remove element focus
        Keyboard.dismiss()
        // Callback with selected item
        onSelect(data.find(({name}) => name === selected))
        // Set the input
        setInput(selected)
    }

    const onFocusHandler = () => setIsFocused(true)
    const onBlurHandler = () => setIsFocused(false)

    // Handle selection by submit button
    const onSubmitHandler = e => {
        e.preventDefault()

        // Choose the first item if there is a first item
        if (filteredData.length) {
            // Find the first item's name
            const selected = filteredData[0]
            // Callback with first item
            onSelect(data.find(({name}) => name === selected.name))
            // Set the input to the first item
            setInput(selected.name)
        } else {
            // Otherwise reset input
            setInput('')
        }
    }

    return (
        <View style={styles.wrapper}>
            <TextInput
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                editable={editable}
                textAlign="left"
                placeholder={placeholder}
                onChangeText={setInput}
                value={input}
                style={styles.input}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                onSubmitEditing={onSubmitHandler}
            ></TextInput>
            {filteredData.length && input.length && isFocused ? (
                <VirtualizedList
                    ref={virtualizedListEl}
                    data={filteredData}
                    keyExtractor={data => data.name}
                    renderItem={data => (
                        <Item
                            key={data.item.name}
                            onSelect={onSelectWrapper}
                            name={data.item.name}
                            isFirst={data.index === 0}
                            isFirstHighlighted={isFirstHighlighted}
                            setFirstHighlighted={setFirstHighlighted}
                        />
                    )}
                    getItemCount={data => data.length}
                    getItem={(data, index) => ({...data[index], index})}
                    style={styles.list}
                    bounces={false}
                    bouncesZoom={false}
                    keyboardShouldPersistTaps={'handled'}
                    keyboardDismissMode={'none'}
                ></VirtualizedList>
            ) : (
                <></>
            )}
        </View>
    )
}

const styles = new StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#000',
        overflow: 'visible',
        backgroundColor: '#fff'
    },
    input: {},
    list: {
        position: 'absolute',
        top: 50,
        backgroundColor: '#fff',
        width: '100%',
        maxHeight: 128
    },
    item: {
        height: 50
    },
    text: {
        textAlign: 'center'
    },
    highlighted: {
        backgroundColor: '#0091FF'
    }
})

export default SearchableInputDropdown
