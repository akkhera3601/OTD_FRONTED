import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Header, Screen } from "@/components/ui";
import { useColors } from "@/hooks/useColors";

const items = ["Aarohi liked your Drop", "Mira added a new festive co-ord", "Your cart item is still available", "Kabir shared a sneaker Drop"];

export default function NotificationsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <Screen scroll><Header title="Notifications" />{items.map((item) => <View key={item} style={styles.item}><View style={styles.icon}><Feather name="bell" size={18} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.title}>{item}</Text><Text style={styles.time}>Just now</Text></View></View>)}</Screen>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    item: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.card, borderRadius: 22, borderWidth: 1, borderColor: colors.border, padding: 14 },
    icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" },
    title: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 },
    time: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 12, marginTop: 3 },
  });
}
