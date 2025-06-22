"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
        photoURL: userData.profileImage || null,
      })

      // Create user profile document with all data including profile image
      const userProfileData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        skillLevel: userData.skillLevel || "beginner",
        profileImage: userData.profileImage || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
        tournaments: [],
        wins: 0,
        losses: 0,
        ranking: 1000,
        // Additional fields for tournament system
        totalMatches: 0,
        winRate: 0,
        favoriteGame: "",
        bio: "",
        location: "",
        achievements: [],
        isActive: true,
      }

      await setDoc(doc(db, "users", user.uid), userProfileData)

      // Set the user profile in state
      setUserProfile(userProfileData)

      return userCredential
    } catch (error) {
      console.error("Error during signup:", error)
      throw error
    }
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    setUserProfile(null)
    return signOut(auth)
  }

  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, "users", uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const profileData = docSnap.data()
        setUserProfile(profileData)
        return profileData
      } else {
        console.log("No user profile found")
        setUserProfile(null)
        return null
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      setUserProfile(null)
      return null
    }
  }

  const updateUserProfile = async (uid, updates) => {
    try {
      const userRef = doc(db, "users", uid)
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      }

      await updateDoc(userRef, updateData)

      // Update local state
      setUserProfile((prev) => (prev ? { ...prev, ...updateData } : null))

      // Update Firebase Auth profile if display name or photo changed
      if (currentUser && (updates.firstName || updates.lastName || updates.profileImage !== undefined)) {
        const authUpdates = {}

        if (updates.firstName || updates.lastName) {
          const firstName = updates.firstName || userProfile?.firstName || ""
          const lastName = updates.lastName || userProfile?.lastName || ""
          authUpdates.displayName = `${firstName} ${lastName}`.trim()
        }

        if (updates.profileImage !== undefined) {
          authUpdates.photoURL = updates.profileImage || null
        }

        if (Object.keys(authUpdates).length > 0) {
          await updateProfile(currentUser, authUpdates)
        }
      }

      return true
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }

  const refreshUserProfile = async () => {
    if (currentUser) {
      await fetchUserProfile(currentUser.uid)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    fetchUserProfile,
    updateUserProfile,
    refreshUserProfile,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
