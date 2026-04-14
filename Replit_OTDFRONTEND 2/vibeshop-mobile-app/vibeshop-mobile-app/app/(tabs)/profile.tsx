import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Avatar, ImageTile, PrimaryButton, ProductCard, Screen } from "@/components/ui";
import { products, useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

const cover = require("@/assets/images/sale-banner.png");

export default function ProfileScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { users, drops, profile, wishlist } = useAppState();
  const [tab, setTab] = useState("Drops");
  const own = { ...users[0], ...profile };
  const ownDrops = drops.filter((drop) => drop.userId === "u1");
  return <Screen scroll><View style={styles.headerLine}><Text style={styles.headerTitle}>Profile</Text><View style={styles.headerActions}><Pressable onPress={() => router.push("/upload")}><Feather name="plus-square" size={23} color={colors.primary} /></Pressable><Pressable onPress={() => router.push("/settings")}><Feather name="settings" size={23} color={colors.foreground} /></Pressable></View></View><View style={styles.coverWrap}><Image source={cover} style={styles.cover} /><View style={styles.avatarWrap}><Avatar user={own} size={92} /></View></View><View style={styles.identity}><Text style={styles.name}>{own.name}</Text><Text style={styles.username}>@{own.username}</Text><Text style={styles.bio}>{own.bio}</Text><Text style={styles.meta}>{own.location} · {own.website}</Text></View><View style={styles.stats}><Stat label="Drops" value={`${ownDrops.length || own.drops}`} /><Stat label="Fans" value={own.fans} /><Stat label="Vibes" value={own.vibes} /></View><View style={styles.actions}><PrimaryButton label="Edit Profile" icon="edit-3" onPress={() => router.push("/profile/edit")} /><PrimaryButton label="Upload Drop" icon="plus-square" muted onPress={() => router.push("/upload")} /></View><View style={styles.tabs}>{["Drops", "Tagged", "Shop", "Saved"].map((item) => <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text></Pressable>)}</View>{tab === "Shop" ? <View style={styles.grid}>{products.map((product) => <ProductCard key={product.id} product={product} />)}</View> : tab === "Saved" ? <View style={styles.grid}>{products.filter((product) => wishlist.includes(product.id)).map((product) => <ProductCard key={product.id} product={product} />)}</View> : <View style={styles.tileGrid}>{(ownDrops.length ? ownDrops : drops).map((drop) => <ImageTile key={drop.id} source={drop.image} label={tab === "Tagged" ? "Tagged Drop" : "Drop"} />)}</View>}</Screen>;
}

function Stat({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return <View style={{ flex: 1, alignItems: "center", gap: 3 }}><Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 18 }}>{value}</Text><Text style={{ color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 12 }}>{label}</Text></View>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    headerLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerTitle: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 24 },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 16 },
    coverWrap: { height: 180, borderRadius: 30, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: 44 },
    cover: { width: "100%", height: "100%" },
    avatarWrap: { position: "absolute", bottom: -38, alignSelf: "center", borderRadius: 54, padding: 4, backgroundColor: colors.background },
    identity: { alignItems: "center", gap: 6 },
    name: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: -0.5 },
    username: { color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 14 },
    bio: { color: colors.foreground, textAlign: "center", fontFamily: "Inter_500Medium", fontSize: 14, lineHeight: 20 },
    meta: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 12 },
    stats: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border, paddingVertical: 16 },
    actions: { flexDirection: "row", gap: 10 },
    tabs: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 20, padding: 5, borderWidth: 1, borderColor: colors.border },
    tab: { flex: 1, borderRadius: 16, paddingVertical: 10, alignItems: "center" },
    tabActive: { backgroundColor: colors.primary },
    tabText: { color: colors.mutedForeground, fontFamily: "Inter_700Bold", fontSize: 12 },
    tabTextActive: { color: colors.primaryForeground },
    tileGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  });
}
