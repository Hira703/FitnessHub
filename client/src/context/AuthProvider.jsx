import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config"; // your firebase config
import axiosSecure from "../api/axiosSecure"; // your axiosSecure instance
import axiosPublic from "../api/axiosPublic";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // will store Firebase user + backend role
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  // Register
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Update profile
  const updateUserProfile = (displayName, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
  };

  // Google login
  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Fetch user info from backend using email with axiosSecure
  const fetchUserRole = async (email) => {
    try {
      const response = await axiosPublic.get(`/api/users/${email}`); // Adjust path accordingly
      setBackendUser(response.data);
      return response.data; // should contain role, name, photoURL etc.
    } catch (error) {
      console.error("Error fetching user role:", error);
      setBackendUser(null);
      return null;
    }
  };
  // console.log(backendUser);

  // Observer for Firebase auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (loggedUser) => {
      if (loggedUser?.email) {
        // Fetch additional user info from backend (role etc.)
        const backendUser = await fetchUserRole(loggedUser.email);

        if (backendUser) {
          // Merge Firebase user and backend user info (role)
          setUser({ ...loggedUser, role: backendUser.role || "member" });
        } else {
          // Fallback if backend user not found
          setUser({ ...loggedUser, role: "member" });
        }
      } else {
        setUser(null);
        setBackendUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    backendUser,
    user,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    loginWithGoogle,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
