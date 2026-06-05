import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function SecondLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Second' }} />
            <Stack.Screen name="nested" options={{ title: 'Nested' }} />
            <Stack.Screen name="also-nested" options={{ title: 'Also Nested' }} />
        </Stack>
    )
}