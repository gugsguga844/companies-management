import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="fees" options={{ headerShown: false }} />
    </Stack>
  );
}