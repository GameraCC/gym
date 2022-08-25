import {background} from './src/components/colors'

const config = {
    expo: {
        entryPoint: './src/App.js',
        name: 'gym',
        slug: 'gym',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './src/assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './src/assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: background
        },
        updates: {
            fallbackToCacheTimeout: 0
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './src/assets/icon.png',
                backgroundColor: background
            }
        },
        web: {
            favicon: './src/assets/favicon.png'
        },
        extra: {
            HOST: process.env.STAGING.includes('true')
                ? '22mshiq76j.execute-api.us-east-1.amazonaws.com'
                : ''
        }
    }
}

export default config
