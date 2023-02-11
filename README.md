# gym

Gym app

## Usage
1) Install dependencies
...`npm install`
2) Windows:
...`npm run start-win`
2) Mac:
...`npm run start-win`

## Components Modularity

Seperate large components into very modularized components, each with their own individual styles for maintainability and scalability. If an item has a child component such as a Seperator component, or an Item component which does not use many styles, and has no external dependencies its alright to include that component in the same file.

Sort folders by their navigators e.g:

```c#

componentWithTabNavigator
    > workouts
        index.js
        > stacks
            > create-workout
                > components
                    - CreateButton.js
                index.js
    > feed
        > screenTwoComponents
            - Item.js
        index.js


```

## Component Imports Styling

```js
// Non-component / asset imports
1. React Imports
2. React Native Imports
3. React Redux Imports
4. React Redux Actions Imports
5. React Native Reanimated Imports
6. All other component library imports
7. React Navigation Imports
8. Expo Imports

SPACE

1. Component Imports

SPACE

1. Asset Imports
```
