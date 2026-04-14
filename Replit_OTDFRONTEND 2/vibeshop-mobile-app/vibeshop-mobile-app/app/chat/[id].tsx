import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/ui";
import { chats, useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = chats.find((item) => item.id === id) ?? chats[0];
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { users, drops } = useAppState();
  const user = users.find((item) => item.id === chat.userId) ?? users[0];
  const [messages, setMessages] = useState(chat.messages);
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    setMessages((current) => [{ id: Date.now().toString(), text: text.trim(), fromMe: true }, ...current]);
    setText("");
  };
  return <KeyboardAvoidingView behavior="padding" style={styles.root}><View style={[styles.header, { paddingTop: insets.top + 10 }]}><Pressable onPress={() => router.back()}><Feather name="chevron-left" size={28} color={colors.foreground} /></Pressable><Avatar user={user} size={42} /><View style={{ flex: 1 }}><Text style={styles.name}>{user.name}</Text><Text style={styles.status}>{chat.online ? "Online" : "Seen recently"}</Text></View></View><FlatList inverted data={messages} keyExtractor={(item) => item.id} contentContainerStyle={styles.messages} renderItem={({ item }) => <View style={[styles.bubble, item.fromMe ? styles.sent : styles.received]}>{item.type === "drop" && item.dropId ? <Pressable onPress={() => router.push(`/drop/${item.dropId}`)} style={styles.dropShare}><Text style={styles.dropTitle}>Shared Drop</Text><Text style={styles.dropText}>{drops.find((drop) => drop.id === item.dropId)?.caption.slice(0, 58)}...</Text></Pressable> : null}<Text style={[styles.messageText, item.fromMe && { color: colors.primaryForeground }]}>{item.text}</Text>{item.fromMe ? <Text style={styles.seen}>Seen ✓✓</Text> : null}</View>} ListHeaderComponent={<Text style={styles.typing}>{user.name.split(" ")[0]} is typing...</Text>} /><View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}><Feather name="paperclip" size={22} color={colors.mutedForeground} /><TextInput value={text} onChangeText={setText} placeholder="Message" placeholderTextColor={colors.mutedForeground} style={styles.input} /><Feather name="image" size={22} color={colors.mutedForeground} /><Pressable onPress={send} style={styles.send}><Feather name="send" size={18} color={colors.primaryForeground} /></Pressable></View></KeyboardAvoidingView>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    name: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 16 },
    status: { color: colors.success, fontFamily: "Inter_600SemiBold", fontSize: 12 },
    messages: { padding: 16, gap: 10 },
    bubble: { maxWidth: "78%", borderRadius: 22, padding: 12, marginVertical: 5, gap: 6 },
    sent: { alignSelf: "flex-end", backgroundColor: colors.primary, borderBottomRightRadius: 7 },
    received: { alignSelf: "flex-start", backgroundColor: colors.card, borderBottomLeftRadius: 7, borderWidth: 1, borderColor: colors.border },
    messageText: { color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 14, lineHeight: 20 },
    seen: { color: "#FFFFFF", opacity: 0.72, fontFamily: "Inter_600SemiBold", fontSize: 10, alignSelf: "flex-end" },
    dropShare: { backgroundColor: colors.background, borderRadius: 16, padding: 10, gap: 4 },
    dropTitle: { color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 12 },
    dropText: { color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 12 },
    typing: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 12, textAlign: "center", marginVertical: 8 },
    inputBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background },
    input: { flex: 1, height: 44, borderRadius: 22, backgroundColor: colors.card, color: colors.foreground, paddingHorizontal: 16, fontFamily: "Inter_500Medium", outlineStyle: "none" as never },
    send: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  });
}
