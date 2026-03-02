import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Persistence } from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCBL15ldn0FpcKMiDE6iekBnLYiO77RgMs",
  authDomain: "recolte-2cfb9.firebaseapp.com",
  projectId: "recolte-2cfb9",
  storageBucket: "recolte-2cfb9.firebasestorage.app",
  messagingSenderId: "785553259723",
  appId: "1:785553259723:web:339f416629cc9a7551ef4e",
  measurementId: "G-6G7GCYTQGP"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

type ReactNativeFirebaseAuth = typeof FirebaseAuth & {
  getReactNativePersistence(storage: typeof AsyncStorage): Persistence;
};

const reactNativeFirebaseAuth = FirebaseAuth as ReactNativeFirebaseAuth;

function createAuth() {
  if (Platform.OS === "web") {
    return FirebaseAuth.getAuth(app);
  }

  try {
    return FirebaseAuth.initializeAuth(app, {
      persistence: reactNativeFirebaseAuth.getReactNativePersistence(
        AsyncStorage
      ),
    });
  } catch (error) {
    if ((error as { code?: string }).code === "auth/already-initialized") {
      return FirebaseAuth.getAuth(app);
    }

    throw error;
  }
}

export const auth = createAuth();
