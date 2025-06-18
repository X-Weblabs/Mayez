"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Users, Trophy, Calendar, DollarSign, Play, Pause } from "lucide-react"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/config"

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("tournaments")
  const [tournaments, setTournaments] = useState([])
  const [matches, setMatches] = useState([])
  const [users, setUsers] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Real-time listeners
  useEffect(() => {
    const unsubscribeTournaments = onSnapshot(collection(db, "tournaments"), (snapshot) => {
      const tournamentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setTournaments(tournamentsData)
    })

    const unsubscribeMatches = onSnapshot(collection(db, "matches"), (snapshot) => {
      const matchesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setMatches(matchesData)
    })

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setUsers(usersData)
    })

    return () => {
      unsubscribeTournaments()
      unsubscribeMatches()
      unsubscribeUsers()
    }
  }, [])

  const tabs = [
    { id: "tournaments", name: "Tournaments", icon: Trophy },
    { id: "matches", name: "Live Matches", icon: Play },
    { id: "users", name: "Users", icon: Users },
    { id: "analytics", name: "Analytics", icon: DollarSign },
  ]

  // Tournament Management
  const TournamentManager = () => {
    const [formData, setFormData] = useState({
      title: "",
      type: "",
      date: "",
      location: "",
      prize: "",
      entryFee: "",
      maxParticipants: "",
      description: "",
      status: "upcoming",
      image: "",
    })

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        if (editingItem) {
          await updateDoc(doc(db, "tournaments", editingItem.id), formData)
        } else {
          await addDoc(collection(db, "tournaments"), {
            ...formData,
            createdAt: new Date(),
            participants: [],
            matches: [],
          })
        }
        setShowCreateModal(false)
        setEditingItem(null)
        setFormData({
          title: "",
          type: "",
          date: "",
          location: "",
          prize: "",
          entryFee: "",
          maxParticipants: "",
          description: "",
          status: "upcoming",
          image: "",
        })
      } catch (error) {
        console.error("Error saving tournament:", error)
      }
    }

    const handleEdit = (tournament) => {
      setEditingItem(tournament)
      setFormData({
        title: tournament.title || "",
        type: tournament.type || "",
        date: tournament.date || "",
        location: tournament.location || "",
        prize: tournament.prize?.toString() || "",
        entryFee: tournament.entryFee?.toString() || "",
        maxParticipants: tournament.maxParticipants?.toString() || "",
        description: tournament.description || "",
        status: tournament.status || "upcoming",
        image: tournament.image || "",
      })
      setShowCreateModal(true)
    }

    const handleDelete = async (tournamentId) => {
      if (window.confirm("Are you sure you want to delete this tournament?")) {
        try {
          await deleteDoc(doc(db, "tournaments", tournamentId))
        } catch (error) {
          console.error("Error deleting tournament:", error)
        }
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Tournament Management</h2>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Tournament
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <motion.div key={tournament.id} className="bg-gray-800 rounded-lg p-6" whileHover={{ y: -5 }}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">{tournament.title}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(tournament)} className="text-blue-400 hover:text-blue-300">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(tournament.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <Calendar className="inline h-4 w-4 mr-2" />
                  {tournament.date}
                </p>
                <p>
                  <Users className="inline h-4 w-4 mr-2" />
                  {tournament.participants?.length || 0}/{tournament.maxParticipants}
                </p>
                <p>
                  <DollarSign className="inline h-4 w-4 mr-2" />${tournament.entryFee}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    tournament.status === "live"
                      ? "bg-red-600"
                      : tournament.status === "upcoming"
                        ? "bg-blue-600"
                        : "bg-gray-600"
                  }`}
                >
                  {tournament.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {editingItem ? "Edit Tournament" : "Create Tournament"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tournament Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Type (e.g., Championship)"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Prize Pool"
                    value={formData.prize}
                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Entry Fee"
                    value={formData.entryFee}
                    onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Max Participants"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    required
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white h-24"
                  required
                />

                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />

                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="registration">Registration Open</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingItem(null)
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    {editingItem ? "Update Tournament" : "Create Tournament"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    )
  }

  // Live Match Manager
  const MatchManager = () => {
    const [selectedMatch, setSelectedMatch] = useState(null)
    const [scoreUpdate, setScoreUpdate] = useState({ player1Score: 0, player2Score: 0 })

    const updateMatchScore = async (matchId, scoreData) => {
      try {
        await updateDoc(doc(db, "matches", matchId), {
          ...scoreData,
          lastUpdated: new Date(),
        })
      } catch (error) {
        console.error("Error updating match:", error)
      }
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Live Match Management</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match) => (
            <motion.div key={match.id} className="bg-gray-800 rounded-lg p-6" whileHover={{ y: -2 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {match.player1} vs {match.player2}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    match.status === "live" ? "bg-red-600" : match.status === "upcoming" ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  {match.status}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{match.player1Score || 0}</div>
                  <div className="text-sm text-gray-400">{match.player1}</div>
                </div>
                <div className="text-gray-400">VS</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{match.player2Score || 0}</div>
                  <div className="text-sm text-gray-400">{match.player2}</div>
                </div>
              </div>

              {match.status === "live" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      updateMatchScore(match.id, {
                        player1Score: (match.player1Score || 0) + 1,
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
                  >
                    +1 {match.player1}
                  </button>
                  <button
                    onClick={() =>
                      updateMatchScore(match.id, {
                        player2Score: (match.player2Score || 0) + 1,
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
                  >
                    +1 {match.player2}
                  </button>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => updateMatchScore(match.id, { status: "live" })}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  <Play className="h-4 w-4 inline mr-1" />
                  Start
                </button>
                <button
                  onClick={() => updateMatchScore(match.id, { status: "paused" })}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                >
                  <Pause className="h-4 w-4 inline mr-1" />
                  Pause
                </button>
                <button
                  onClick={() =>
                    updateMatchScore(match.id, {
                      status: "completed",
                      winner: (match.player1Score || 0) > (match.player2Score || 0) ? match.player1 : match.player2,
                    })
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  End Match
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Analytics Dashboard
  const Analytics = () => {
    const totalRevenue = tournaments.reduce((sum, t) => sum + t.entryFee * (t.participants?.length || 0), 0)
    const totalPlayers = users.length
    const activeTournaments = tournaments.filter((t) => t.status === "live" || t.status === "registration").length

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-white">${totalRevenue}</div>
                <div className="text-gray-400">Total Revenue</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-white">{totalPlayers}</div>
                <div className="text-gray-400">Total Players</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-white">{tournaments.length}</div>
                <div className="text-gray-400">Total Tournaments</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-white">{activeTournaments}</div>
                <div className="text-gray-400">Active Tournaments</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex justify-between items-center">
                <div>
                  <div className="text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-gray-400 text-sm">{user.email}</div>
                </div>
                <div className="text-gray-400 text-sm">
                  {user.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const toggleUserAdminStatus = async (userId, currentIsAdmin) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isAdmin: !currentIsAdmin,
      })
    } catch (error) {
      console.error("Error updating user admin status:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Admin Panel</h1>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "tournaments" && <TournamentManager />}
            {activeTab === "matches" && <MatchManager />}
            {activeTab === "users" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-white">Name</th>
                        <th className="px-6 py-3 text-left text-white">Email</th>
                        <th className="px-6 py-3 text-left text-white">Role</th>
                        <th className="px-6 py-3 text-left text-white">Skill Level</th>
                        <th className="px-6 py-3 text-left text-white">Tournaments</th>
                        <th className="px-6 py-3 text-left text-white">Joined</th>
                        <th className="px-6 py-3 text-left text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t border-gray-700">
                          <td className="px-6 py-4 text-white">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-6 py-4 text-gray-300">{user.email}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs ${user.isAdmin ? "bg-red-600" : "bg-blue-600"} text-white`}
                            >
                              {user.isAdmin ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{user.skillLevel}</td>
                          <td className="px-6 py-4 text-gray-300">{user.tournaments?.length || 0}</td>
                          <td className="px-6 py-4 text-gray-300">
                            {user.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleUserAdminStatus(user.id, user.isAdmin)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Make {user.isAdmin ? "User" : "Admin"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "analytics" && <Analytics />}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminPanel
