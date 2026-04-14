import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { DropCard, Header, PrimaryButton, Screen } from "@/components/ui";
import { useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function DropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { drops } = useAppState();
  const drop = drops.find((item) => item.id === id) ?? drops[0];
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(drop.comments);
  const add = () => {
    if (!comment.trim()) return;
    setComments((current) => [comment.trim(), ...current]);
    setComment("");
  };
  return <Screen scroll><Header title="Drop" right={<Pressable onPress={() => router.back()}><Feather name="x" size={24} color={colors.foreground} /></Pressable>} /><DropCard drop={{ ...drop, comments }} full /><Text style={styles.title}>Outfit Links</Text><View style={styles.links}>{drop.outfitLinks?.length ? drop.outfitLinks.map((link) => <View key={link} style={styles.link}><Feather name="link" size={16} color={colors.primary} /><Text style={styles.linkText}>{link}</Text></View>) : <Text style={styles.empty}>No outfit links added for this Drop.</Text>}</View><Text style={styles.title}>Comments</Text><View style={styles.inputRow}><TextInput value={comment} onChangeText={setComment} placeholder="Add a comment" placeholderTextColor={colors.mutedForeground} style={styles.input} /><PrimaryButton label="Post" onPress={add} /></View><View style={styles.comments}>{comments.map((item, index) => <View key={`${item}-${index}`} style={styles.comment}><Text style={styles.commentUser}>fan{index + 1}</Text><Text style={styles.commentText}>{item}</Text></View>)}</View></Screen>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    title: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 20 },
    inputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
    input: { flex: 1, height: 46, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, color: colors.foreground, fontFamily: "Inter_500Medium", outlineStyle: "none" as never },
    comments: { gap: 10 },
    comment: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 13 },
    commentUser: { color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 13 },
    commentText: { color: colors.foreground, fontFamily: "Inter_500Medium", marginTop: 3 },
    links: { gap: 8 },
    link: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.secondary, borderRadius: 18, padding: 12 },
    linkText: { color: colors.primary, fontFamily: "Inter_700Bold", flex: 1 },
    empty: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" },
  });
}
