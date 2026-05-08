module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // must be last
  ],
  env: {
    production: {
      // removing console.log from app during release (production) versions
      plugins: ['transform-remove-console', 'react-native-reanimated/plugin'],
    },
  },
};
