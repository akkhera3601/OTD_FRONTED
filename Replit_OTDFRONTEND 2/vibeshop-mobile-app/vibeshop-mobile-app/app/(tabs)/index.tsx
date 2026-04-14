import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DropCard, Header, IconButton } from "@/components/ui";
import { useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function HomeFeedScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { drops } = useAppState();
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 650);
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={drops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DropCard drop={item} />}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 14 }]}
        ListHeaderComponent={
          <View style={styles.top}>
            <Header
              title="VibeShop"
              right={
                <>
                  <IconButton
                    name="plus-square"
                    onPress={() => router.push("/upload")}
                  />
                  <IconButton
                    name="bell"
                    onPress={() => router.push("/notifications")}
                  />
                </>
              }
            />
            {refreshing ? (
              <View style={styles.skeleton}>
                <Feather name="loader" size={18} color={colors.primary} />
                <Text style={styles.skeletonText}>Refreshing new Drops</Text>
              </View>
            ) : null}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 18, paddingBottom: 120, gap: 18 },
    top: { gap: 14, marginBottom: 4 },
    skeleton: {
      height: 48,
      borderRadius: 18,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      gap: 10,
    },
    skeletonText: {
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
    },
  });
}
