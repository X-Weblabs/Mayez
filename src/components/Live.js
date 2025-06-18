"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Users, Eye, MessageCircle, Share2, Volume2, VolumeX } from "lucide-react"
import { useTournament } from "../contexts/TournamentContext"

const Live = () => {
  const { liveMatches } = useTournament()
  const [selectedStream, setSelectedStream] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isMuted, setIsMuted] = useState(false)

  // Mock live streams data
  const liveStreams = [
    {
      id: 1,
      title: "Mayez Championship Finals - Table 1",
      player1: "John Smith",
      player2: "Mike Johnson",
      viewers: 1247,
      youtubeId: "dQw4w9WgXcQ",
      status: "live",
      score: { player1: 3, player2: 2 },
    },
    {
      id: 2,
      title: "Elite Masters Semi-Final - Table 2",
      player1: "Sarah Wilson",
      player2: "David Brown",
      viewers: 892,
      youtubeId: "dQw4w9WgXcQ",
      status: "live",
      score: { player1: 1, player2: 4 },
    },
    {
      id: 3,
      title: "Pro Series Quarter Final - Table 3",
      player1: "Alex Chen",
      player2: "Maria Garcia",
      viewers: 634,
      youtubeId: "dQw4w9WgXcQ",
      status: "live",
      score: { player1: 2, player2: 1 },
    },
  ]

  // Mock chat messages
  useEffect(() => {
    const mockMessages = [
      { id: 1, user: "PoolFan123", message: "Great shot by John!", timestamp: new Date() },
      { id: 2, user: "CueStick99", message: "This match is intense!", timestamp: new Date() },
      { id: 3, user: "BilliardsKing", message: "Mike needs to step up his game", timestamp: new Date() },
      { id: 4, user: "PoolMaster", message: "Amazing tournament so far", timestamp: new Date() },
    ]
    setChatMessages(mockMessages)
  }, [])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: "You",
        message: newMessage,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  const StreamCard = ({ stream, index }) => (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      onClick={() => setSelectedStream(stream)}
    >
      <div className="relative">
        <img
          src={`/placeholder.svg?height=200&width=400`}
          alt={stream.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Live Badge */}
        <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          LIVE
        </div>

        {/* Viewers Count */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          {stream.viewers}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 rounded-full p-4">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{stream.title}</h3>

        <div className="flex justify-between items-center mb-3">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{stream.score.player1}</div>
            <div className="text-sm text-gray-400">{stream.player1}</div>
          </div>
          <div className="text-gray-400 font-bold">VS</div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{stream.score.player2}</div>
            <div className="text-sm text-gray-400">{stream.player2}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {stream.viewers} watching
          </div>
          <div className="flex items-center space-x-2">
            <button className="hover:text-white transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="hover:text-white transition-colors">
              <MessageCircle className="h-4 w-4" />
            </button>
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">LIVE STREAMS</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Watch live pool tournaments and matches from around the world. Experience the excitement in real-time.
            </p>
          </div>

          {/* Featured Stream */}
          {selectedStream ? (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="grid gap-0">
                  {/* Video Player */}
                  <div className="lg:col-span-3">
                    <div className="aspect-video relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedStream.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                        title={selectedStream.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />

                      {/* Stream Controls */}
                      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
                        <div className="bg-red-600 text-white px-3 py-1 rounded flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                          LIVE
                        </div>
                        <div className="bg-black/70 text-white px-3 py-1 rounded flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {selectedStream.viewers}
                        </div>
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="bg-black/70 text-white p-2 rounded hover:bg-black/90 transition-colors"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Stream Info */}
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedStream.title}</h2>

                      <div className="flex justify-between items-center mb-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white">{selectedStream.score.player1}</div>
                          <div className="text-gray-400">{selectedStream.player1}</div>
                        </div>
                        <div className="text-gray-400 text-xl font-bold">VS</div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white">{selectedStream.score.player2}</div>
                          <div className="text-gray-400">{selectedStream.player2}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-400">
                          <Users className="h-5 w-5 mr-2" />
                          {selectedStream.viewers} viewers
                        </div>
                        <div className="flex space-x-4">
                          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center transition-colors">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStream(null)}
                className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
              >
                ← Back to All Streams
              </button>
            </motion.div>
          ) : (
            <>
              {/* Live Streams Grid */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Current Live Streams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveStreams.map((stream, index) => (
                    <StreamCard key={stream.id} stream={stream} index={index} />
                  ))}
                </div>
              </div>

              {/* Upcoming Streams */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Upcoming Streams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((item, index) => (
                    <motion.div
                      key={item}
                      className="bg-gray-800 rounded-lg p-6"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white mb-2">Tournament Match #{item}</div>
                        <div className="text-gray-400 mb-4">Starting in 2 hours</div>
                        <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Scheduled</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stream Schedule */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Today's Schedule</h2>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="divide-y divide-gray-700">
                    {[
                      { time: "2:00 PM", match: "Championship Semi-Final - Table 1", players: "Smith vs Johnson" },
                      { time: "4:00 PM", match: "Masters Quarter-Final - Table 2", players: "Wilson vs Brown" },
                      { time: "6:00 PM", match: "Pro Series Final - Table 3", players: "Chen vs Garcia" },
                      { time: "8:00 PM", match: "Elite Championship - Table 1", players: "Davis vs Martinez" },
                    ].map((schedule, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-red-500 font-bold text-lg">{schedule.time}</div>
                          <div>
                            <div className="text-white font-semibold">{schedule.match}</div>
                            <div className="text-gray-400">{schedule.players}</div>
                          </div>
                        </div>
                        <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Upcoming</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Live
