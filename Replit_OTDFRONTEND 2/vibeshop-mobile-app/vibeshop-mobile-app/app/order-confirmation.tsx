import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { PrimaryButton, Screen } from "@/components/ui";
import { useColors } from "@/hooks/useColors";

export default function OrderConfirmationScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [scale]);
  return <Screen><View style={styles.center}><Animated.View style={[styles.check, { transform: [{ scale }] }]}><Feather name="check" size={62} color="#FFFFFF" /></Animated.View><Text style={styles.title}>Order placed</Text><Text style={styles.text}>Your demo order is confirmed. The seller will prepare your fashion drop for delivery in India.</Text><PrimaryButton label="Back to Store" icon="shopping-bag" onPress={() => router.replace("/store")} /></View></Screen>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 18, paddingHorizontal: 22 },
    check: { width: 132, height: 132, borderRadius: 66, backgroundColor: colors.success, alignItems: "center", justifyContent: "center" },
    title: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 30, letterSpacing: -0.8 },
    text: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", textAlign: "center", fontSize: 15, lineHeight: 22 },
  });
}
