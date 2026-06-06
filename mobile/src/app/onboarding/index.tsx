import { View, Text } from 'react-native'
import React from 'react'
import { Button, ButtonText } from '@/components/ui/button'
import { Link } from 'expo-router'

export default function Onboarding() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text>Onboarding 1</Text>
            <Link href="/onboarding/final" asChild>
                <Button variant="link" className="mt-4">
                    <ButtonText>Next</ButtonText>
                </Button>
            </Link>
        </View>
    )
}