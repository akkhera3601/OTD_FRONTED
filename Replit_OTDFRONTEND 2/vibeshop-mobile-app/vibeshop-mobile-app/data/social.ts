import { ImageSourcePropType } from "react-native";

export type User = {
  id: string;
  name: string;
  username: string;
  location: string;
  fans: string;
  vibes: string;
  drops: number;
  bio: string;
  website: string;
  avatarColor: string;
  avatarUri?: string;
  following: boolean;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  seller: string;
  image: ImageSourcePropType;
  colors: string[];
  sizes: string[];
  description: string;
};

export type Drop = {
  id: string;
  userId: string;
  location: string;
  caption: string;
  likes: number;
  comments: string[];
  timestamp: string;
  productId?: string;
  outfitLinks?: string[];
  image: ImageSourcePropType;
};

export type Chat = {
  id: string;
  userId: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: { id: string; text: string; fromMe: boolean; type?: "text" | "image" | "drop"; dropId?: string }[];
};

const feedImage = require("@/assets/images/feed-drop.png");
const productImage = require("@/assets/images/store-products.png");
const bannerImage = require("@/assets/images/sale-banner.png");

export const users: User[] = [
  { id: "u1", name: "Aarohi Mehta", username: "aarohidrops", location: "Mumbai", fans: "4.2K", vibes: "310", drops: 128, bio: "Streetwear, saree layers, and daily outfit drops from India.", website: "aarohi.studio", avatarColor: "#EC4899", following: true },
  { id: "u2", name: "Kabir Rao", username: "kabirfits", location: "Bengaluru", fans: "12.8K", vibes: "520", drops: 241, bio: "Minimal fits, sneaker edits, creator shop open weekly.", website: "kabirfits.in", avatarColor: "#7C3AED", following: false },
  { id: "u3", name: "Mira Kapoor", username: "miramode", location: "Delhi", fans: "8.6K", vibes: "402", drops: 176, bio: "Affordable festive looks and creator-curated fashion finds.", website: "miramode.co", avatarColor: "#10B981", following: false },
  { id: "u4", name: "Rhea Singh", username: "rheastyles", location: "Jaipur", fans: "2.9K", vibes: "188", drops: 87, bio: "Handloom details, everyday color, and small-shop picks.", website: "rheastyles.in", avatarColor: "#F59E0B", following: true }
];

export const products: Product[] = [
  { id: "p1", name: "Oversized Cotton Shacket", brand: "DropCraft", price: 1899, originalPrice: 2499, rating: 4.8, reviews: 236, category: "Men", seller: "Aarohi Studio", image: productImage, colors: ["#F8EDE3", "#111111", "#7C3AED"], sizes: ["S", "M", "L", "XL", "XXL"], description: "A breathable cotton overshirt made for warm Indian days and evening layers." },
  { id: "p2", name: "Festive Co-ord Set", brand: "Mira Mode", price: 3299, originalPrice: 3999, rating: 4.9, reviews: 412, category: "Women", seller: "Mira Mode", image: bannerImage, colors: ["#EC4899", "#F97316", "#10B981"], sizes: ["XS", "S", "M", "L", "XL"], description: "A light festive set with soft drape, easy movement, and statement color." },
  { id: "p3", name: "Canvas Street Sneakers", brand: "KabirFits", price: 2199, rating: 4.6, reviews: 181, category: "Shoes", seller: "KabirFits", image: productImage, colors: ["#FFFFFF", "#111111", "#CBD5E1"], sizes: ["6", "7", "8", "9", "10"], description: "Everyday canvas sneakers designed for commute, cafes, and weekend drops." },
  { id: "p4", name: "Handloom Sling Bag", brand: "Rhea Styles", price: 1299, originalPrice: 1699, rating: 4.7, reviews: 98, category: "Accessories", seller: "Rhea Styles", image: bannerImage, colors: ["#7C3AED", "#F59E0B", "#EC4899"], sizes: ["One Size"], description: "Compact handloom sling with enough space for phone, wallet, and daily essentials." }
];

export const drops: Drop[] = [
  { id: "d1", userId: "u1", location: "Kala Ghoda, Mumbai", caption: "New drop for warm evenings. Cotton layers, clean sneakers, and a bag that actually fits everything. #fashion #ootd #indiastyle", likes: 1482, comments: ["The shacket color is perfect", "Adding this to my wishlist"], timestamp: "2 hours ago", productId: "p1", outfitLinks: ["https://vibeshop.in/shacket", "https://vibeshop.in/sneakers"], image: feedImage },
  { id: "d2", userId: "u2", location: "Indiranagar, Bengaluru", caption: "Coffee run fit with canvas sneakers that survived a full day of meetings. #streetwear #drops", likes: 2304, comments: ["Need sneaker link", "Clean fit"], timestamp: "5 hours ago", productId: "p3", outfitLinks: ["https://vibeshop.in/canvas-sneakers"], image: productImage },
  { id: "d3", userId: "u3", location: "Hauz Khas, Delhi", caption: "Festive but easy. Wearing this co-ord for the family lunch and keeping it breathable. #festivefashion", likes: 3988, comments: ["This color is stunning", "Price please"], timestamp: "Yesterday", productId: "p2", outfitLinks: ["https://vibeshop.in/festive-coord"], image: bannerImage },
  { id: "d4", userId: "u4", location: "C-Scheme, Jaipur", caption: "Handloom accessories make simple outfits feel intentional. #handloom #creatorstore", likes: 876, comments: ["Love the bag", "Jaipur colors forever"], timestamp: "2 days ago", productId: "p4", outfitLinks: ["https://vibeshop.in/handloom-sling"], image: feedImage }
];

export const chats: Chat[] = [
  { id: "c1", userId: "u2", lastMessage: "Shared a sneaker Drop with you", time: "2m ago", unread: 2, online: true, messages: [{ id: "m1", text: "This sneaker drop is live now", fromMe: false, type: "drop", dropId: "d2" }, { id: "m2", text: "Looks sharp. Saving it.", fromMe: true }] },
  { id: "c2", userId: "u3", lastMessage: "The co-ord ships in 3 days", time: "18m ago", unread: 0, online: false, messages: [{ id: "m1", text: "The co-ord ships in 3 days", fromMe: false }, { id: "m2", text: "Perfect, I need it before Sunday.", fromMe: true }] },
  { id: "c3", userId: "u4", lastMessage: "Added new handloom bags", time: "1h ago", unread: 1, online: true, messages: [{ id: "m1", text: "Added new handloom bags", fromMe: false }, { id: "m2", text: "Send the purple one", fromMe: true }] }
];

export const categories = ["All", "Men", "Women", "Kids", "Sale", "New Arrivals", "Tops", "Bottoms", "Dresses", "Shoes", "Accessories"];
export const trending = ["kurta set", "sneakers", "airport fit", "wedding guest", "cotton shirts", "streetwear"];
