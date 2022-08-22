import {useState} from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {resetAlert} from '../actions/alert'
import {green, red} from './colors'

const ErrorAlert = props => {
    const {title, message} = props

    const [isContinueHighlighted, setContinueHighlighted] = useState(false)

    const dispatch = useDispatch()

    const handleContinue = () => dispatch(resetAlert())

    return (
        <View style={styles.wrapper}>
            <View
                style={[
                    styles.container,
                    isContinueHighlighted && styles.containerHighlighted
                ]}
            >
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={styles.message} numberOfLines={4}>
                    {message}
                </Text>
                <Pressable
                    onPressIn={() => setContinueHighlighted(true)}
                    onPressOut={() => setContinueHighlighted(false)}
                    onPress={handleContinue}
                    style={[
                        styles.continueButton,
                        isContinueHighlighted &&
                            styles.continueButtonHighlighted
                    ]}
                >
                    <Text
                        style={[
                            styles.continue,
                            isContinueHighlighted && styles.continueHighlighted
                        ]}
                    >
                        Continue
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const Alert = () => {
    const isVisible = useSelector(state => state.alert.isVisible)
    const kind = useSelector(state => state.alert.kind)
    const title = useSelector(state => state.alert.title)
    const message = useSelector(state => state.alert.message)

    if (isVisible) {
        switch (kind) {
            case 'error':
                return <ErrorAlert title={title} message={message} />
            default:
                return <></>
        }
    } else return <></>
}

const styles = new StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
        width: '75%',
        height: '20%',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: red
    },
    containerHighlighted: {
        borderColor: green
    },
    title: {
        width: '100%',
        marginTop: 24,
        marginBottom: 4,
        paddingLeft: 32,
        paddingRight: 32,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000'
    },
    message: {
        width: '100%',
        marginTop: 'auto',
        marginBottom: 'auto',
        paddingLeft: 32,
        paddingRight: 32,
        textAlign: 'center',
        fontSize: 15
    },
    continueButton: {
        width: '100%',
        paddingTop: 12,
        paddingBottom: 12,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: red,
        borderColor: red,
        borderWidth: 1.5,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    continue: {
        width: '100%',
        textAlign: 'center',
        fontSize: 16,
        color: '#fff'
    },
    continueButtonHighlighted: {
        backgroundColor: green,
        borderColor: green
    },
    continueHighlighted: {
        color: '#000'
    }
})

export default Alert
