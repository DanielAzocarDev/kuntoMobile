import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { useAuthInit } from "../hooks/useAuthInit";
import { useAppStore } from "../store";
import { ActivityIndicator, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const InitialLayout = () => {
  const { isHydrated } = useAuthInit();
  const token = useAppStore((state) => state.token);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (token && !inAuthGroup) {
      router.replace("/dashboard");
    } else if (!token && inAuthGroup) {
      router.replace("/welcome");
    }

    SplashScreen.hideAsync();
  }, [isHydrated, token, segments, router]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <InitialLayout />
    </QueryClientProvider>
  );
}
