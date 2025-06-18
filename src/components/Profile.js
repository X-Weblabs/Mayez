"use client"

import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"

const Profile = () => {
  const { currentUser, userProfile } = useAuth()

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Your Profile</h1>

          <div className="bg-gray-900 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-3">Personal Information</h2>
              <div className="text-gray-300">
                <p>
                  <strong>Name:</strong> {userProfile?.firstName} {userProfile?.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {currentUser?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userProfile?.phone}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {userProfile?.dateOfBirth}
                </p>
                <p>
                  <strong>Skill Level:</strong> {userProfile?.skillLevel}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Statistics</h2>
              <div className="text-gray-300">
                <p>
                  <strong>Wins:</strong> {userProfile?.wins}
                </p>
                <p>
                  <strong>Losses:</strong> {userProfile?.losses}
                </p>
                <p>
                  <strong>Total Games:</strong> {userProfile?.totalGames}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
