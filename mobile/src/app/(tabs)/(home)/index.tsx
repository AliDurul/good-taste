import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { authClient } from '@/lib/auth-client';

export default function HomePage() {
  const router = useRouter();

  function handleAlert(message: string) {
    Alert.alert('Confirmation', message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => router.push('/second'),
      },
    ]);
  }

  const logout = async () => {
    await authClient.signOut();

    console.log('Logged out, current cookie:', authClient.getCookie())
  };
  return (
    <Box className="flex-1 bg-background">

      <Center className="flex-1 gap-5">
        <Text className="font-semibold">
          Home Page
        </Text>
        <Button variant='default' onPress={() => {
          router.push('/home-nested');
        }}>
          <ButtonText>Go to nested home</ButtonText>
        </Button>

        <Button variant='outline' onPress={() => {
          handleAlert('Go to second page?');
        }}>
          <ButtonText>Go to second</ButtonText>
        </Button>

        <Link href="/modal" asChild>
          <Button variant='secondary'>
            <ButtonText>Go to modal</ButtonText>
          </Button>
        </Link>

        <Button variant='outline' onPress={() => {
          logout();
        }}>
          <ButtonText>Logout </ButtonText>
        </Button>

      </Center>
    </Box>
  );
}