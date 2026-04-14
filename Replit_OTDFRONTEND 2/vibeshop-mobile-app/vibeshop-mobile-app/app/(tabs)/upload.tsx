import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Header, PrimaryButton, Screen } from "@/components/ui";
import { useAppState } from "@/context/AppState";
import { useColors } from "@/hooks/useColors";

export default function UploadScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { createDrop, profile } = useAppState();
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState(profile.location || "India");
  const [linksText, setLinksText] = useState("");
  const [error, setError] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) setImageUri(result.assets[0]?.uri);
  };

  const postDrop = () => {
    if (!caption.trim()) {
      setError("Add a caption before posting your Drop.");
      return;
    }
    const outfitLinks = linksText.split(/\n|,/).map((link) => link.trim()).filter(Boolean);
    createDrop({ caption: caption.trim(), location: location.trim(), outfitLinks, imageUri });
    setCaption("");
    setLinksText("");
    setImageUri(undefined);
    setError("");
    router.push("/");
  };

  return <Screen scroll><Header title="Upload Drop" right={<Feather name="upload-cloud" size={24} color={colors.primary} />} /><Pressable onPress={pickImage} style={styles.photoBox}>{imageUri ? <Image source={{ uri: imageUri }} style={styles.photo} /> : <View style={styles.placeholder}><Feather name="image" size={38} color={colors.primary} /><Text style={styles.placeholderTitle}>Add outfit photo</Text><Text style={styles.placeholderText}>Choose from gallery and post your Drop</Text></View>}</Pressable><Text style={styles.label}>Caption</Text><TextInput value={caption} onChangeText={setCaption} multiline placeholder="Describe your outfit, vibe, fabric, price ideas..." placeholderTextColor={colors.mutedForeground} style={[styles.input, styles.caption]} /><Text style={styles.label}>Location</Text><TextInput value={location} onChangeText={setLocation} placeholder="Mumbai, Delhi, Bengaluru..." placeholderTextColor={colors.mutedForeground} style={styles.input} /><View style={styles.linksHeader}><View><Text style={styles.label}>Outfit Links</Text><Text style={styles.hint}>Paste one link per line or separate with commas</Text></View><Feather name="link" size={22} color={colors.primary} /></View><TextInput value={linksText} onChangeText={setLinksText} multiline autoCapitalize="none" keyboardType="url" placeholder="https://your-store.in/shirt
https://your-store.in/shoes" placeholderTextColor={colors.mutedForeground} style={[styles.input, styles.links]} />{error ? <Text style={styles.error}>{error}</Text> : null}<PrimaryButton label="Post Drop" icon="send" onPress={postDrop} /><PrimaryButton label="Preview Feed" icon="home" muted onPress={() => router.push("/")} /></Screen>;
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    photoBox: { height: 390, borderRadius: 30, overflow: "hidden", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
    photo: { width: "100%", height: "100%" },
    placeholder: { alignItems: "center", gap: 8, paddingHorizontal: 24 },
    placeholderTitle: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 20 },
    placeholderText: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", textAlign: "center" },
    label: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 15 },
    hint: { color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 3 },
    input: { minHeight: 52, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, paddingHorizontal: 15, paddingVertical: 13, color: colors.foreground, fontFamily: "Inter_500Medium", outlineStyle: "none" as never },
    caption: { minHeight: 118, textAlignVertical: "top" },
    links: { minHeight: 112, textAlignVertical: "top" },
    linksHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    error: { color: colors.destructive, fontFamily: "Inter_700Bold", fontSize: 13 },
  });
}
