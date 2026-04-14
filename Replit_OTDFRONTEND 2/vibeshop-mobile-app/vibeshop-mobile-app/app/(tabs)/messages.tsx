import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Avatar, Header, Screen, SearchInput, SectionTitle } from "@/components/ui";
import { chats } from "@/context/AppState";
import { useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function MessagesScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { users } = useAppState();
  const [query, setQuery] = useState("");
  const filtered = chats.filter((chat) => users.find((user) => user.id === chat.userId)?.name.toLowerCase().includes(query.toLowerCase()) || chat.lastMessage.toLowerCase().includes(query.toLowerCase()));

  return <Screen scroll><Header title="Messages" right={<Feather name="edit-3" size={22} color={colors.foreground} />} /><SectionTitle title="Stories" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stories}><Pressable style={styles.story} onPress={() => router.push("/story/u1")}><View style={styles.addStory}><Feather name="plus" size={24} color={colors.primary} /></View><Text style={styles.storyName}>Your Story</Text></Pressable>{users.map((user) => <Pressable key={user.id} style={styles.story} onPress={() => router.push(`/story/${user.id}`)}><View style={[styles.storyRing, user.following && { borderColor: colors.mutedForeground }]}><Avatar user={user} size={60} /></View><Text style={styles.storyName} numberOfLines={1}>{user.username}</Text></Pressable>)}</ScrollView><SectionTitle title="Chats" /><SearchInput value={query} onChangeText={setQuery} placeholder="Search conversations" /><View style={styles.chatList}>{filtered.map((chat) => { const user = users.find((item) => item.id === chat.userId) ?? users[0]; return <Pressable key={chat.id} onPress={() => router.push(`/chat/${chat.id}`)} style={styles.chatRow}><View><Avatar user={user} size={52} />{chat.online ? <View style={styles.online} /> : null}</View><View style={styles.chatMiddle}><Text style={styles.chatName}>{user.name}</Text><Text style={styles.chatMessage} numberOfLines={1}>{chat.lastMessage}</Text></View><View style={styles.chatRight}><Text style={styles.chatTime}>{chat.time}</Text>{chat.unread ? <View style={styles.unread}><Text style={styles.unreadText}>{chat.unread}</Text></View> : null}</View></Pressable>; })}</View></Screen>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    stories: { gap: 14, paddingRight: 18 },
    story: { width: 76, alignItems: "center", gap: 7 },
    addStory: { width: 66, height: 66, borderRadius: 33, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
    storyRing: { borderRadius: 38, padding: 3, borderWidth: 3, borderColor: colors.accent },
    storyName: { color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 11, textAlign: "center" },
    chatList: { gap: 10 },
    chatRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.card, borderRadius: 24, padding: 12, borderWidth: 1, borderColor: colors.border },
    online: { position: "absolute", right: 1, bottom: 1, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.card },
    chatMiddle: { flex: 1, gap: 3 },
    chatName: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 15 },
    chatMessage: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13 },
    chatRight: { alignItems: "flex-end", gap: 8 },
    chatTime: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 11 },
    unread: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
    unreadText: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 11 },
  });
}
