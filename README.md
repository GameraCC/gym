# gym

Work-In-Progress Gym app


https://user-images.githubusercontent.com/54292532/218234342-21d7b6ea-c226-4a33-ad6f-2c8cca1b1fb4.mp4



https://user-images.githubusercontent.com/54292532/218234226-dcb50f36-d568-4f3f-8c37-0bb275050361.mp4

## Usage
1) Install dependencies
```npm install```
2) Run EXPO


Windows:
```npm run start-win```

Mac:
```npm run start-win```

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
