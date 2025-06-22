"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Trophy, Calendar, Filter } from "lucide-react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/config"

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")
  const [sortBy, setSortBy] = useState("ranking")
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const unsubscribePlayers = onSnapshot(collection(db, "users"), (snapshot) => {
    const playersData = snapshot.docs
      .map((doc) => {
        const data = doc.data()

        if (data.isAdmin) return null // exclude admins

        const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim()
        const country = data.country || "Unknown"
        const skillLevel = data.skillLevel || "beginner"
        const winRate = data.wins && data.totalGames
          ? Math.round((data.wins / data.totalGames) * 100)
          : 0

        return {
          id: doc.id,
          name: fullName,
          country,
          skillLevel,
          winRate,
          profileImage: data.profileImage || null,
          ...data,
        }
      })
      .filter(Boolean) // remove nulls (admin users)

    setPlayers(playersData)
    setLoading(false)
  })

  return () => unsubscribePlayers()
}, [])


  const filteredPlayers = players.filter((player) => {
    const name = player.name?.toLowerCase() || ""
    const country = player.country?.toLowerCase() || ""
    
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      country.includes(searchTerm.toLowerCase())

    const matchesSkill =
      skillFilter === "all" || player.skillLevel === skillFilter

    return matchesSearch && matchesSkill
  })

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    return a.losses - b.losses
  }).map((player, index) => ({
    ...player,
    ranking: index + 1
  }))

  const PlayerCard = ({ player, index }) => (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
    >
      <div className="relative">
        <img
          src={player.profileImage || "/placeholder.svg"}
          alt={player.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">#{player.ranking}</div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-white font-bold text-xl mb-2">{player.name}</h3>
        <p className="text-gray-400 mb-4">{player.specialty} Specialist</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{player.wins}</div>
            <div className="text-gray-400 text-sm">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{player.losses}</div>
            <div className="text-gray-400 text-sm">Losses</div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Win Rate:</span>
            <span className="text-white font-semibold">{player.winRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tournaments:</span>
            <span className="text-white font-semibold">{player.tournaments}</span>
          </div>
          {/* <div className="flex justify-between">
            <span className="text-gray-400">Prize Money:</span>
            <span className="text-white font-semibold">${player.prize.toLocaleString()}</span>
          </div> */}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Joined {new Date(player.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                player.skillLevel === "professional"
                  ? "bg-gold text-black"
                  : player.skillLevel === "advanced"
                    ? "bg-silver text-black"
                    : "bg-bronze text-white"
              }`}
            >
              {player.skillLevel}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">PLAYER RANKINGS</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Meet the world's best pool players. View rankings, statistics, and player profiles.
            </p>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 rounded-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                />
              </div>

              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">All Skill Levels</option>
                <option value="professional">Professional</option>
                <option value="advanced">Advanced</option>
                <option value="intermediate">Intermediate</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="ranking">Sort by Ranking</option>
                <option value="winRate">Sort by Win Rate</option>
                <option value="tournaments">Sort by Tournaments</option>
                <option value="prize">Sort by Prize Money</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-gray-400">
                Showing {sortedPlayers.length} of {players.length} players
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">Filters applied</span>
              </div>
            </div>
          </motion.div>

          {/* Top 3 Players Podium */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Top 3 Players</h2>
            <div className="flex justify-center items-end space-x-8">
              {/* 2nd Place */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-gray-700 h-32 w-24 rounded-t-lg flex items-end justify-center pb-4">
                  <span className="text-white font-bold text-lg">2nd</span>
                </div>
                <div className="mt-4">
                  <img
                    src={players[1]?.profileImage || "/placeholder.svg"}
                    alt={players[1]?.name}
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                  <h3 className="text-white font-semibold">{players[1]?.name}</h3>
                  <p className="text-gray-400 text-sm">{players[1]?.country}</p>
                </div>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-yellow-500 h-40 w-24 rounded-t-lg flex items-end justify-center pb-4">
                  <span className="text-black font-bold text-lg">1st</span>
                </div>
                <div className="mt-4">
                  <img
                    src={players[0]?.profileImage || "/placeholder.svg"}
                    alt={players[0]?.name}
                    className="w-20 h-20 rounded-full mx-auto mb-2 border-4 border-yellow-500"
                  />
                  <h3 className="text-white font-semibold">{players[0]?.name}</h3>
                  <p className="text-gray-400 text-sm">{players[0]?.country}</p>
                  <div className="flex justify-center mt-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-orange-600 h-24 w-24 rounded-t-lg flex items-end justify-center pb-4">
                  <span className="text-white font-bold text-lg">3rd</span>
                </div>
                <div className="mt-4">
                  <img
                    src={players[2]?.profileImage || "/placeholder.svg"}
                    alt={players[2]?.name}
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                  <h3 className="text-white font-semibold">{players[2]?.name}</h3>
                  <p className="text-gray-400 text-sm">{players[2]?.country}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPlayers.map((player, index) => (
              <PlayerCard key={player.id} player={player} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Players
