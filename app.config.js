const config = {
    expo: {
        entryPoint: './src/App.js',
        name: 'gym',
        slug: 'gym',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './src/assets/app/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './src/assets/app/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#fff'
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
                foregroundImage: './src/assets/app/icon.png',
                backgroundColor: '#fff'
            }
        },
        extra: {
            HOST: process.env.STAGING.includes('true')
                ? '22mshiq76j.execute-api.us-east-1.amazonaws.com'
                : ''
        }
    }
}

export default config
