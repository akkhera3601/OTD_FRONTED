import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Header, PrimaryButton, Screen } from "@/components/ui";
import { useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function EditProfileScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { profile, updateProfile } = useAppState();
  const [draft, setDraft] = useState(profile);
  const pickProfilePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.85, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setDraft((current) => ({ ...current, avatarUri: result.assets[0]?.uri }));
  };
  const field = (key: keyof typeof draft, label: string, multiline = false) => key === "avatarUri" ? null : <><Text style={styles.label}>{label}</Text><TextInput value={draft[key] ?? ""} onChangeText={(value) => setDraft((current) => ({ ...current, [key]: value }))} multiline={multiline} style={[styles.input, multiline && { minHeight: 94, textAlignVertical: "top" }]} placeholderTextColor={colors.mutedForeground} /></>;
  return <Screen scroll><Header title="Edit Profile" /><View style={styles.photoSection}><Pressable onPress={pickProfilePhoto} style={styles.avatar}>{draft.avatarUri ? <Image source={{ uri: draft.avatarUri }} style={styles.avatarImage} /> : <Feather name="user" size={42} color={colors.primary} />}<View style={styles.camera}><Feather name="camera" size={16} color="#FFFFFF" /></View></Pressable><Text style={styles.photoTitle}>Update profile picture</Text><Text style={styles.photoText}>Choose a photo from your gallery.</Text></View>{field("name", "Display name")}{field("username", "Username")}{field("bio", "Bio", true)}{field("location", "Location")}{field("website", "Website")}<PrimaryButton label="Save Profile" icon="check" onPress={() => { updateProfile(draft); router.back(); }} /></Screen>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    photoSection: { alignItems: "center", gap: 8, backgroundColor: colors.card, borderRadius: 26, borderWidth: 1, borderColor: colors.border, padding: 18 },
    avatar: { width: 106, height: 106, borderRadius: 53, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center", overflow: "hidden" },
    avatarImage: { width: "100%", height: "100%" },
    camera: { position: "absolute", bottom: 4, right: 4, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
    photoTitle: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 17 },
    photoText: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13 },
    label: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 15 },
    input: { height: 52, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, paddingHorizontal: 15, color: colors.foreground, fontFamily: "Inter_500Medium", outlineStyle: "none" as never },
  });
}
