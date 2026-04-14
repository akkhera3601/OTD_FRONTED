import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Avatar, DropCard, formatRupee, PrimaryButton, Screen, SectionTitle } from "@/components/ui";
import { products, useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((item) => item.id === id) ?? products[0];
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist, users, drops } = useAppState();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const taggedDrops = drops.filter((drop) => drop.productId === product.id);

  return <View style={styles.root}><Screen scroll><View style={styles.topBar}><Pressable onPress={() => router.back()} style={styles.iconCircle}><Feather name="chevron-left" size={24} color={colors.foreground} /></Pressable><Pressable onPress={() => router.push("/cart")} style={styles.iconCircle}><Feather name="shopping-bag" size={22} color={colors.foreground} /></Pressable></View><Image source={product.image} style={styles.hero} /><View style={styles.titleRow}><View style={{ flex: 1 }}><Text style={styles.brand}>{product.brand}</Text><Text style={styles.name}>{product.name}</Text></View><Pressable onPress={() => toggleWishlist(product.id)} style={styles.iconCircle}><Feather name="heart" size={22} color={wishlist.includes(product.id) ? colors.accent : colors.foreground} /></Pressable></View><View style={styles.rating}><Feather name="star" size={16} color="#F59E0B" /><Text style={styles.meta}>{product.rating} rating from {product.reviews} reviews</Text></View><View style={styles.priceRow}><Text style={styles.price}>{formatRupee(product.price)}</Text>{product.originalPrice ? <Text style={styles.old}>{formatRupee(product.originalPrice)}</Text> : null}</View><SectionTitle title="Select Size" /><View style={styles.rowWrap}>{product.sizes.map((item) => <Pressable key={item} onPress={() => setSize(item)} style={[styles.size, size === item && styles.activeSize]}><Text style={[styles.sizeText, size === item && styles.activeSizeText]}>{item}</Text></Pressable>)}</View><SectionTitle title="Select Color" /><View style={styles.rowWrap}>{product.colors.map((item) => <Pressable key={item} onPress={() => setColor(item)} style={[styles.colorRing, color === item && { borderColor: colors.primary }]}><View style={[styles.colorDot, { backgroundColor: item }]} /></Pressable>)}</View><Text style={styles.description}>{product.description}</Text><SectionTitle title="Seen in Drops" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 18 }}>{taggedDrops.map((drop) => <View key={drop.id} style={{ width: 250 }}><DropCard drop={drop} /></View>)}</ScrollView><SectionTitle title="Reviews" /><View style={styles.review}>{users.slice(1, 3).map((user) => <View key={user.id} style={styles.reviewRow}><Avatar user={user} size={38} /><View style={{ flex: 1 }}><Text style={styles.reviewName}>{user.name}</Text><Text style={styles.reviewText}>Loved the fit and delivery was quick. Perfect for Indian weather.</Text></View></View>)}</View></Screen><View style={styles.sticky}><PrimaryButton label="Wishlist" icon="heart" muted onPress={() => toggleWishlist(product.id)} /><PrimaryButton label="Add to Cart" icon="shopping-cart" onPress={() => addToCart(product.id, size, color)} /><PrimaryButton label="Buy Now" icon="zap" onPress={() => { addToCart(product.id, size, color); router.push("/checkout"); }} /></View></View>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    topBar: { flexDirection: "row", justifyContent: "space-between" },
    iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
    hero: { width: "100%", height: 370, borderRadius: 34, backgroundColor: colors.muted },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    brand: { color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 13 },
    name: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.6 },
    rating: { flexDirection: "row", gap: 6, alignItems: "center" },
    meta: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 13 },
    priceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    price: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 24 },
    old: { color: colors.mutedForeground, textDecorationLine: "line-through", fontFamily: "Inter_600SemiBold" },
    rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    size: { minWidth: 48, height: 44, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
    activeSize: { backgroundColor: colors.primary, borderColor: colors.primary },
    sizeText: { color: colors.foreground, fontFamily: "Inter_700Bold" },
    activeSizeText: { color: colors.primaryForeground },
    colorRing: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
    colorDot: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.border },
    description: { color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 15, lineHeight: 23 },
    review: { backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 14 },
    reviewRow: { flexDirection: "row", gap: 10 },
    reviewName: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 },
    reviewText: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13, lineHeight: 19 },
    sticky: { position: "absolute", left: 12, right: 12, bottom: 14, flexDirection: "row", gap: 8, padding: 10, borderRadius: 26, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  });
}
