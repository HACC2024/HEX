// auth.ts

import { auth } from "./firebase";  // Import the initialized auth from firebase.ts
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

// Handle user sign-in
export const toggleSignIn = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        Swal.fire("Error", error.message, "error");
        throw error;
    }
};

// Handle user sign-out
export const toggleSignOut = async () => {
    try {
        await signOut(auth);
    } catch (error: any) {
        Swal.fire("Error", error.message, "error");
        throw error;
    }
};

// Handle user sign-up
export const handleSignUp = async (email: string, password: string) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        Swal.fire("Error", error.message, "error");
        throw error;
    }
};

// Handle password reset
export const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        Swal.fire("Error", error.message, "error");
        throw error;
    }
};

// Monitor authentication state
export const stateChange = (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
};
