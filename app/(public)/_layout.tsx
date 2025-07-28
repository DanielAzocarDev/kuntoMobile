import { Redirect, Stack } from "expo-router";
import { useAppStore } from "../../store";
import React from "react";

export default function PublicLayout() {
  const token = useAppStore((state) => state.token);

  if (token) {
    return <Redirect href="/dashboard" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
