import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { connectSocket, socket } from '@/api/socket';

const RootLayout = () => {
  useEffect(() => {~~
    connectSocket();

    return () => {
        socket.disconnect();
    };
}, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(main)/Profile' options={{ presentation: 'modal' }} />
    </Stack>
  )
}

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <RootLayout />
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})