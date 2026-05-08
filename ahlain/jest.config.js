module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-gesture-handler|@react-navigation|react-native-simple-toast|sp-react-native-in-app-updates|react-native-siren|react-native-share|react-native-webview|react-native-image-picker|react-native-permissions)/)',
  ],
};
