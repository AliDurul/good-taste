import { Box } from '@/components/ui/box'
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text'
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react'

export default function ProductDetail() {
  const params = useLocalSearchParams<{ productId: string }>();

  return (
    <Box className="flex-1 bg-background">
      <Stack.Screen options={{ title: `Detail of ${params.productId}` }} />

      <Center className="flex-1">
        <Text className="text-foreground">ProductDetail {params.productId}</Text>

        <Link href="/products/">
          <Text className="text-blue-500">Go back to Product List</Text>
        </Link>

      </Center>

    </Box>
  )
}
