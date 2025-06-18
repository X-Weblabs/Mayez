"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Calendar, Users, Trophy, MapPin, CreditCard } from "lucide-react"
import { useTournament } from "../contexts/TournamentContext"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Tournaments = () => {
  const { tournaments, loading } = useTournament()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [prizeFilter, setPrizeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Mock tournaments if Firebase data is not available
  const mockTournaments = [
    {
      id: 1,
      title: "Mayez Championship 2025",
      type: "Championship",
      date: "June 15-18, 2025",
      location: "Las Vegas, NV",
      prize: "$50,000",
      participants: 128,
      maxParticipants: 128,
      entryFee: 500,
      status: "Registration Open",
      image: "https://images.pexels.com/photos/16074/pexels-photo.jpg",
      color: "from-red-600 to-red-800",
      description: "The premier championship event of the year featuring the world's best pool players.",
    },
    {
      id: 2,
      title: "Elite Pool Masters",
      type: "Masters",
      date: "July 10-12, 2025",
      location: "New York, NY",
      prize: "$35,000",
      participants: 45,
      maxParticipants: 64,
      entryFee: 350,
      status: "Registration Open",
      image: "https://images.unsplash.com/photo-1599685315659-bc876da49fe5",
      color: "from-blue-600 to-blue-800",
      description: "Elite level competition for master-ranked players only.",
    },
    {
      id: 3,
      title: "Pro Series Finals",
      type: "Pro Series",
      date: "August 5-7, 2025",
      location: "Chicago, IL",
      prize: "$75,000",
      participants: 32,
      maxParticipants: 32,
      entryFee: 750,
      status: "Qualifiers Ongoing",
      image: "https://images.pexels.com/photos/10627147/pexels-photo-10627147.jpeg",
      color: "from-green-600 to-green-800",
      description: "The culmination of the Pro Series season with the highest stakes.",
    },
    {
      id: 4,
      title: "Women's Championship",
      type: "Women's Pro",
      date: "September 20-22, 2025",
      location: "Miami, FL",
      prize: "$40,000",
      participants: 28,
      maxParticipants: 64,
      entryFee: 400,
      status: "Registration Open",
      image: "https://images.pexels.com/photos/2017868/pexels-photo-2017868.jpeg",
      color: "from-purple-600 to-purple-800",
      description: "Celebrating the best female pool players in professional competition.",
    },
    {
      id: 5,
      title: "Seniors League Cup",
      type: "Seniors",
      date: "October 15-17, 2025",
      location: "Phoenix, AZ",
      prize: "$25,000",
      participants: 67,
      maxParticipants: 96,
      entryFee: 250,
      status: "Registration Open",
      image: "https://images.unsplash.com/photo-1575553939928-d03b21323afe",
      color: "from-orange-600 to-orange-800",
      description: "Honoring the experience and skill of senior players aged 50+.",
    },
    {
      id: 6,
      title: "Youth Championship",
      type: "Youth",
      date: "November 12-14, 2025",
      location: "Orlando, FL",
      prize: "$15,000",
      participants: 89,
      maxParticipants: 128,
      entryFee: 150,
      status: "Registration Open",
      image: "https://images.pexels.com/photos/6253681/pexels-photo-6253681.jpeg",
      color: "from-cyan-600 to-cyan-800",
      description: "Developing the next generation of pool champions under 21.",
    },
    {
      id: 7,
      title: "International Open",
      type: "Open",
      date: "December 1-3, 2025",
      location: "London, UK",
      prize: "$60,000",
      participants: 156,
      maxParticipants: 200,
      entryFee: 400,
      status: "Registration Open",
      image: "https://images.pexels.com/photos/16074/pexels-photo.jpg",
      color: "from-indigo-600 to-indigo-800",
      description: "The biggest international pool tournament of the year.",
    },
    {
      id: 8,
      title: "Regional Qualifier",
      type: "Qualifier",
      date: "January 15-16, 2026",
      location: "Dallas, TX",
      prize: "$10,000",
      participants: 78,
      maxParticipants: 100,
      entryFee: 200,
      status: "Registration Open",
      image: "https://images.unsplash.com/photo-1599685315659-bc876da49fe5",
      color: "from-teal-600 to-teal-800",
      description: "Qualify for the major tournaments in this regional competition.",
    },
  ]

  const displayTournaments = tournaments.length > 0 ? tournaments : mockTournaments

  const filteredTournaments = displayTournaments.filter((tournament) => {
    const matchesSearch =
      tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || tournament.status.toLowerCase().includes(statusFilter.toLowerCase())
    const matchesType = typeFilter === "all" || tournament.type === typeFilter
    const matchesPrize =
      prizeFilter === "all" ||
      (prizeFilter === "low" && Number.parseInt(tournament.prize.replace(/[^0-9]/g, "")) < 30000) ||
      (prizeFilter === "medium" &&
        Number.parseInt(tournament.prize.replace(/[^0-9]/g, "")) >= 30000 &&
        Number.parseInt(tournament.prize.replace(/[^0-9]/g, "")) < 60000) ||
      (prizeFilter === "high" && Number.parseInt(tournament.prize.replace(/[^0-9]/g, "")) >= 60000)

    return matchesSearch && matchesStatus && matchesType && matchesPrize
  })

  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.date) - new Date(b.date)
      case "prize":
        return Number.parseInt(b.prize.replace(/[^0-9]/g, "")) - Number.parseInt(a.prize.replace(/[^0-9]/g, ""))
      case "participants":
        return b.participants - a.participants
      case "entryFee":
        return a.entryFee - b.entryFee
      default:
        return 0
    }
  })

  const handleRegister = (tournamentId) => {
    if (!currentUser) {
      navigate("/login")
      return
    }
    navigate(`/payment/${tournamentId}`)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "registration open":
        return "bg-green-600"
      case "upcoming":
        return "bg-blue-600"
      case "qualifiers ongoing":
        return "bg-yellow-600"
      case "live":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const TournamentCard = ({ tournament, index }) => {
    const canRegister =
      tournament.status === "registration" && tournament.participants < tournament.maxParticipants

    return (
      <motion.div
        className="group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        whileHover={{ y: -8 }}
        viewport={{ once: true }}
      >
        <div className="relative rounded-lg overflow-hidden bg-gray-800">
          <div className={`absolute inset-0 bg-gradient-to-br ${tournament.color} opacity-80`} />
          <img
            src={tournament.image || "https://images.pexels.com/photos/6253681/pexels-photo-6253681.jpeg"}
            alt={tournament.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div>
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {tournament.type}
              </span>
            </div>

            <div>
              <h3 className="text-white font-bold text-2xl mb-2">{tournament.title}</h3>
                <div>
                  <div className="flex justify-between">
                    <div className="flex items-center text-white/90">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{tournament.date}</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{tournament.location}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center text-white/90">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span className="text-sm">{tournament.prize}</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {Array.isArray(tournament.participants)
                          ? tournament.participants.length
                          : tournament.participants || 0}
                        /{tournament.maxParticipants} Players
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center text-white/90">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span className="text-sm">${tournament.entryFee} Entry Fee</span>
                    </div>
                </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(tournament.status)}`}
                >
                  {tournament.status}
                </span>

                {canRegister && (
                  <motion.button
                    onClick={() => handleRegister(tournament.id)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register Now
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">TOURNAMENTS</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Compete in professional pool tournaments with players from around the world. Register now and showcase
              your skills on the biggest stage.
            </p>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 rounded-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="registration">Registration Open</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">All Types</option>
                <option value="Championship">Championship</option>
                <option value="Masters">Masters</option>
                <option value="Pro Series">Pro Series</option>
                <option value="Women's Pro">Women's Pro</option>
                <option value="Seniors">Seniors</option>
                <option value="Youth">Youth</option>
              </select>

              <select
                value={prizeFilter}
                onChange={(e) => setPrizeFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">All Prizes</option>
                <option value="low">Under $30K</option>
                <option value="medium">$30K - $60K</option>
                <option value="high">Over $60K</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="date">Sort by Date</option>
                <option value="prize">Sort by Prize</option>
                <option value="participants">Sort by Participants</option>
                <option value="entryFee">Sort by Entry Fee</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-gray-400">
                Showing {sortedTournaments.length} of {displayTournaments.length} tournaments
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">Filters applied</span>
              </div>
            </div>
          </motion.div>

          {/* Tournament Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : sortedTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTournaments.map((tournament, index) => (
                <TournamentCard key={tournament.id} tournament={tournament} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No tournaments found</h3>
              <p className="text-gray-400">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Tournaments
