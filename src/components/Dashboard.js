"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Calendar, Users, Star, Clock, MapPin, User } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useTournament } from "../contexts/TournamentContext"
import { Link, useSearchParams } from "react-router-dom"

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth()
  const { tournaments } = useTournament()
  const [searchParams] = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    if (searchParams.get("success") === "payment") {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [searchParams])

  const userTournaments = tournaments.filter((tournament) =>
    tournament.participants?.some((p) => p.userId === currentUser?.uid),
  )

  const upcomingTournaments = userTournaments.filter((t) => t.status === "upcoming" || t.status === "registration")

  const completedTournaments = userTournaments.filter((t) => t.status === "completed")

  const stats = {
    totalTournaments: userTournaments.length,
    wins: userProfile?.wins || 0,
    losses: userProfile?.losses || 0,
    winRate: userProfile?.totalGames ? Math.round((userProfile.wins / userProfile.totalGames) * 100) : 0,
  }

  const ProfileModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">My Profile</h3>
          <button onClick={() => setShowProfile(false)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">
              {userProfile?.firstName} {userProfile?.lastName}
            </h4>
            <p className="text-gray-400">{userProfile?.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalTournaments}</div>
              <div className="text-gray-400 text-sm">Tournaments</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.winRate}%</div>
              <div className="text-gray-400 text-sm">Win Rate</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Skill Level:</span>
              <span className="text-white">{userProfile?.skillLevel || "Beginner"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Role:</span>
              <span
                className={`px-2 py-1 rounded text-xs ${userProfile?.isAdmin ? "bg-red-600" : "bg-blue-600"} text-white`}
              >
                {userProfile?.isAdmin ? "Admin" : "User"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Member Since:</span>
              <span className="text-white">{userProfile?.createdAt?.toDate?.()?.getFullYear() || "2025"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Wins:</span>
              <span className="text-green-400">{stats.wins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Losses:</span>
              <span className="text-red-400">{stats.losses}</span>
            </div>
          </div>

          <button
            onClick={() => setShowProfile(false)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-600 text-white p-4 rounded-lg mb-6"
            >
              🎉 Payment successful! You've been registered for the tournament.
            </motion.div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">Welcome back, {userProfile?.firstName}!</h1>
              <p className="text-gray-400 mt-2">Track your tournaments and performance</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-2xl font-bold text-white">Level: {userProfile?.skillLevel || "Beginner"}</div>
                  <div className="text-gray-400">
                    Member since {userProfile?.createdAt?.toDate?.()?.getFullYear() || "2025"}
                  </div>
                </div>
                <button
                  onClick={() => setShowProfile(true)}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                  title="View Profile"
                >
                  <User className="h-6 w-6" />
                </button>
                {userProfile?.isAdmin && (
                    <Link to="/admin" className="btn btn-secondary btn-sm">
                      Admin Panel
                    </Link>
                  )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div className="bg-gray-800 rounded-lg p-6" whileHover={{ y: -5 }}>
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-white">{stats.totalTournaments}</div>
                  <div className="text-gray-400">Tournaments</div>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-gray-800 rounded-lg p-6" whileHover={{ y: -5 }}>
              <div className="flex items-center">
                <Star className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-white">{stats.wins}</div>
                  <div className="text-gray-400">Wins</div>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-gray-800 rounded-lg p-6" whileHover={{ y: -5 }}>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-white">{stats.losses}</div>
                  <div className="text-gray-400">Losses</div>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-gray-800 rounded-lg p-6" whileHover={{ y: -5 }}>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-white">{stats.winRate}%</div>
                  <div className="text-gray-400">Win Rate</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Upcoming Tournaments */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Tournaments</h2>
            {upcomingTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTournaments.map((tournament) => (
                  <motion.div key={tournament.id} className="bg-gray-800 rounded-lg p-6" whileHover={{ y: -5 }}>
                    <h3 className="text-lg font-semibold text-white mb-3">{tournament.title}</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {tournament.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {tournament.location}
                      </div>
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2" />
                        {tournament.prize}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {tournament.participants?.length || 0}/{tournament.maxParticipants}
                      </div>
                    </div>
                    <div className="mt-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tournament.status === "upcoming" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                        }`}
                      >
                        {tournament.status === "upcoming" ? "Registered" : "Registration Open"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No upcoming tournaments</p>
                <a
                  href="/tournaments"
                  className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Browse Tournaments
                </a>
              </div>
            )}
          </div>

          {/* Tournament History */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Tournament History</h2>
            {completedTournaments.length > 0 ? (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-white">Tournament</th>
                      <th className="px-6 py-3 text-left text-white">Date</th>
                      <th className="px-6 py-3 text-left text-white">Location</th>
                      <th className="px-6 py-3 text-left text-white">Prize</th>
                      <th className="px-6 py-3 text-left text-white">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTournaments.map((tournament) => (
                      <tr key={tournament.id} className="border-t border-gray-700">
                        <td className="px-6 py-4 text-white">{tournament.title}</td>
                        <td className="px-6 py-4 text-gray-300">{tournament.date}</td>
                        <td className="px-6 py-4 text-gray-300">{tournament.location}</td>
                        <td className="px-6 py-4 text-gray-300">{tournament.prize}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-600 text-white rounded text-sm">Participated</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No tournament history yet</p>
              </div>
            )}
          </div>

          {/* Profile Modal */}
          {showProfile && <ProfileModal />}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
