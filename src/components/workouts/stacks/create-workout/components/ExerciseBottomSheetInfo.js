import {StyleSheet, View, Text, ScrollView, Image} from 'react-native'

import ExerciseBottomSheetInfoHeader from './ExerciseBottomSheetInfoHeader'
import Carousel from '@shared/Carousel'
import Instruction from './Instruction'
import Tip from './Tip'

import Images from '@assets/images'

import {black, white, darker_blue, blue} from '@assets/colors'

const Seperator = () => (
    <View style={styles.seperatorContainer}>
        <View style={styles.seperator} />
    </View>
)

const ExerciseBottomSheetInfo = props => {
    const {
        route: {
            params: {categories, description, id, name, instructions, tips}
        }
    } = props

    // Display info sheet
    return (
        <>
            <ExerciseBottomSheetInfoHeader id={id} name={name} />
            <ScrollView bounces={true} style={styles.container}>
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.categoriesContentContainer}
                    style={styles.categoriesContainer}
                    showsHorizontalScrollIndicator={false}
                >
                    {categories.simple
                        .sort((a, b) => a.localeCompare(b)) // Sort lexicographically
                        .map((category, i) => (
                            <View
                                key={i}
                                style={[styles.category, styles.simpleCategory]}
                            >
                                <Text key={i} style={styles.categoryText}>
                                    {category}
                                </Text>
                            </View>
                        ))}
                    {categories.advanced
                        .sort((a, b) => a.localeCompare(b)) // Sort lexicographically
                        .map((category, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.category,
                                    styles.advancedCategory
                                ]}
                            >
                                <Text key={i} style={styles.categoryText}>
                                    {category}
                                </Text>
                            </View>
                        ))}
                </ScrollView>
                <View style={styles.infoContainer}>
                    <Image style={styles.exerciseImage} source={Images[id]} />
                    <View style={styles.exerciseDescriptionContainer}>
                        <Text style={styles.exerciseDescription}>
                            {description}
                        </Text>
                    </View>
                </View>
                <Seperator />
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionTitle}>Instructions</Text>
                    <View style={styles.instructionsContainer}>
                        {instructions.map((instruction, i) => (
                            <Instruction
                                key={i}
                                index={i + 1}
                                instruction={instruction}
                            />
                        ))}
                    </View>
                </View>
                <Seperator />
                <View style={styles.tipContainer}>
                    <Text style={styles.tipTitle}>Tips</Text>
                    <Carousel data={tips} Item={Tip} />
                </View>
                <Seperator />
                <View style={styles.demonstrationContainer}>
                    <Text style={styles.demonstrationTitle}>Demonstration</Text>
                    <Image
                        style={styles.demonstrationImage}
                        source={Images[id]}
                    />
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    seperatorContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    seperator: {
        marginTop: 12,
        marginBottom: 12,
        backgroundColor: black,
        width: '90%',
        height: 0.75
    },
    instructionTextContainer: {
        marginTop: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    instructionIndex: {
        fontFamily: 'Lora-Bold',
        fontSize: 16
    },
    instructionValue: {
        fontFamily: 'Lora-Regular',
        marginLeft: 16,
        width: '100%',
        textAlign: 'left',
        fontSize: 14
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    categoriesContentContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoriesContainer: {
        padding: 8,
        marginLeft: 24,
        marginRight: 24,
        marginBottom: 8
    },
    category: {
        padding: 8,
        paddingLeft: 16,
        paddingRight: 16,
        marginLeft: 4,
        marginRight: 4,
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    simpleCategory: {
        backgroundColor: darker_blue
    },
    advancedCategory: {
        backgroundColor: blue
    },
    categoryText: {
        fontSize: 12,
        color: white,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center'
    },
    infoContainer: {
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    exerciseImage: {
        resizeMode: 'contain',
        width: 148,
        height: 148,
        marginRight: 16
    },
    exerciseDescriptionContainer: {
        height: 164,
        flex: 1
    },
    exerciseDescription: {
        fontFamily: 'Lora-Regular',
        marginRight: 16,
        fontSize: 14
    },
    instructionTitle: {
        width: '100%',
        marginLeft: 24,
        textAlign: 'left',
        fontFamily: 'Lora-Bold',
        fontSize: 14
    },
    instructionsContainer: {
        marginTop: 12,
        marginRight: 24,
        marginLeft: 24
    },
    instructionTextContainer: {
        marginTop: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tipContainer: {
        width: '100%',
        padding: 8
    },
    tipTitle: {
        width: '100%',
        fontSize: 14,
        fontFamily: 'Lora-SemiBold',
        textAlign: 'center'
    },
    demonstrationContainer: {
        padding: 8,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 64
    },
    demonstrationTitle: {
        width: '100%',
        marginBottom: 16,
        fontSize: 14,
        fontFamily: 'Lora-SemiBold',
        textAlign: 'center'
    },
    demonstrationImage: {
        marginLeft: 24,
        marginRight: 24,
        resizeMode: 'cover'
    }
})

export default ExerciseBottomSheetInfo
