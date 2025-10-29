import * as MediaLibrary from 'expo-media-library'
import { Redirect } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated'
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import { Text } from '../components/Themed'

export default function CameraScreen() {
  const { hasPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  const cameraRef = useRef<Camera>(null)
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const opacity = useSharedValue(1)
  const translateY = useSharedValue(0)
  const cameraStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))
  const shouldRetake = useSharedValue(false)

useEffect(() => {
  if (shouldRetake.value) {
    retakePhoto()
    shouldRetake.value = false
  }
}, [shouldRetake.value])

const swipeDownGesture = Gesture.Pan()
  .onUpdate(event => {
    if (event.translationY > 0) {
      translateY.value = event.translationY
    }
  })
  .onEnd(event => {
    if (event.translationY > 120) {
      shouldRetake.value = true
      translateY.value = withTiming(0)
    } else {
      translateY.value = withSpring(0)
    }
  })
  
  const previewStyle = useAnimatedStyle(() => ({
    opacity: 1 - opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  if (!hasPermission) {
    return <Redirect href="/permissions" />
  }

  if (!device) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No camera found 😭</Text>
      </View>
    )
  }

  const takePhoto = async () => {
  if (cameraRef.current == null) return
  try {
    const photo = await cameraRef.current.takePhoto({ flash: 'off' })
    setPhotoUri('file://' + photo.path)
    opacity.value = withTiming(0, { duration: 500 })
  } catch (e) {
    console.error('Failed to take photo:', e)
  }
}

const retakePhoto = () => {
  opacity.value = withTiming(1, { duration: 500 })
  setTimeout(() => setPhotoUri(null), 500)
}

return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Animated.View style={[StyleSheet.absoluteFill, cameraStyle]}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={opacity.value === 1}
          photo={true}
        />
        <Text style={{ color: 'white', textAlign: 'center', marginBottom: 10 }}>
            Swipe down to dismiss
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={styles.captureText}>📸</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
  
      {photoUri && (
  <GestureDetector gesture={swipeDownGesture}>
    <Animated.View style={[StyleSheet.absoluteFill, previewStyle]}>
      <Image
        source={{ uri: photoUri }}
        style={{ flex: 1, resizeMode: 'contain' }}
      />
      <View style={styles.previewControls}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={retakePhoto}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'green' }]}
          onPress={async () => {
            await MediaLibrary.createAssetAsync(photoUri)
            console.log('Saved to gallery!')
            retakePhoto()
          }}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  </GestureDetector>
)}
    </View>
  )
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'white',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  captureText: {
    fontSize: 30,
  },
  previewControls: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
})