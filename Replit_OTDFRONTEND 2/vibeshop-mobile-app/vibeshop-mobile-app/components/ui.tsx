import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode, useMemo, useRef, useState } from "react";
import { Animated, Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppState } from "@/context/AppState";
import { Drop, Product, User, users } from "@/data/social";
import { useColors } from "@/hooks/useColors";

export const formatRupee = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function Screen({ children, scroll = false }: { children: ReactNode; scroll?: boolean }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  if (scroll) {
    return <ScrollView style={styles.screen} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 14 }]} showsVerticalScrollIndicator={false}>{children}</ScrollView>;
  }
  return <View style={[styles.screen, { paddingTop: insets.top + 14 }]}>{children}</View>;
}

export function Header({ title, right }: { title: string; right?: ReactNode }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={styles.header}><Text style={styles.logo}>{title}</Text><View style={styles.headerRight}>{right}</View></View>;
}

export function IconButton({ name, onPress, active = false }: { name: keyof typeof Feather.glyphMap; onPress: () => void; active?: boolean }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.55 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }]}><Feather name={name} size={22} color={active ? colors.accent : colors.foreground} /></Pressable>;
}

export function Avatar({ user, size = 44 }: { user: User; size?: number }) {
  const colors = useColors();
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: user.avatarColor, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: colors.card, overflow: "hidden" }}>{user.avatarUri ? <Image source={{ uri: user.avatarUri }} style={{ width: "100%", height: "100%" }} /> : <Text style={{ color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: size * 0.36 }}>{user.name.slice(0, 1)}</Text>}</View>;
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></Pressable>;
}

export function PrimaryButton({ label, icon, onPress, muted = false }: { label: string; icon?: keyof typeof Feather.glyphMap; onPress: () => void; muted?: boolean }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, muted && styles.mutedButton, { opacity: pressed ? 0.75 : 1 }]}>{icon ? <Feather name={icon} size={18} color={muted ? colors.foreground : colors.primaryForeground} /> : null}<Text style={[styles.primaryButtonText, muted && styles.mutedButtonText]}>{label}</Text></Pressable>;
}

export function SearchInput({ value, onChangeText, placeholder }: { value: string; onChangeText: (value: string) => void; placeholder: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={styles.searchBox}><Feather name="search" size={18} color={colors.mutedForeground} /><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} style={styles.searchInput} /></View>;
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useAppState();
  return <Pressable onPress={() => router.push(`/product/${product.id}`)} style={[styles.productCard, compact && { width: 170 }]}><Image source={product.image} style={styles.productImage} /><Pressable onPress={() => toggleWishlist(product.id)} style={styles.wishlist}><Feather name="heart" size={17} color={wishlist.includes(product.id) ? colors.accent : colors.foreground} /></Pressable><Text style={styles.productName} numberOfLines={1}>{product.name}</Text><Text style={styles.productBrand}>{product.brand}</Text><View style={styles.priceRow}><Text style={styles.price}>{formatRupee(product.price)}</Text>{product.originalPrice ? <Text style={styles.originalPrice}>{formatRupee(product.originalPrice)}</Text> : null}</View><View style={styles.ratingRow}><Feather name="star" size={13} color="#F59E0B" /><Text style={styles.meta}>{product.rating} ({product.reviews})</Text></View><PrimaryButton label="Add" icon="shopping-bag" onPress={() => addToCart(product.id)} /></Pressable>;
}

export function UserCard({ user }: { user: User }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { toggleFollow } = useAppState();
  const router = useRouter();
  return <Pressable onPress={() => router.push(`/profile/${user.id}`)} style={styles.userCard}><Avatar user={user} /><View style={styles.flex}><Text style={styles.titleText}>{user.name}</Text><Text style={styles.meta}>@{user.username} · {user.fans} Fans</Text></View><Pressable onPress={() => toggleFollow(user.id)} style={[styles.followButton, user.following && styles.followingButton]}><Text style={[styles.followText, user.following && { color: colors.foreground }]}>{user.following ? "Following" : "Follow"}</Text></Pressable></Pressable>;
}

export function DropCard({ drop, full = false }: { drop: Drop; full?: boolean }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { likedDrops, toggleLike, users: stateUsers } = useAppState();
  const user = stateUsers.find((item) => item.id === drop.userId) ?? users[0];
  const [expanded, setExpanded] = useState(false);
  const pulse = useRef(new Animated.Value(0)).current;
  const product = drop.productId;
  const liked = likedDrops.includes(drop.id);
  const burst = () => {
    if (!liked) toggleLike(drop.id);
    pulse.setValue(0);
    Animated.sequence([Animated.timing(pulse, { toValue: 1, duration: 220, useNativeDriver: true }), Animated.timing(pulse, { toValue: 0, duration: 260, useNativeDriver: true })]).start();
  };
  return <View style={styles.dropCard}><View style={styles.dropTop}><Avatar user={user} /><View style={styles.flex}><Text style={styles.titleText}>{user.name}</Text><Text style={styles.meta}>{drop.location}</Text></View>{!user.following ? <Pressable style={styles.followButton}><Text style={styles.followText}>Follow</Text></Pressable> : null}<Feather name="more-horizontal" size={22} color={colors.mutedForeground} /></View><Pressable onPress={() => router.push(`/drop/${drop.id}`)} onLongPress={burst} style={styles.dropImageWrap}><Image source={drop.image} style={[styles.dropImage, full && { height: 430 }]} />{product ? <Pressable onPress={() => router.push(`/product/${product}`)} style={styles.productTag}><Feather name="shopping-bag" size={18} color={colors.primaryForeground} /></Pressable> : null}<Animated.View pointerEvents="none" style={[styles.heartBurst, { opacity: pulse, transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.25] }) }] }]}><Feather name="heart" size={72} color="#FFFFFF" /></Animated.View></Pressable><View style={styles.actions}><IconButton name="heart" active={liked} onPress={() => toggleLike(drop.id)} /><Text style={styles.actionText}>{drop.likes + (liked ? 1 : 0)}</Text><IconButton name="message-circle" onPress={() => router.push(`/drop/${drop.id}`)} /><Text style={styles.actionText}>{drop.comments.length}</Text><IconButton name="send" onPress={() => router.push("/messages")} />{product ? <Pressable onPress={() => router.push(`/product/${product}`)} style={styles.viewProduct}><Text style={styles.viewProductText}>View Product</Text></Pressable> : null}</View><Text style={styles.caption} numberOfLines={expanded ? undefined : 2}><Text style={styles.captionUser}>{user.username} </Text>{drop.caption}</Text>{drop.caption.length > 82 && !expanded ? <Pressable onPress={() => setExpanded(true)}><Text style={styles.moreText}>more</Text></Pressable> : null}{drop.outfitLinks?.length ? <View style={styles.linksBox}>{drop.outfitLinks.map((link) => <View key={link} style={styles.linkPill}><Feather name="link" size={13} color={colors.primary} /><Text numberOfLines={1} style={styles.linkText}>{link}</Text></View>)}</View> : null}<View style={styles.commentPreview}>{drop.comments.slice(0, 2).map((comment) => <Text key={comment} style={styles.commentText}>{comment}</Text>)}<Text style={styles.meta}>View all {drop.comments.length} comments</Text></View><Text style={styles.time}>{drop.timestamp}</Text></View>;
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={styles.sectionTitle}><Text style={styles.sectionText}>{title}</Text>{action}</View>;
}

export function ImageTile({ source, label }: { source: ImageSourcePropType; label: string }) {
  const colors = useColors();
  return <View style={{ width: "32%", aspectRatio: 1, borderRadius: 16, overflow: "hidden", backgroundColor: colors.muted }}><Image source={source} style={{ width: "100%", height: "100%" }} /><View style={{ position: "absolute", bottom: 6, left: 6, right: 6 }}><Text numberOfLines={1} style={{ color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 11 }}>{label}</Text></View></View>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingHorizontal: 18, paddingBottom: 120, gap: 18 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 2 },
    logo: { fontFamily: "Inter_700Bold", fontSize: 24, color: colors.foreground, letterSpacing: -0.6 },
    headerRight: { flexDirection: "row", gap: 14, alignItems: "center" },
    chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 13 },
    chipTextActive: { color: colors.primaryForeground },
    primaryButton: { backgroundColor: colors.primary, borderRadius: 16, minHeight: 42, paddingHorizontal: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
    mutedButton: { backgroundColor: colors.secondary },
    primaryButtonText: { color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 13 },
    mutedButtonText: { color: colors.foreground },
    searchBox: { height: 48, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10 },
    searchInput: { flex: 1, color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 14, outlineStyle: "none" as never },
    productCard: { flex: 1, backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 10, gap: 7 },
    productImage: { width: "100%", aspectRatio: 1, borderRadius: 18, backgroundColor: colors.muted },
    wishlist: { position: "absolute", top: 18, right: 18, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
    productName: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 },
    productBrand: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 },
    priceRow: { flexDirection: "row", alignItems: "center", gap: 7 },
    price: { color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 15 },
    originalPrice: { color: colors.mutedForeground, textDecorationLine: "line-through", fontFamily: "Inter_500Medium", fontSize: 12 },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    meta: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 },
    userCard: { backgroundColor: colors.card, borderRadius: 22, padding: 12, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: colors.border },
    flex: { flex: 1 },
    titleText: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 15 },
    followButton: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.primary },
    followingButton: { backgroundColor: colors.secondary },
    followText: { color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 12 },
    dropCard: { backgroundColor: colors.card, borderRadius: 28, borderWidth: 1, borderColor: colors.border, overflow: "hidden", gap: 12, paddingBottom: 14 },
    dropTop: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingTop: 14 },
    dropImageWrap: { marginHorizontal: 10, borderRadius: 24, overflow: "hidden", backgroundColor: colors.muted },
    dropImage: { width: "100%", height: 390 },
    productTag: { position: "absolute", top: 14, right: 14, width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
    heartBurst: { position: "absolute", top: "40%", alignSelf: "center" },
    actions: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16 },
    actionText: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 13, marginLeft: -6 },
    viewProduct: { marginLeft: "auto", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.secondary },
    viewProductText: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 12 },
    caption: { color: colors.foreground, fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20, paddingHorizontal: 16 },
    captionUser: { fontFamily: "Inter_700Bold" },
    moreText: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", paddingHorizontal: 16 },
    commentPreview: { paddingHorizontal: 16, gap: 4 },
    linksBox: { paddingHorizontal: 16, gap: 7 },
    linkPill: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.secondary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
    linkText: { color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 12, flex: 1 },
    commentText: { color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 13 },
    time: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, paddingHorizontal: 16, textTransform: "uppercase" },
    sectionTitle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    sectionText: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 19, letterSpacing: -0.3 },
  });
}
