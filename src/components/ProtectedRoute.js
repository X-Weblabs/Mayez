"use client"

import { useAuth } from "../contexts/AuthContext"
import Login from "./Login"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, userProfile } = useAuth()

  if (!currentUser) {
    return <Login />
  }

  if (adminOnly && (!userProfile || !userProfile.isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "80px" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
