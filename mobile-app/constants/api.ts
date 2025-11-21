import { Platform } from "react-native";

export const API_URL = Platform.OS === "android"
                      ? "http://10.166.214.236:3002"
                      : "http://localhost:3002";