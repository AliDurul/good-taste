import { Box } from '@/components/ui/box'
import { Center } from '@/components/ui/center'
import { Text } from '@/components/ui/text'
import { Link } from 'expo-router'
import React from 'react'

export default function ProductPage() {
    return (
        <Box className="flex-1 bg-background ">
            <Center className="flex-1">
                <Text className="text-foreground">ProductPage</Text>
                <Link href={{
                    pathname: '/products/[productId]',
                    params: { productId: 12 }
                }}>
                    Go to Product Detail
                </Link>
            </Center>
        </Box>
    )
}
