
import PermissionsCard from '../components/permissions/PermissionsCard';
import * as ExpoMediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { Text, View } from '../components/Themed';

export default function PermissionsScreen() {
  const [ cameraPermissionStatus, setCameraPermissionStatus ] = useState<CameraPermissionStatus>('not-determined');
  const [ microphonePermissionStatus, setMicrophonePermissionStatus ] = useState<CameraPermissionStatus>('not-determined');
  const [ mediaLibraryPermissionStatus, setMediaLibraryPermissions ] = useState<ExpoMediaLibrary.PermissionResponse | null>(null);
  
  const requestCameraPermissions = async () => {
    const permissions = await Camera.requestCameraPermission();
    setCameraPermissionStatus(permissions);
  };

  const requestMicrophonePermission = async () => {
    const permissions = await Camera.requestMicrophonePermission();
    setMicrophonePermissionStatus(permissions);
  };

  const requestMediaLibraryPermission = async () => {
    const permissions = await ExpoMediaLibrary.requestPermissionsAsync()
    setMediaLibraryPermissions(permissions);
  };

  const handleContinue = () => {
    if (cameraPermissionStatus === "granted" &&
      microphonePermissionStatus === "granted" &&
      mediaLibraryPermissionStatus?.granted
    ) {
      router.replace('/');
    } else {
      alert('Please grant all permissions to continue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions</Text>
      <PermissionsCard
        label="Camera permissions"
        showSwitch
        switchValue={cameraPermissionStatus === "granted"}
        onSwitchChange={requestCameraPermissions}
      />
      <PermissionsCard
        label="Microphone permissions"
        showSwitch
        switchValue={microphonePermissionStatus === "granted"}
        onSwitchChange={requestMicrophonePermission}
      />
      <PermissionsCard
        label="Media Library permissions"
        showSwitch
        switchValue={mediaLibraryPermissionStatus?.granted === true}
        onSwitchChange={requestMediaLibraryPermission}
      />
      <TouchableOpacity
        onPress={handleContinue}
      >
        <Text>Continue</Text>
      </TouchableOpacity>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
