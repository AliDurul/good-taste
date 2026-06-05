import { Button } from '@/components/ui/button';
import Logo from '../../assets/icons/Logo';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import React from 'react';

export default function Second() {
  return (
    <Box className="flex-1 bg-background">
      <Center className="flex-1 gap-5">
        <Logo />
        <Text className="font-semibold">
          Second
        </Text>
        <Link href="/third/fourth" push>Go to Third</Link>
        
      </Center>
    </Box>
  );
}