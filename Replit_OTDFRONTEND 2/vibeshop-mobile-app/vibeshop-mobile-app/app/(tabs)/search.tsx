import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Chip, Header, ProductCard, Screen, SearchInput, SectionTitle, UserCard } from "@/components/ui";
import { useAppState } from "@/context/AppState";
import { products, trending } from "@/data/social";
import { useColors } from "@/hooks/useColors";

export default function SearchScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { users } = useAppState();
  const [mode, setMode] = useState<"users" | "products">("users");
  const [query, setQuery] = useState("");
  const filteredUsers = users.filter((user) => `${user.name} ${user.username}`.toLowerCase().includes(query.toLowerCase()));
  const filteredProducts = products.filter((product) => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase()));

  return <Screen scroll><Header title="Search" /><SearchInput value={query} onChangeText={setQuery} placeholder="Search people, products, styles..." /><View style={styles.toggle}><Chip label="Users" active={mode === "users"} onPress={() => setMode("users")} /><Chip label="Products" active={mode === "products"} onPress={() => setMode("products")} /></View>{query.length === 0 ? <><SectionTitle title="Trending Searches" /><View style={styles.wrap}>{trending.map((item) => <Chip key={item} label={item} onPress={() => setQuery(item)} />)}</View><SectionTitle title="Suggested Users" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>{users.map((user) => <View key={user.id} style={{ width: 270 }}><UserCard user={user} /></View>)}</ScrollView><SectionTitle title="Popular Products" /><View style={styles.grid}>{products.map((product) => <ProductCard key={product.id} product={product} />)}</View></> : mode === "users" ? <View style={styles.list}>{filteredUsers.map((user) => <UserCard key={user.id} user={user} />)}{filteredUsers.length === 0 ? <Text style={styles.empty}>No creators found</Text> : null}</View> : <View style={styles.grid}>{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}{filteredProducts.length === 0 ? <Text style={styles.empty}>No products found</Text> : null}</View>}</Screen>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    toggle: { flexDirection: "row", gap: 10 },
    wrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    horizontal: { gap: 12, paddingRight: 18 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    list: { gap: 12 },
    empty: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", textAlign: "center", padding: 28, width: "100%" },
  });
}
