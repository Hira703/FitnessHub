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
import { auth } from "../firebase/firebase.config";
import axiosPublic from "../api/axiosPublic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";

export const AuthContext = createContext();

const fetchUserRole = async (email) => {
  const encodedEmail = encodeURIComponent(email);
  const { data } = await axiosSecure.get(`/api/users/${encodedEmail}`);
  return data; // should include role
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const queryClient = useQueryClient();
  const googleProvider = new GoogleAuthProvider();

  // 🔁 Observe Firebase login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser?.email) {
        setUser(loggedUser);
        setEmail(loggedUser.email); // trigger useQuery
      } else {
        setUser(null);
        setEmail(null);
        queryClient.removeQueries(["backendUser"]);
      }
      setFirebaseLoading(false);
    });
    return () => unsubscribe();
  }, [queryClient]);

  // ⏳ Fetch backend user with TanStack Query
  const {
    data: backendUser,
    isPending: backendLoading,
    refetch,
  } = useQuery({
    queryKey: ["backendUser", email],
    queryFn: () => fetchUserRole(email),
    enabled: !!email, // only run when email is set
    staleTime: 1000 * 60 * 5, // optional: cache for 5 minutes
  });

  // ⏳ Combined loading state
  const loading = firebaseLoading || backendLoading;

  const registerUser = (email, password) => {
    setFirebaseLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setFirebaseLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (displayName, photoURL) => {
    return updateProfile(auth.currentUser, { displayName, photoURL });
  };

  const loginWithGoogle = () => {
    setFirebaseLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logoutUser = async () => {
    await signOut(auth);
    queryClient.removeQueries(["backendUser"]);
  };

  const authInfo = {
    user: user ? { ...user, role: backendUser?.role || "member" } : null,
    backendUser,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    loginWithGoogle,
    updateUserProfile,
    refetchBackendUser: refetch, // manually trigger refetch if needed
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
