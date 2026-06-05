import React from 'react'
import { Box } from '@/components/ui/box'
import { Center } from '@/components/ui/center'
import { Text } from '@/components/ui/text'
import { Link } from 'expo-router'
import { Button, ButtonText } from '@/components/ui/button'
import { VStack } from '@/components/ui/vstack'

export default function SecondNested() {
    return (
        <Box className="flex-1 bg-background ">
            <Center className="flex-1">
                <VStack className="gap-5 items-center">
                    <Text className="text-foreground">Nested</Text>
                    <Link href="/second/nested" asChild>
                        <Button variant='outline'>
                            <ButtonText>Go to also nested</ButtonText>
                        </Button>
                    </Link>
                </VStack>
            </Center>
        </Box>
    )
}