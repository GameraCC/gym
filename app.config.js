// import {background} from '@assets/colors'
// import Images from '@assets/images'

const config = {
    expo: {
        entryPoint: './src/App.js',
        name: 'gym',
        slug: 'gym',
        version: '1.0.0',
        orientation: 'portrait',
        // icon: Images.ICON,
        userInterfaceStyle: 'light',
        // splash: {
        //     image: Images.SPLASH,
        //     resizeMode: 'contain',
        //     backgroundColor: background
        // },
        updates: {
            fallbackToCacheTimeout: 0
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true
        },
        // android: {
        //     adaptiveIcon: {
        //         foregroundImage: Images.ICON,
        //         backgroundColor: background
        //     }
        // },
        extra: {
            HOST: process.env.STAGING.includes('true')
                ? '22mshiq76j.execute-api.us-east-1.amazonaws.com'
                : ''
        }
    }
}

export default config
