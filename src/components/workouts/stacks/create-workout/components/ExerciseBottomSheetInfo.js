import {StyleSheet, View, Text, ScrollView, Image} from 'react-native'

import ExerciseBottomSheetInfoHeader from './ExerciseBottomSheetInfoHeader'
import Carousel from '@shared/Carousel'
import Instruction from './Instruction'
import Tip from './Tip'

import Images from '@assets/images'

import {black, white} from '@assets/colors'
import {useMemo} from 'react'

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
                    <Carousel data={tips} Item={Tip}>
                        <Text style={styles.tipTitle}>Tips</Text>
                    </Carousel>
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
        paddingBottom: 8,
        paddingTop: 8,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    seperator: {
        backgroundColor: black,
        width: '90%',
        height: 0.75
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    categoriesContentContainer: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoriesContainer: {
        overflow: 'hidden',
        marginRight: 24,
        marginLeft: 24,
        marginBottom: 12
    },
    category: {
        padding: 8,
        paddingLeft: 16,
        paddingRight: 16,
        marginLeft: 4,
        marginRight: 4,
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    simpleCategory: {
        backgroundColor: black
    },
    advancedCategory: {
        backgroundColor: black
    },
    categoryText: {
        fontSize: 12,
        color: white,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center'
    },
    infoContainer: {
        paddingLeft: 24,
        paddingRight: 24,
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
        height: 148,
        flex: 1
    },
    exerciseDescription: {
        fontFamily: 'Helvetica',
        fontSize: 14
    },
    instructionTitle: {
        marginTop: 8,
        marginBottom: 8,
        textAlign: 'left',
        fontFamily: 'Helvetica-Bold',
        fontSize: 18
    },
    instructionContainer: {
        paddingLeft: 24,
        paddingRight: 24
    },
    instructionsContainer: {
        marginBottom: 8
    },
    tipContainer: {
        width: '100%',
        paddingLeft: 24,
        paddingRight: 24
    },
    tipTitle: {
        marginTop: 8,
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'left'
    },
    demonstrationContainer: {
        width: '100%',
        paddingLeft: 24,
        paddingRight: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 64
    },
    demonstrationTitle: {
        width: '100%',
        marginTop: 8,
        marginBottom: 16,
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'left'
    },
    demonstrationImage: {
        resizeMode: 'cover'
    }
})

export default ExerciseBottomSheetInfo
