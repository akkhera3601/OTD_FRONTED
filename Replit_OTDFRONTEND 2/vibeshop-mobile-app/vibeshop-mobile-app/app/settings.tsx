import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Header, Screen } from "@/components/ui";
import { useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function SettingsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { themeMode, setThemeMode } = useAppState();
  return <Screen scroll><Header title="Settings" /><View style={styles.group}><Row icon="user" label="Account settings" /><Row icon="lock" label="Privacy settings" /><Row icon="bell" label="Notifications" onPress={() => router.push("/notifications")} /><Pressable onPress={() => setThemeMode(themeMode === "light" ? "system" : "light")} style={styles.row}><Feather name="sun" size={20} color={colors.primary} /><View style={{ flex: 1 }}><Text style={styles.rowTitle}>Light mode preference</Text><Text style={styles.rowSub}>{themeMode === "light" ? "Forced light theme" : "Follows system when available"}</Text></View><Feather name={themeMode === "light" ? "toggle-right" : "toggle-left"} size={28} color={colors.primary} /></Pressable><Row icon="log-out" label="Logout" danger /></View></Screen>;
}

function Row({ icon, label, onPress, danger }: { icon: keyof typeof Feather.glyphMap; label: string; onPress?: () => void; danger?: boolean }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <Pressable onPress={onPress} style={styles.row}><Feather name={icon} size={20} color={danger ? colors.destructive : colors.primary} /><Text style={[styles.rowTitle, danger && { color: colors.destructive }]}>{label}</Text><Feather name="chevron-right" size={20} color={colors.mutedForeground} /></Pressable>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    group: { backgroundColor: colors.card, borderRadius: 26, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
    row: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    rowTitle: { flex: 1, color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 15 },
    rowSub: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 },
  });
}
