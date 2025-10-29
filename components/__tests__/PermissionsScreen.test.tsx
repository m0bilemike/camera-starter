import { fireEvent, render, waitFor } from '@testing-library/react-native'
import * as ExpoMediaLibrary from 'expo-media-library'
import { router } from 'expo-router'
import React from 'react'
import { Camera } from 'react-native-vision-camera'
import PermissionsScreen from '../../app/permissions'

jest.mock('expo-status-bar', () => ({
    StatusBar: () => null,
  }))
  
  jest.mock('expo-router', () => ({
    router: { replace: jest.fn() },
  }))
  
  jest.mock('expo-media-library', () => ({
    usePermissions: jest.fn(() => [{ granted: false }, jest.fn()]),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  }))
  
  jest.mock('react-native-vision-camera', () => ({
    Camera: {
      requestCameraPermission: jest.fn(() => Promise.resolve('granted')),
      requestMicrophonePermission: jest.fn(() => Promise.resolve('granted')),
    },
  }))
  jest.mock('@/components/permissions/PermissionsCard', () => {
    const React = require('react')
    const { Text, TouchableOpacity } = require('react-native')
    return {
      __esModule: true,
      default: ({ label, onSwitchChange }: any) => (
        <Text onPress={onSwitchChange}>{label}</Text>
      ),
    }
  })

// 🧪 --- Tests ---
describe('PermissionsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all permission cards and Continue button', () => {
    const { getByText } = render(<PermissionsScreen />)
    expect(getByText('Camera permissions')).toBeTruthy()
    expect(getByText('Microphone permissions')).toBeTruthy()
    expect(getByText('Media Library permissions')).toBeTruthy()
    expect(getByText('Continue')).toBeTruthy()
  })

  it('calls Camera.requestCameraPermission when toggling camera switch', async () => {
    const { getByText } = render(<PermissionsScreen />)
    const cameraLabel = getByText('Camera permissions')
    fireEvent.press(cameraLabel)
    await waitFor(() => {
      expect(Camera.requestCameraPermission).toHaveBeenCalled()
    })
  })

  it('calls Camera.requestMicrophonePermission when toggling microphone switch', async () => {
    const { getByText } = render(<PermissionsScreen />)
    const micLabel = getByText('Microphone permissions')
    fireEvent.press(micLabel)
    await waitFor(() => {
      expect(Camera.requestMicrophonePermission).toHaveBeenCalled()
    })
  })

  it('shows alert when not all permissions granted', async () => {
    global.alert = jest.fn()
    const { getByText } = render(<PermissionsScreen />)
    fireEvent.press(getByText('Continue'))
    expect(global.alert).toHaveBeenCalledWith('Please grant all permissions to continue.')
  })

  it('navigates to / when all permissions are granted', async () => {
    // Mock all permissions granted
    ;(ExpoMediaLibrary.usePermissions as jest.Mock).mockReturnValue([{ granted: true }, jest.fn()])
    const { getByText } = render(<PermissionsScreen />)

    // Simulate granting both camera + mic manually
    await waitFor(() => {
      fireEvent.press(getByText('Camera permissions'))
      fireEvent.press(getByText('Microphone permissions'))
    })

    // Now tap Continue
    fireEvent.press(getByText('Continue'))

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/')
    })
  })
})