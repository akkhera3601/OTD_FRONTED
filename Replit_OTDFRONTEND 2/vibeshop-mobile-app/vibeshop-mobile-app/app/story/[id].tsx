import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/ui";
import { useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function StoryViewerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { users, drops } = useAppState();
  const user = users.find((item) => item.id === id) ?? users[0];
  const drop = drops.find((item) => item.userId === user.id) ?? drops[0];
  const progress = useRef(new Animated.Value(0)).current;
  const aura = useRef(new Animated.Value(1)).current;
  const [selected, setSelected] = useState("AURA");
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 5000, useNativeDriver: false }).start(({ finished }) => finished && router.back());
  }, [progress, router]);
  const react = (label: string) => {
    setSelected(label);
    aura.setValue(0.86);
    Animated.spring(aura, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };
  return <View style={styles.root}><Image source={drop.image} style={styles.image} /><View style={[styles.overlay, { paddingTop: insets.top + 10 }]}><View style={styles.track}><Animated.View style={[styles.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} /></View><View style={styles.header}><Avatar user={user} size={42} /><Text style={styles.name}>{user.username}</Text><Text style={styles.time}>5m</Text><Pressable onPress={() => router.back()} style={{ marginLeft: "auto" }}><Feather name="x" size={26} color="#FFFFFF" /></Pressable></View></View><Animated.View style={[styles.reactions, { bottom: Math.max(insets.bottom + 72, 92), transform: [{ scale: aura }] }]}>{["AURA", "Reply", "Rating"].map((item) => <Pressable key={item} onPress={() => react(item)} style={[styles.reactionButton, selected === item && styles.reactionActive]}><Text style={[styles.reactionText, selected === item && styles.reactionTextActive]}>{item}</Text></Pressable>)}</Animated.View><View style={[styles.reply, { bottom: Math.max(insets.bottom, 18) }]}><TextInput placeholder="Reply to story" placeholderTextColor="rgba(255,255,255,0.72)" style={styles.input} /><Feather name="send" size={22} color="#FFFFFF" /></View></View>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: "#000000" },
    image: { width: "100%", height: "100%" },
    overlay: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 14, gap: 12 },
    track: { height: 4, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.35)", overflow: "hidden" },
    fill: { height: 4, backgroundColor: colors.accent },
    header: { flexDirection: "row", alignItems: "center", gap: 10 },
    name: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 14 },
    time: { color: "rgba(255,255,255,0.75)", fontFamily: "Inter_600SemiBold", fontSize: 12 },
    reactions: { position: "absolute", alignSelf: "center", flexDirection: "row", gap: 8, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 999, padding: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.28)" },
    reactionButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.16)" },
    reactionActive: { backgroundColor: colors.accent },
    reactionText: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 12 },
    reactionTextActive: { color: "#FFFFFF" },
    reply: { position: "absolute", left: 14, right: 14, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", borderRadius: 26, paddingHorizontal: 16, height: 52 },
    input: { flex: 1, color: "#FFFFFF", fontFamily: "Inter_500Medium", outlineStyle: "none" as never },
  });
}
