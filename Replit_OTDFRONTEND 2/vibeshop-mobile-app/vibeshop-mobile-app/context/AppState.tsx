import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { chats, Drop, drops as seedDrops, products, users as seedUsers, User } from "@/data/social";

type CartItem = { productId: string; quantity: number; size: string; color: string };
type ProfileDraft = Pick<User, "name" | "username" | "bio" | "location" | "website" | "avatarUri">;
type NewDropInput = { caption: string; location: string; outfitLinks: string[]; imageUri?: string };

type AppState = {
  users: User[];
  drops: Drop[];
  likedDrops: string[];
  wishlist: string[];
  cart: CartItem[];
  themeMode: "system" | "light";
  profile: ProfileDraft;
  createDrop: (drop: NewDropInput) => void;
  toggleLike: (dropId: string) => void;
  toggleFollow: (userId: string) => void;
  toggleWishlist: (productId: string) => void;
  addToCart: (productId: string, size?: string, color?: string) => void;
  incrementCart: (productId: string) => void;
  decrementCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setThemeMode: (mode: "system" | "light") => void;
  updateProfile: (profile: ProfileDraft) => void;
};

const AppStateContext = createContext<AppState | null>(null);
const storageKey = "vibe-shop-state-v1";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [drops, setDrops] = useState<Drop[]>(seedDrops);
  const [likedDrops, setLikedDrops] = useState<string[]>(["d1"]);
  const [wishlist, setWishlist] = useState<string[]>(["p2"]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [themeMode, setThemeModeState] = useState<"system" | "light">("light");
  const [profile, setProfile] = useState<ProfileDraft>({ name: seedUsers[0].name, username: seedUsers[0].username, bio: seedUsers[0].bio, location: seedUsers[0].location, website: seedUsers[0].website, avatarUri: seedUsers[0].avatarUri });

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((raw) => {
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<Pick<AppState, "users" | "drops" | "likedDrops" | "wishlist" | "cart" | "themeMode" | "profile">>;
      if (saved.users) setUsers(saved.users);
      if (saved.drops) setDrops(saved.drops);
      if (saved.likedDrops) setLikedDrops(saved.likedDrops);
      if (saved.wishlist) setWishlist(saved.wishlist);
      if (saved.cart) setCart(saved.cart);
      if (saved.themeMode) setThemeModeState(saved.themeMode);
      if (saved.profile) setProfile(saved.profile);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify({ users, drops, likedDrops, wishlist, cart, themeMode, profile })).catch(() => undefined);
  }, [users, drops, likedDrops, wishlist, cart, themeMode, profile]);

  const pulse = () => Haptics.selectionAsync().catch(() => undefined);

  const value = useMemo<AppState>(() => ({
    users,
    drops,
    likedDrops,
    wishlist,
    cart,
    themeMode,
    profile,
    createDrop: (input) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
      const next: Drop = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
        userId: "u1",
        location: input.location || profile.location || "India",
        caption: input.caption,
        likes: 0,
        comments: [],
        timestamp: "Just now",
        outfitLinks: input.outfitLinks,
        image: input.imageUri ? { uri: input.imageUri } : seedDrops[0].image,
      };
      setDrops((current) => [next, ...current]);
    },
    toggleLike: (dropId) => {
      pulse();
      setLikedDrops((current) => current.includes(dropId) ? current.filter((id) => id !== dropId) : [...current, dropId]);
    },
    toggleFollow: (userId) => {
      pulse();
      setUsers((current) => current.map((user) => user.id === userId ? { ...user, following: !user.following } : user));
    },
    toggleWishlist: (productId) => {
      pulse();
      setWishlist((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
    },
    addToCart: (productId, size = "M", color = products.find((item) => item.id === productId)?.colors[0] ?? "#111111") => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      setCart((current) => {
        const existing = current.find((item) => item.productId === productId && item.size === size && item.color === color);
        if (existing) return current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
        return [...current, { productId, quantity: 1, size, color }];
      });
    },
    incrementCart: (productId) => setCart((current) => current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    decrementCart: (productId) => setCart((current) => current.flatMap((item) => item.productId === productId ? (item.quantity <= 1 ? [] : [{ ...item, quantity: item.quantity - 1 }]) : [item])),
    removeFromCart: (productId) => setCart((current) => current.filter((item) => item.productId !== productId)),
    clearCart: () => setCart([]),
    setThemeMode: (mode) => setThemeModeState(mode),
    updateProfile: (next) => {
      setProfile(next);
      setUsers((current) => current.map((user) => user.id === "u1" ? { ...user, ...next } : user));
    },
  }), [users, drops, likedDrops, wishlist, cart, themeMode, profile]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}

export { chats, products };
