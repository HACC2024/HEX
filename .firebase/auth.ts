// .firebase/auth.ts

import { auth, database } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { ref, get, set } from "firebase/database";

// Check if user is an admin
export const checkAdminRole = async (user: User): Promise<boolean> => {
  try {
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    return userData?.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
};

export const userRole = async (user: User): Promise<boolean> => {
  try {
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    return (
      userData?.role === "user" ||
      userData?.role === "admin" ||
      !!userData?.role
    );
  } catch (error) {
    console.error("Error checking log in:", error);
    return false;
  }
};

// Sign in with admin role verification
export const adminSignIn = async (
  email: string,
  password: string
): Promise<{ user: User; isAdmin: boolean }> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const isAdmin = await checkAdminRole(userCredential.user);

  if (!isAdmin) {
    await signOut(auth);
    throw new Error("Unauthorized: User is not an admin");
  }

  return { user: userCredential.user, isAdmin };
};

// Create or update admin user
export const setAdminRole = async (uid: string, email: string) => {
  const userRef = ref(database, `users/${uid}`);
  await set(userRef, {
    email,
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const toggleSignIn = adminSignIn;
export const toggleSignOut = signOut;
export const stateChange = onAuthStateChanged;
