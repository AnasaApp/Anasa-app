// Jest setup: mock native AsyncStorage to avoid native module errors during tests
const mockAsyncStorage = require('@react-native-async-storage/async-storage/jest/async-storage-mock');

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Silence native timer warnings if any
jest.useFakeTimers && jest.useFakeTimers();

// Mock sp-react-native-in-app-updates (and other native-heavy libs) for tests
jest.mock('sp-react-native-in-app-updates', () => ({
	__esModule: true,
	default: null,
	IAUUpdateKind: {},
	StartUpdateOptions: {},
	IAUInstallStatus: {},
}));

// Mock react-native-simple-toast to prevent native module errors in tests
jest.mock('react-native-simple-toast', () => ({
	SHORT: 0,
	LONG: 1,
	show: jest.fn(),
	showWithGravity: jest.fn(),
}));
