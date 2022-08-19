import {useState, useEffect} from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
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
    const {name, isFirstAndHighlighted, setFirstHighlighted, onSelect} = props

    let [isHighlighted, setHighlighted] = useState(false)

    // Use stateful isFirstHighlighted if this is the first item. If first is not highlighted
    // this defaults to using the child items stateful isHighlighted because isFirstAndHighlighted
    // will be false. This convention is fine because it reverts back to using isFirstAndHighlighted
    // state upon being highlighted
    if (isFirstAndHighlighted) {
        isHighlighted = isFirstAndHighlighted
        setHighlighted = setFirstHighlighted
    }

    const onPressInHandler = e => {
        e.preventDefault()
        // Make this item highlighted
        setHighlighted(true)
        // Make default first item unhighlighted
        setFirstHighlighted(false)
    }

    const onPressOutHandler = e => {
        e.preventDefault()
        // Make this item unhighlighted
        setHighlighted(false)
        // Make default first item highlighted
        setFirstHighlighted(true)
    }

    const onPressHandler = e => {
        e.preventDefault()
        onSelect(name)
    }

    return (
        <Pressable
            style={[styles.item, isHighlighted && styles.highlighted]}
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
 * @param {Object} props
 * @param {Array.<{name: string}>} props.data - Displayed names of items
 * @param {onSelectCallback} props.onSelect - Callback which is called upon an item selection
 * @param {boolean} props.editable - Whether or not the text input is editable
 * @param {string} props.placeholder - The placeholder text for the text input
 */
const SearchableInputDropdown = props => {
    const {data, onSelect, editable, placeholder} = props
    const [input, setInput] = useState('')
    const [filteredData, setFilteredData] = useState(data)
    const [isFocused, setIsFocused] = useState(false)
    const [isFirstHighlighted, setFirstHighlighted] = useState(true)

    // // Fix double tap issue regarding keyboard being forced to dismiss prior to selection being clicked
    // const virtualizedListEl = useRef(null)
    // const scrollViewEl = virtualizedListEl.current?.getScrollRef()

    // if (scrollViewEl) {
    //     scrollViewEl.onStartShouldSetResponderCapture = event => {
    //         console.log(event)
    //     }

    //     scrollViewEl.onMoveShouldSetResponderCapture = event => {
    //         console.log(event)
    //     }
    // }

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
    }, [input])

    const onSelectWrapper = selected => {
        // Remove element focus
        Keyboard.dismiss()
        // Callback with selected item
        onSelect(selected)
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
            const selected = filteredData[0].name
            onSelect(selected)
            setInput(selected)
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
            {filteredData.length && input.length ? (
                <VirtualizedList
                    data={filteredData}
                    keyExtractor={data => data.name}
                    renderItem={data => (
                        <Item
                            key={data.item.name}
                            onSelect={onSelectWrapper}
                            name={data.item.name}
                            isFirstAndHighlighted={
                                data.index === 0 ? isFirstHighlighted : false
                            }
                            setFirstHighlighted={setFirstHighlighted}
                        />
                    )}
                    getItemCount={data => data.length}
                    getItem={(data, index) => ({...data[index], index})}
                    style={styles.list}
                    bounces={false}
                    bouncesZoom={false}
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
        overflow: 'visible'
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
