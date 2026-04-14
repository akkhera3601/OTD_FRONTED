import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Chip, Header, IconButton, ProductCard, Screen, SectionTitle } from "@/components/ui";
import { useAppState } from "@/context/AppState";
import { categories, products } from "@/data/social";
import { useColors } from "@/hooks/useColors";

const banner = require("@/assets/images/sale-banner.png");

export default function StoreScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { cart } = useAppState();
  const [category, setCategory] = useState("All");
  const visible = category === "All" || category === "Sale" ? products : products.filter((product) => product.category === category);

  return <Screen scroll><Header title="Store" right={<Pressable onPress={() => router.push("/cart")} style={styles.cartButton}><Feather name="shopping-bag" size={22} color={colors.foreground} />{cart.length ? <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View> : null}</Pressable>} /><View style={styles.banner}><Image source={banner} style={styles.bannerImage} /><View style={styles.bannerText}><Text style={styles.bannerLabel}>Fresh Indian fashion drops</Text><Text style={styles.bannerTitle}>Creator picks from ₹999</Text><Text style={styles.bannerCopy}>Swipe through sale edits, new arrivals, and everyday fits.</Text></View></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>{categories.map((item) => <Chip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}</ScrollView><SectionTitle title="Featured Products" action={<IconButton name="shopping-cart" onPress={() => router.push("/cart")} />} /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featured}>{products.map((product) => <ProductCard key={product.id} product={product} compact />)}</ScrollView><SectionTitle title="All Products" /><View style={styles.grid}>{visible.map((product) => <ProductCard key={product.id} product={product} />)}</View></Screen>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    cartButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
    badge: { position: "absolute", top: -3, right: -3, backgroundColor: colors.accent, width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    badgeText: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 11 },
    banner: { height: 190, borderRadius: 30, overflow: "hidden", backgroundColor: colors.primary },
    bannerImage: { width: "100%", height: "100%" },
    bannerText: { position: "absolute", left: 20, right: 20, bottom: 18, gap: 5 },
    bannerLabel: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 12 },
    bannerTitle: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: -0.6 },
    bannerCopy: { color: "#FFFFFF", fontFamily: "Inter_500Medium", fontSize: 13, opacity: 0.92 },
    categories: { gap: 10, paddingRight: 18 },
    featured: { gap: 12, paddingRight: 18 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  });
}
