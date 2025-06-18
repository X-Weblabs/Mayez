"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Calendar, MapPin, Users, Star, Award } from "lucide-react"

const History = () => {
  const [selectedYear, setSelectedYear] = useState("all")

  // Mock historical tournament data
  const tournaments = [
    {
      id: 1,
      year: 2024,
      title: "Mayez Championship 2024",
      date: "June 15-18, 2024",
      location: "Las Vegas, NV",
      winner: "John Smith",
      runnerUp: "Mike Johnson",
      participants: 128,
      prize: "$50,000",
      image: "https://images.pexels.com/photos/16074/pexels-photo.jpg",
      highlights: [
        "Record-breaking 128 participants",
        "First championship to be streamed live globally",
        "Youngest winner in tournament history at age 24",
      ],
    },
    {
      id: 2,
      year: 2024,
      title: "Elite Pool Masters 2024",
      date: "August 10-12, 2024",
      location: "New York, NY",
      winner: "Sarah Wilson",
      runnerUp: "Maria Garcia",
      participants: 64,
      prize: "$35,000",
      image: "https://images.unsplash.com/photo-1599685315659-bc876da49fe5",
      highlights: [
        "First female winner in Masters history",
        "Perfect game in the finals",
        "International broadcast in 15 countries",
      ],
    },
    {
      id: 3,
      year: 2023,
      title: "Mayez Championship 2023",
      date: "June 20-23, 2023",
      location: "Chicago, IL",
      winner: "David Brown",
      runnerUp: "Alex Chen",
      participants: 96,
      prize: "$45,000",
      image: "https://images.pexels.com/photos/10627147/pexels-photo-10627147.jpeg",
      highlights: ["Comeback victory from 0-6 deficit", "New attendance record", "Introduction of shot clock"],
    },
    {
      id: 4,
      year: 2023,
      title: "Pro Series Finals 2023",
      date: "September 5-7, 2023",
      location: "Miami, FL",
      winner: "Mike Johnson",
      runnerUp: "John Smith",
      participants: 32,
      prize: "$75,000",
      image: "https://images.pexels.com/photos/2017868/pexels-photo-2017868.jpeg",
      highlights: [
        "Highest prize pool in series history",
        "Perfect break and run in finals",
        "Celebrity exhibition matches",
      ],
    },
    {
      id: 5,
      year: 2022,
      title: "Mayez Championship 2022",
      date: "July 12-15, 2022",
      location: "Phoenix, AZ",
      winner: "Alex Chen",
      runnerUp: "Sarah Wilson",
      participants: 80,
      prize: "$40,000",
      image: "https://images.unsplash.com/photo-1575553939928-d03b21323afe",
      highlights: [
        "First tournament post-pandemic",
        "New safety protocols implemented",
        "Virtual reality training demonstrations",
      ],
    },
    {
      id: 6,
      year: 2022,
      title: "Women's Championship 2022",
      date: "October 18-20, 2022",
      location: "Orlando, FL",
      winner: "Maria Garcia",
      runnerUp: "Lisa Martinez",
      participants: 48,
      prize: "$30,000",
      image: "https://images.pexels.com/photos/6253681/pexels-photo-6253681.jpeg",
      highlights: ["Inaugural women's championship", "Scholarship program launched", "Youth mentorship initiative"],
    },
  ]

  const years = ["all", ...new Set(tournaments.map((t) => t.year))].sort((a, b) => {
    if (a === "all") return -1
    if (b === "all") return 1
    return b - a
  })

  const filteredTournaments =
    selectedYear === "all" ? tournaments : tournaments.filter((t) => t.year === Number.parseInt(selectedYear))

  const champions = tournaments.reduce((acc, tournament) => {
    const winner = tournament.winner
    if (!acc[winner]) {
      acc[winner] = {
        name: winner,
        titles: 0,
        tournaments: [],
      }
    }
    acc[winner].titles++
    acc[winner].tournaments.push(tournament)
    return acc
  }, {})

  const topChampions = Object.values(champions)
    .sort((a, b) => b.titles - a.titles)
    .slice(0, 5)

  const TournamentCard = ({ tournament, index }) => (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
    >
      <div className="relative">
        <img
          src={tournament.image || "/placeholder.svg"}
          alt={tournament.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">{tournament.year}</span>
        </div>
        <div className="absolute top-4 right-4">
          <Trophy className="h-6 w-6 text-yellow-500" />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-white font-bold text-xl mb-2">{tournament.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{tournament.date}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{tournament.location}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{tournament.participants} participants</span>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Champion</span>
            <span className="text-yellow-500 font-bold">{tournament.winner}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Runner-up</span>
            <span className="text-gray-300">{tournament.runnerUp}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Prize Pool</span>
            <span className="text-green-500 font-bold">{tournament.prize}</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Highlights</h4>
          <ul className="space-y-1">
            {tournament.highlights.map((highlight, idx) => (
              <li key={idx} className="text-gray-400 text-sm flex items-start">
                <Star className="h-3 w-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">TOURNAMENT HISTORY</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Relive the greatest moments in Mayez Tournament history. Champions, records, and legendary matches.
            </p>
          </div>

          {/* Year Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="flex flex-wrap gap-4">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedYear === year ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {year === "all" ? "All Years" : year}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Champions Hall of Fame */}
          <div className="mb-16">
            <motion.h2
              className="text-3xl font-bold text-white text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Hall of Champions
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {topChampions.map((champion, index) => (
                <motion.div
                  key={champion.name}
                  className="bg-gray-800 rounded-lg p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : index === 2
                            ? "bg-orange-600"
                            : "bg-gray-600"
                    }`}
                  >
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{champion.name}</h3>
                  <p className="text-gray-400">
                    {champion.titles} {champion.titles === 1 ? "Title" : "Titles"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tournament History Grid */}
          <div className="mb-12">
            <motion.h2
              className="text-3xl font-bold text-white text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {selectedYear === "all" ? "All Tournaments" : `${selectedYear} Tournaments`}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament, index) => (
                <TournamentCard key={tournament.id} tournament={tournament} index={index} />
              ))}
            </div>
          </div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-lg p-8"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">Tournament Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">{tournaments.length}</div>
                <div className="text-gray-400">Total Tournaments</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">
                  {tournaments.reduce((sum, t) => sum + t.participants, 0)}
                </div>
                <div className="text-gray-400">Total Participants</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">
                  $
                  {tournaments
                    .reduce((sum, t) => sum + Number.parseInt(t.prize.replace(/[^0-9]/g, "")), 0)
                    .toLocaleString()}
                </div>
                <div className="text-gray-400">Total Prize Money</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">{Object.keys(champions).length}</div>
                <div className="text-gray-400">Unique Champions</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default History
