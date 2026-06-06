import { Fab, FabIcon } from '@/components/ui/fab';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { EditIcon, Icon, MoonIcon, SunIcon } from '@/components/ui/icon';
import './global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack, Tabs, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider, } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client';
import { setupReactQuery } from '@/lib/react-query';
import { ChartBarStacked, Home } from 'lucide-react-native';
import { authClient } from '@/lib/auth-client';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import useGlobalStore from '@/stores/globalStore';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}


function RootLayoutNav() {
  const { onboardingCompleted } = useGlobalStore();

  const [colorMode, setColorMode] = useState<'light' | 'dark' | 'system'>('light');

  const { data: session, isPending } = authClient.useSession();


  // useEffect(() => {
  //   setupReactQuery();
  // }, []);


  // if (isPending) {
  //   return (
  //     <GluestackUIProvider mode={colorMode} >
  //       <Box className="flex-1 items-center justify-center" >
  //         <Spinner color={colorMode === 'dark' ? 'white' : 'black'} size="large" />
  //       </Box>
  //     </GluestackUIProvider>
  //   );
  // }


  return (
    <ThemeProvider value={colorMode === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider mode={colorMode}>

          {/* <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} /> */}

          <QueryClientProvider client={queryClient}>

            <Stack>
              <Stack.Protected guard={!!session}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }} />
              </Stack.Protected>

              <Stack.Protected guard={!session && onboardingCompleted}>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
              </Stack.Protected>

              <Stack.Protected guard={!onboardingCompleted}>
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              </Stack.Protected>
            </Stack>

          </QueryClientProvider>

        </GluestackUIProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
