import '@testing-library/jest-native/extend-expect';
import mockAsyncStorage from 'jest-mock-async-storage';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
if (typeof global.setImmediate === 'undefined') {
    global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args)
    global.clearImmediate = (id) => clearTimeout(id)
  }