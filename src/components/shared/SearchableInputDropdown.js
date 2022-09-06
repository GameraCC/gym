import {useState, useEffect, useRef} from 'react'
import {
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
    const {
        name,
        isFirst,
        isFirstHighlighted,
        setFirstHighlighted,
        onSelect,
        style
    } = props

    let [isHighlighted, setHighlighted] = useState(isFirst)

    const onPressInHandler = e => {
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
        e.preventDefault()
        onSelect(name)

        if (!isFirst) setFirstHighlighted(true)
    }

    return (
        <Pressable
            style={[
                style.listItem,
                (isFirst ? isFirstHighlighted : isHighlighted) &&
                    style.listItemHighlighted
            ]}
            onPress={onPressHandler}
            onPressIn={onPressInHandler}
            onPressOut={onPressOutHandler}
            android_disableSound={true}
        >
            <Text
                style={[
                    style.listItemText,
                    (isFirst ? isFirstHighlighted : isHighlighted) &&
                        style.listItemHighlighted
                ]}
            >
                {name}
            </Text>
        </Pressable>
    )
}

/**
 * @callback onSelectCallback
 *
 * @param {Object} item - The selected item
 */

const Divider = ({style}) => <View style={style} />

/**
 * Creates a searchable dropdown list
 *
 * Compares input and option names by standardizing to lowercase
 *
 * --- Styling ---
 * Ensure the parent container is styled with a correct z-index for the dropdown list
 * to overlap other elements &
 *
 * Ensure the parent container has a width and height
 * Ensure the list style has a defined maxHeight or height
 *
 * Ensure a zIndex is applied to the parent container to overlap other elements not just elements within the parent view
 * Ensure a zIndex is applied to the wrapper style when overlapping multiple SearchableInputDropdowns
 *
 * @param {Object} props
 * @param {Array.<{name: string}>} props.data - Displayed names of items
 * @param {onSelectCallback} props.onSelect - Callback which is called upon an item selection
 * @param {boolean} props.editable - Whether or not the text input is editable
 * @param {string} props.placeholder - The placeholder text for the text input
 * @param {string} props.input - The search input stateful variable
 * @param {Function} props.setInput - Callback to update stateful input variable
 * @param {Object} props.style
 * @param {Object | Array} props.style.wrapper - View wrapping list & styling
 * @param {Object | Array} props.style.dropdown - Dropdown input styling
 * @param {Object | Array} props.style.list - Dropdown list styling
 * @param {Object | Array} props.style.listItem - List item styling
 * @param {Object | Array} props.style.listItemDivider - Divider view styling
 * @param {Object | Array} props.style.listItemText - List item styling
 * @param {Object | Array} props.style.listItemHighlighted - Highlighted item styling
 *
 */
const SearchableInputDropdown = props => {
    const {data, onSelect, editable, placeholder, input, setInput, style} =
        props
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
        <View style={style.wrapper}>
            <TextInput
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                editable={editable}
                textAlign="left"
                placeholder={placeholder}
                onChangeText={setInput}
                value={input}
                style={style.dropdown}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                onSubmitEditing={onSubmitHandler}
                numberOfLines={1}
            ></TextInput>
            {filteredData.length && input.length && isFocused ? (
                <VirtualizedList
                    ref={virtualizedListEl}
                    data={filteredData}
                    keyExtractor={data => data.name}
                    renderItem={data => (
                        <>
                            <Item
                                key={data.item.name}
                                onSelect={onSelectWrapper}
                                name={data.item.name}
                                isFirst={data.index === 0}
                                isFirstHighlighted={isFirstHighlighted}
                                setFirstHighlighted={setFirstHighlighted}
                                style={{
                                    listItem: style.listItem,
                                    listItemText: style.listItemText,
                                    listItemHighlighted:
                                        style.listItemHighlighted
                                }}
                            />
                            {data.index !== filteredData.length - 1 && (
                                <Divider style={style.listItemDivider} />
                            )}
                        </>
                    )}
                    getItemCount={data => data.length}
                    getItem={(data, index) => ({...data[index], index})}
                    style={[style.list]}
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

export default SearchableInputDropdown
