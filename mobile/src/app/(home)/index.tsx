import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  return (
    <Box className="flex-1 bg-background">

      <Center className="flex-1 gap-5">
        <Text className="font-semibold">
          Home Page
        </Text>
        <Button variant='default' onPress={() => {
          router.push('/(home)/home-nested');
        }}>
          <ButtonText>Go to nested home</ButtonText>
        </Button>
      </Center>
    </Box>
  );
}