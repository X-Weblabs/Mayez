"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronDown, Calendar, Users, Trophy, Play, Star, MapPin, Clock } from "lucide-react"
import { useTournament } from "../contexts/TournamentContext"
import { useAuth } from "../contexts/AuthContext"

const Home = () => {
  const { tournaments, loading } = useTournament()
  const { currentUser } = useAuth()
  const [selectedVideo, setSelectedVideo] = useState(null)

  // Mock data for featured content
  const mockTournaments = [
    {
      id: 1,
      title: "Mayez Championship 2025",
      type: "Championship",
      date: "June 15-18, 2025",
      location: "Las Vegas, NV",
      prize: "$50,000",
      participants: 128,
      status: "Upcoming",
      image: "https://images.pexels.com/photos/16074/pexels-photo.jpg",
      color: "from-red-600 to-red-800",
    },
    {
      id: 2,
      title: "Elite Pool Masters",
      type: "Masters",
      date: "July 10-12, 2025",
      location: "New York, NY",
      prize: "$35,000",
      participants: 64,
      status: "Registration Open",
      image: "https://images.unsplash.com/photo-1599685315659-bc876da49fe5",
      color: "from-blue-600 to-blue-800",
    },
    {
      id: 3,
      title: "Pro Series Finals",
      type: "Pro Series",
      date: "August 5-7, 2025",
      location: "Chicago, IL",
      prize: "$75,000",
      participants: 32,
      status: "Qualifiers Ongoing",
      image: "https://images.pexels.com/photos/10627147/pexels-photo-10627147.jpeg",
      color: "from-green-600 to-green-800",
    },
    {
      id: 4,
      title: "Women's Championship",
      type: "Women's Pro",
      date: "September 20-22, 2025",
      location: "Miami, FL",
      prize: "$40,000",
      participants: 64,
      status: "Coming Soon",
      image: "https://images.pexels.com/photos/2017868/pexels-photo-2017868.jpeg",
      color: "from-purple-600 to-purple-800",
    },
    {
      id: 5,
      title: "Seniors League Cup",
      type: "Seniors",
      date: "October 15-17, 2025",
      location: "Phoenix, AZ",
      prize: "$25,000",
      participants: 96,
      status: "Registration Open",
      image: "https://images.unsplash.com/photo-1575553939928-d03b21323afe",
      color: "from-orange-600 to-orange-800",
    },
    {
      id: 6,
      title: "Youth Championship",
      type: "Youth",
      date: "November 12-14, 2025",
      location: "Orlando, FL",
      prize: "$15,000",
      participants: 128,
      status: "Registration Open",
      image: "https://images.pexels.com/photos/6253681/pexels-photo-6253681.jpeg",
      color: "from-cyan-600 to-cyan-800",
    },
  ]

  const mockRecommended = [
    {
      id: 1,
      title: "Mayez Pro Championship - Week 4",
      subtitle: "Elite Players Showcase",
      date: "June 25, 2025",
      time: "8:00 PM EST",
      image: "https://images.unsplash.com/photo-1641638066062-6ebb46f56c70",
      status: "Live",
    },
    {
      id: 2,
      title: "Masters Tournament Finals",
      subtitle: "Championship Showdown",
      date: "June 28, 2025",
      time: "7:30 PM EST",
      image: "https://images.pexels.com/photos/6253986/pexels-photo-6253986.jpeg",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Women's Elite Series - Semi Finals",
      subtitle: "Top 4 Compete",
      date: "June 30, 2025",
      time: "6:00 PM EST",
      image: "https://images.unsplash.com/photo-1556329754-9420aeb663c5",
      status: "Upcoming",
    },
    {
      id: 4,
      title: "Youth Championship Qualifier",
      subtitle: "Next Generation Stars",
      date: "July 2, 2025",
      time: "5:00 PM EST",
      image: "https://images.pexels.com/photos/3007388/pexels-photo-3007388.jpeg",
      status: "Registration",
    },
  ]

  const mockVideos = [
    {
      id: 1,
      title: "Mayez Tournament Highlights - Episode 15",
      duration: "42:30",
      views: "125K",
      image: "https://images.unsplash.com/photo-1627257060697-acfbecf5d9a2",
      youtubeId: "OdrBujOwJQA",
    },
    {
      id: 2,
      title: "Pro Series Championship Final",
      duration: "35:45",
      views: "89K",
      image: "https://images.pexels.com/photos/6253979/pexels-photo-6253979.jpeg",
      youtubeId: "OdrBujOwJQA",
    },
    {
      id: 3,
      title: "Masters Tournament Best Shots",
      duration: "28:15",
      views: "156K",
      image: "https://images.pexels.com/photos/16074/pexels-photo.jpg",
      youtubeId: "OdrBujOwJQA",
    },
    {
      id: 4,
      title: "Behind the Scenes - Tournament Setup",
      duration: "18:20",
      views: "67K",
      image: "https://images.unsplash.com/photo-1599685315659-bc876da49fe5",
      youtubeId: "OdrBujOwJQA",
    },
  ]

  // Recommended Card Component
  const RecommendedCard = ({ item, index }) => {
    return (
      <motion.div
        className="bg-gray-800 rounded-lg overflow-hidden group cursor-pointer card-hover"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="relative">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded status-badge ${
                item.status === "Live"
                  ? "bg-red-600 text-white"
                  : item.status === "Upcoming"
                    ? "bg-blue-600 text-white"
                    : "bg-yellow-600 text-black"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{item.subtitle}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {item.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {item.time}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Tournament Card Component
  const TournamentCard = ({ tournament, index }) => {
    return (
      <motion.div
        className="group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        whileHover={{ y: -8 }}
        viewport={{ once: true }}
      >
        <div className="relative rounded-lg overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${tournament.color} opacity-80`} />
          <img
            src={tournament.image || "/placeholder.svg"}
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
              <div className="space-y-2">
                <div className="flex items-center text-white/90">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{tournament.date}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{tournament.location}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span className="text-sm">{tournament.prize}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{tournament.participants} Players</span>
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium status-badge ${
                    tournament.status === "Upcoming"
                      ? "bg-blue-600 text-white"
                      : tournament.status === "Registration Open"
                        ? "bg-green-600 text-white"
                        : tournament.status === "Qualifiers Ongoing"
                          ? "bg-yellow-600 text-black"
                          : "bg-gray-600 text-white"
                  }`}
                >
                  {tournament.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Video Card Component
  const VideoCard = ({ video, index, onClick }) => {
    return (
      <motion.div
        className="group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        whileHover={{ y: -5 }}
        viewport={{ once: true }}
        onClick={onClick}
      >
        <div className="relative rounded-lg overflow-hidden bg-gray-800 card-hover">
          <img
            src={video.image || "/placeholder.svg"}
            alt={video.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-red-600 rounded-full p-4">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
            {video.duration}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
          <div className="flex items-center text-gray-400 text-sm">
            <Star className="h-4 w-4 mr-1" />
            {video.views} views
          </div>
        </div>
      </motion.div>
    )
  }

  // Video Modal Component
  const VideoModal = ({ video, onClose }) => {
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === "Escape") onClose()
      }
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }, [onClose])

    return (
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 video-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-lg overflow-hidden max-w-4xl w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-6">
            <h3 className="text-white text-xl font-semibold mb-2">{video.title}</h3>
            <div className="flex items-center text-gray-400">
              <Star className="h-4 w-4 mr-1" />
              {video.views} views
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/16074/pexels-photo.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              THE
              <br />
              MAYEZ
              <br />
              <span className="text-red-500">TOURNAMENT</span>
            </h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              The Mayez Tournament Organization Organizes
              <br />
              And Promotes Professional Pool
              <br />
              Championship Events.
            </motion.p>
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link to="/tournaments" className="btn btn-primary btn-lg btn-animate">
                <Trophy size={20} />
                VIEW TOURNAMENTS
              </Link>
              <Link to="/live" className="btn btn-secondary btn-lg">
                <Play size={20} />
                WATCH LIVE
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <ChevronDown className="text-white h-8 w-8" />
        </motion.div>
      </section>

      {/* Recommended Section */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <motion.h2
            className="section-title text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            RECOMMENDED
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockRecommended.map((item, index) => (
              <RecommendedCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section className="py-16 bg-black">
        <div className="container">
          <motion.h2
            className="section-title text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            TOURNAMENTS
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTournaments.map((tournament, index) => (
              <TournamentCard key={tournament.id} tournament={tournament} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/tournaments" className="btn btn-outline btn-lg">
              View All Tournaments
            </Link>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <motion.h2
            className="section-title text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            EXCLUSIVE VIDEOS
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} onClick={() => setSelectedVideo(video)} />
            ))}
          </div>

          {/* Video Modal */}
          {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-black">
        <div className="container">
          <div className="text-center">
            <motion.h2
              className="section-title mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Compete?
            </motion.h2>
            <motion.p
              className="section-subtitle mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of players in the world's premier pool tournaments
            </motion.p>
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              {!currentUser ? (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    <Users size={20} />
                    Register Now
                  </Link>
                  <Link to="/tournaments" className="btn btn-secondary btn-lg">
                    <Trophy size={20} />
                    Browse Tournaments
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/tournaments" className="btn btn-primary btn-lg">
                    <Trophy size={20} />
                    Join Tournament
                  </Link>
                  <Link to="/dashboard" className="btn btn-secondary btn-lg">
                    <Star size={20} />
                    View Dashboard
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-red-500 mb-2">50+</div>
              <div className="text-gray-400">Tournaments Organized</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-red-500 mb-2">10,000+</div>
              <div className="text-gray-400">Players Worldwide</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-red-500 mb-2">45</div>
              <div className="text-gray-400">Countries Represented</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-red-500 mb-2">$2M+</div>
              <div className="text-gray-400">Prize Money Distributed</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-white font-bold text-2xl mb-4">
                MAYEZ<span className="text-red-500">TOURNAMENT</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The premier pool tournament organization, bringing you the most exciting and competitive pool
                championships worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm">f</span>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm">t</span>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm">i</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Tournaments", "Players", "Rules", "Calendar", "Live Scoring"].map((link) => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@mayeztournament.com</li>
                <li>+1 (555) 123-4567</li>
                <li>
                  123 Tournament Ave
                  <br />
                  Las Vegas, NV 89101
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2025 Mayez Tournament. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
