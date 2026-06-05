import Logo from '../../../../assets/icons/Logo';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import React from 'react';

export default function Third() {
  return (
    <Box className="flex-1 bg-background">
      <Center className="flex-1 gap-5">
        <Logo />
        <Text className="font-semibold">
          Third
        </Text>
      </Center>
    </Box>
  );
}