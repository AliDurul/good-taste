import { View, Text } from 'react-native'
import React from 'react'
import { Button, ButtonText } from '@/components/ui/button'
import useGlobalStore from '@/stores/globalStore';

export default function FinalOnboarding() {
    const { setOnboardingCompleted } = useGlobalStore();

    return (
        <View className="flex-1 items-center justify-center">
            <Text>FinalOnboarding</Text>
            <Button onPress={() => {
                setOnboardingCompleted(true);
            }}>
                <ButtonText>Complete Onboarding</ButtonText>
            </Button>
        </View>
    )
}