import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Avatar, ImageTile, PrimaryButton, Screen } from "@/components/ui";
import { chats, useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

const cover = require("@/assets/images/sale-banner.png");

export default function OtherProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { users, drops, toggleFollow } = useAppState();
  const user = users.find((item) => item.id === id) ?? users[1];
  const userDrops = drops.filter((drop) => drop.userId === user.id);
  const chat = chats.find((item) => item.userId === user.id) ?? chats[0];
  return <Screen scroll><View style={styles.top}><Pressable onPress={() => router.back()}><Feather name="chevron-left" size={28} color={colors.foreground} /></Pressable><Pressable><Feather name="more-horizontal" size={26} color={colors.foreground} /></Pressable></View><View style={styles.coverWrap}><Image source={cover} style={styles.cover} /><View style={styles.avatarWrap}><Avatar user={user} size={90} /></View></View><View style={styles.identity}><Text style={styles.name}>{user.name}</Text><Text style={styles.username}>@{user.username}</Text><Text style={styles.bio}>{user.bio}</Text><Text style={styles.meta}>{user.location} · {user.website}</Text></View><View style={styles.stats}><Stat label="Drops" value={`${user.drops}`} /><Stat label="Fans" value={user.fans} /><Stat label="Vibes" value={user.vibes} /></View><View style={styles.actions}><PrimaryButton label={user.following ? "Following" : "Follow"} icon="user-plus" onPress={() => toggleFollow(user.id)} /><PrimaryButton label="Message" icon="message-circle" muted onPress={() => router.push(`/chat/${chat.id}`)} /></View><View style={styles.tileGrid}>{(userDrops.length ? userDrops : drops).map((drop) => <ImageTile key={drop.id} source={drop.image} label="Drop" />)}</View></Screen>;
}

function Stat({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return <View style={{ flex: 1, alignItems: "center", gap: 3 }}><Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 18 }}>{value}</Text><Text style={{ color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 12 }}>{label}</Text></View>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    coverWrap: { height: 176, borderRadius: 30, overflow: "hidden", marginBottom: 42, backgroundColor: colors.card },
    cover: { width: "100%", height: "100%" },
    avatarWrap: { position: "absolute", bottom: -38, alignSelf: "center", borderRadius: 52, padding: 4, backgroundColor: colors.background },
    identity: { alignItems: "center", gap: 6 },
    name: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 24 },
    username: { color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 14 },
    bio: { color: colors.foreground, textAlign: "center", fontFamily: "Inter_500Medium", lineHeight: 20 },
    meta: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 12 },
    stats: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border, paddingVertical: 16 },
    actions: { flexDirection: "row", gap: 10 },
    tileGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  });
}
