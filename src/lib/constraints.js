import EXERCISES from '@assets/static'

const MAX_PASSWORD_LENGTH = 100
const MIN_PASSWORD_LENGTH = 8
const MAX_USERNAME_LENGTH = 24
const MIN_USERNAME_LENGTH = 3
const EMAIL_VALIDATION_REGEX =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const USERNAME_VALIDATION_REGEX =
    /^([a-z0-9_](?:(?:[a-z0-9_]|(?:\.(?!\.))){0,28}(?:[a-z0-9_]))?)$/
const VALID_EXERCISE_WEIGHT_UNITS = ['lbs', 'kg'] // First unit is default shown upon adding set
const VALID_EXERCISE_REP_UNITS = ['sets', 'reps', 'secs', 'AMRAP'] // First unit is default shown upon adding set

/**
 * Methods to apply constraints on inputs
 *
 * Ensure inputs exist prior to validating constriants
 *
 * @param {string} input - The input variable to test constriants upon
 * @returns {string || true} True if the constraints are met, otherwise a human-readable string without a period detailing the constraint
 */

// Minimum 8 characters, maximum 100 characters, must contain an uppercase letter and a number
const passwordConstraint = password => {
    // Check length constraints
    if (
        password.length < MIN_PASSWORD_LENGTH ||
        password.length > MAX_PASSWORD_LENGTH
    )
        return 'Password must be between 8-100 characters'

    // Check character constraints
    if (!/[A-Z]/.test(password) || !/\d/.test(password))
        return 'Password must contain an uppercase letter and number'

    return true
}

// Validate email input utilizing regex & ensure email is in al lower case, to prevent users registering with the same email
const emailConstraint = email => {
    if (!EMAIL_VALIDATION_REGEX.test(email)) return 'Invalid email address'
    if (email.length > 320) return 'Email too long'

    return true
}

// Usernames must be alphanumeric, no capital letters, trailing or leading dots, or consecutive dots
const usernameConstraint = username => {
    if (
        username.length < MIN_USERNAME_LENGTH ||
        username.length > MAX_USERNAME_LENGTH
    )
        return 'Username must be between 3-24 characters'

    if (!USERNAME_VALIDATION_REGEX.test(username)) return 'Invalid username'

    return true
}

// First name must be less than 32 characters & only contain letters of the alphabet
const firstNameConstraint = first_name => {
    // Check whether or not name contains any letter which is not part of the alphabet
    if (/[^a-zA-Z]/.test(first_name))
        return 'First names can only include letters'

    if (first_name.length > 32)
        return 'First name must be less than 32 characters'

    return true
}

// First name must be less than 32 characters & only contain letters of the alphabet
const lastNameConstraint = last_name => {
    // Check whether or not name contains any letter which is not part of the alphabet
    if (/[^a-zA-Z]/.test(last_name))
        return 'Last names can only include letters'

    if (last_name.length > 32)
        return 'Last name must be less than 32 characters'

    return true
}

/**
 * Workout
 *
 * Constraints:
 *  - Name must be less than 128 characters
 *  - Description must be less than 256 characters
 *  - Id must exist
 *  - Must include 1 part
 *  - Must have less than 16 parts
 *  - Parts set unit must be a valid unit
 *  - Parts set value must be greater than 1, less than 1000
 *  - Parts rep unit must be a valid unit
 *  - Parts reps value must be between 0-10000
 */
const workoutConstraint = workout => {
    if (workout.name.length > 128)
        return 'Name must be less than 128 characters'
    if (workout.description.length > 256)
        return 'Description must be less than 256 characters'

    for (const exercise of workout.exercises) {
        if (!EXERCISES[exercise.id]) return 'Invalid exercise identifier'
        if (!exercise?.parts?.length)
            return 'Exercise must include atleast 1 part'
        if (exercise.parts.length > 16)
            return 'Exercise must have less than 16 parts'

        for (const part of exercise.parts) {
            if (!part.sets || part.sets > 1000)
                return 'Exercise sets must be between 1-1000'
            if (!part?.reps?.value || part?.reps?.value > 1000)
                return 'Exercise reps must be between 1-1000'
            if (!VALID_EXERCISE_REP_UNITS.includes(part?.reps?.unit))
                return 'Invalid exercise reps unit'
            if (part?.weight?.value < 0 || part?.weight?.value > 10000)
                return 'Exercise weight must be between 0-10000'
            if (!VALID_EXERCISE_WEIGHT_UNITS.includes(part?.weight?.unit))
                return 'Invalid exercise weight unit'
        }
    }

    return true
}

export {
    passwordConstraint,
    emailConstraint,
    usernameConstraint,
    firstNameConstraint,
    lastNameConstraint,
    workoutConstraint,
    VALID_EXERCISE_REP_UNITS,
    VALID_EXERCISE_WEIGHT_UNITS
}
