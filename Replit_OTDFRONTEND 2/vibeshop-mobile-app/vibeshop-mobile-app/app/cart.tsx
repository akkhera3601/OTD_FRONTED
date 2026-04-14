import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { formatRupee, Header, PrimaryButton, Screen } from "@/components/ui";
import { products, useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function CartScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { cart, incrementCart, decrementCart, removeFromCart } = useAppState();
  const subtotal = cart.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity, 0);
  const delivery = subtotal > 1999 || subtotal === 0 ? 0 : 99;

  return <Screen scroll><Header title="Cart" right={<Pressable onPress={() => router.back()}><Feather name="x" size={24} color={colors.foreground} /></Pressable>} />{cart.length === 0 ? <View style={styles.empty}><Feather name="shopping-bag" size={42} color={colors.primary} /><Text style={styles.emptyTitle}>Your cart is empty</Text><Text style={styles.emptyText}>Add creator-tagged clothes and checkout in rupees.</Text><PrimaryButton label="Go to Store" icon="shopping-bag" onPress={() => router.push("/store")} /></View> : <><View style={styles.items}>{cart.map((item) => { const product = products.find((entry) => entry.id === item.productId) ?? products[0]; return <View key={`${item.productId}-${item.size}-${item.color}`} style={styles.cartRow}><Image source={product.image} style={styles.image} /><View style={{ flex: 1 }}><Text style={styles.name}>{product.name}</Text><Text style={styles.meta}>{item.size} · {formatRupee(product.price)}</Text><View style={styles.qty}><Pressable onPress={() => decrementCart(product.id)}><Feather name="minus-circle" size={22} color={colors.primary} /></Pressable><Text style={styles.qtyText}>{item.quantity}</Text><Pressable onPress={() => incrementCart(product.id)}><Feather name="plus-circle" size={22} color={colors.primary} /></Pressable></View></View><Pressable onPress={() => removeFromCart(product.id)}><Feather name="trash-2" size={20} color={colors.destructive} /></Pressable></View>; })}</View><View style={styles.summary}><Summary label="Subtotal" value={formatRupee(subtotal)} /><Summary label="Delivery" value={delivery ? formatRupee(delivery) : "Free"} /><View style={styles.line} /><Summary label="Total" value={formatRupee(subtotal + delivery)} strong /></View><PrimaryButton label="Proceed to Checkout" icon="credit-card" onPress={() => router.push("/checkout")} /></>}</Screen>;
}

function Summary({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  const colors = useColors();
  return <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: strong ? colors.foreground : colors.mutedForeground, fontFamily: strong ? "Inter_700Bold" : "Inter_600SemiBold", fontSize: strong ? 18 : 14 }}>{label}</Text><Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: strong ? 18 : 14 }}>{value}</Text></View>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    items: { gap: 12 },
    cartRow: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 12 },
    image: { width: 82, height: 82, borderRadius: 18 },
    name: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 15 },
    meta: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 12, marginTop: 3 },
    qty: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
    qtyText: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 15 },
    summary: { backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 12 },
    line: { height: 1, backgroundColor: colors.border },
    empty: { alignItems: "center", gap: 12, paddingVertical: 80 },
    emptyTitle: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 22 },
    emptyText: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", textAlign: "center" },
  });
}
