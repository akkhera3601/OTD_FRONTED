import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { formatRupee, Header, PrimaryButton, Screen } from "@/components/ui";
import { products, useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function CheckoutScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { cart, clearCart } = useAppState();
  const [address, setAddress] = useState("12 Linking Road, Bandra West, Mumbai");
  const [payment, setPayment] = useState("UPI");
  const subtotal = cart.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity, 0);
  const delivery = subtotal > 1999 || subtotal === 0 ? 0 : 99;

  return <Screen scroll><Header title="Checkout" /><Text style={styles.label}>Delivery Address</Text><TextInput value={address} onChangeText={setAddress} multiline style={styles.input} placeholderTextColor={colors.mutedForeground} /><Text style={styles.label}>Payment Method</Text><View style={styles.paymentRow}>{["UPI", "Card", "Cash"].map((item) => <Pressable key={item} onPress={() => setPayment(item)} style={[styles.payment, payment === item && styles.paymentActive]}><Text style={[styles.paymentText, payment === item && styles.paymentTextActive]}>{item}</Text></Pressable>)}</View><View style={styles.summary}><Text style={styles.summaryTitle}>Order Summary</Text>{cart.map((item) => { const product = products.find((entry) => entry.id === item.productId) ?? products[0]; return <View key={`${item.productId}-${item.size}`} style={styles.row}><Text style={styles.itemText}>{product.name} x {item.quantity}</Text><Text style={styles.itemText}>{formatRupee(product.price * item.quantity)}</Text></View>; })}<View style={styles.line} /><View style={styles.row}><Text style={styles.itemText}>Delivery</Text><Text style={styles.itemText}>{delivery ? formatRupee(delivery) : "Free"}</Text></View><View style={styles.row}><Text style={styles.total}>Total</Text><Text style={styles.total}>{formatRupee(subtotal + delivery)}</Text></View></View><PrimaryButton label="Place Order" icon="check-circle" onPress={() => { clearCart(); router.replace("/order-confirmation"); }} /></Screen>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    label: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 16 },
    input: { minHeight: 98, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 16, color: colors.foreground, fontFamily: "Inter_500Medium", textAlignVertical: "top", outlineStyle: "none" as never },
    paymentRow: { flexDirection: "row", gap: 10 },
    payment: { flex: 1, height: 58, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
    paymentActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    paymentText: { color: colors.foreground, fontFamily: "Inter_700Bold" },
    paymentTextActive: { color: colors.primaryForeground },
    summary: { backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 12 },
    summaryTitle: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 18 },
    row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    itemText: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", flex: 1 },
    total: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 18 },
    line: { height: 1, backgroundColor: colors.border },
  });
}
