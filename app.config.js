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
            backgroundColor: '#1a1a1a'
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
                backgroundColor: '#1a1a1a'
            }
        },
        web: {
            favicon: './src/assets/favicon.png'
        },
        extra: {
            HOST: process.env.STAGING.includes('true')
                ? 'eoqmywmvv0.execute-api.us-east-1.amazonaws.com'
                : ''
        }
    }
}

export default config
