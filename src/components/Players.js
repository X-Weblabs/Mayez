"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Trophy, Calendar, Filter } from "lucide-react"

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")
  const [sortBy, setSortBy] = useState("ranking")

  // Mock player data
  const players = [
    {
      id: 1,
      name: "John Smith",
      country: "USA",
      ranking: 1,
      skillLevel: "professional",
      wins: 45,
      losses: 12,
      totalGames: 57,
      winRate: 79,
      tournaments: 23,
      prize: 125000,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      joinDate: "2020-01-15",
      specialty: "9-Ball",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      country: "UK",
      ranking: 2,
      skillLevel: "professional",
      wins: 42,
      losses: 15,
      totalGames: 57,
      winRate: 74,
      tournaments: 21,
      prize: 98000,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
      joinDate: "2019-08-22",
      specialty: "8-Ball",
    },
    {
      id: 3,
      name: "Mike Johnson",
      country: "Canada",
      ranking: 3,
      skillLevel: "professional",
      wins: 38,
      losses: 18,
      totalGames: 56,
      winRate: 68,
      tournaments: 19,
      prize: 87500,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      joinDate: "2021-03-10",
      specialty: "Straight Pool",
    },
    {
      id: 4,
      name: "Maria Garcia",
      country: "Spain",
      ranking: 4,
      skillLevel: "advanced",
      wins: 35,
      losses: 20,
      totalGames: 55,
      winRate: 64,
      tournaments: 18,
      prize: 76000,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      joinDate: "2020-11-05",
      specialty: "9-Ball",
    },
    {
      id: 5,
      name: "David Brown",
      country: "Australia",
      ranking: 5,
      skillLevel: "advanced",
      wins: 32,
      losses: 22,
      totalGames: 54,
      winRate: 59,
      tournaments: 16,
      prize: 65000,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      joinDate: "2021-07-18",
      specialty: "8-Ball",
    },
    {
      id: 6,
      name: "Alex Chen",
      country: "China",
      ranking: 6,
      skillLevel: "advanced",
      wins: 29,
      losses: 25,
      totalGames: 54,
      winRate: 54,
      tournaments: 15,
      prize: 58000,
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128",
      joinDate: "2022-01-12",
      specialty: "Straight Pool",
    },
  ]

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = skillFilter === "all" || player.skillLevel === skillFilter
    return matchesSearch && matchesSkill
  })

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case "ranking":
        return a.ranking - b.ranking
      case "winRate":
        return b.winRate - a.winRate
      case "tournaments":
        return b.tournaments - a.tournaments
      case "prize":
        return b.prize - a.prize
      default:
        return a.ranking - b.ranking
    }
  })

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
          src={player.image || "/placeholder.svg"}
          alt={player.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">#{player.ranking}</div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-black/70 text-white px-2 py-1 rounded text-sm">{player.country}</div>
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
          <div className="flex justify-between">
            <span className="text-gray-400">Prize Money:</span>
            <span className="text-white font-semibold">${player.prize.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Joined {new Date(player.joinDate).getFullYear()}
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
                    src={players[1]?.image || "/placeholder.svg"}
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
                    src={players[0]?.image || "/placeholder.svg"}
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
                    src={players[2]?.image || "/placeholder.svg"}
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
