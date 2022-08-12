import {useState, useEffect} from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    VirtualizedList,
    Pressable,
    Text
} from 'react-native'

/**
 * An individual item to be rendered as a dropdown option
 *
 * @param {Object}
 */
const Item = props => {
    const {name, onSelect} = props

    return (
        <View style={styles.item}>
            <Pressable
                style={styles.button}
                onPress={() => onSelect(name)}
                android_disableSound={true}
            >
                <Text>{name}</Text>
            </Pressable>
        </View>
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

    useEffect(() => {
        // Find data names matching input
        const matches = data.filter(({name}) => name.includes(input))
        setFilteredData(matches)
    }, [input])

    return (
        <View style={styles.wrapper}>
            <TextInput
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="false"
                editable={editable}
                textAlign="left"
                placeholder={placeholder}
                onChangeText={setInput}
            ></TextInput>
            <VirtualizedList
                data={filteredData}
                initialNumToRender={filteredData.length}
                keyExtractor={data => data.name}
                renderItem={data => (
                    <Item onSelect={onSelect} name={data.name} />
                )}
            ></VirtualizedList>
        </View>
    )
}

const styles = new StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%'
    },
    item: {},
    button: {}
})

export default SearchableInputDropdown
