"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, User, Eye, Share2, MessageCircle, Clock } from "lucide-react"

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedArticle, setSelectedArticle] = useState(null)

  // Mock news data
  const newsArticles = [
    {
      id: 1,
      title: "Mayez Championship 2025 Breaks Registration Records",
      excerpt:
        "The upcoming Mayez Championship has already attracted over 500 registrations, making it the largest pool tournament in history.",
      content:
        "The Mayez Championship 2025 has shattered all previous registration records with over 500 players from 45 countries already confirmed to participate. This unprecedented level of interest demonstrates the growing global appeal of professional pool tournaments...",
      category: "tournaments",
      author: "Sarah Johnson",
      publishedAt: "2025-01-15",
      readTime: "3 min read",
      views: 1247,
      image: "https://images.pexels.com/photos/16074/pexels-photo.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "New Prize Pool Structure Announced for 2025 Season",
      excerpt:
        "Tournament organizers reveal increased prize pools across all major events, with total season prizes exceeding $2 million.",
      content:
        "In an exciting development for professional pool players worldwide, tournament organizers have announced a significant increase in prize pools for the 2025 season...",
      category: "announcements",
      author: "Mike Chen",
      publishedAt: "2025-01-12",
      readTime: "4 min read",
      views: 892,
      image: "https://images.unsplash.com/photo-1599685315659-bc876da49fe5",
      featured: false,
    },
    {
      id: 3,
      title: "Rising Star: 19-Year-Old Prodigy Takes Youth Championship",
      excerpt:
        "Alex Rodriguez becomes the youngest player ever to win a major tournament, inspiring a new generation of pool players.",
      content:
        "At just 19 years old, Alex Rodriguez has made history by becoming the youngest player ever to win a major professional pool tournament...",
      category: "players",
      author: "Emma Davis",
      publishedAt: "2025-01-10",
      readTime: "5 min read",
      views: 2156,
      image: "https://images.pexels.com/photos/6253681/pexels-photo-6253681.jpeg",
      featured: true,
    },
    {
      id: 4,
      title: "Technology Integration: Live Streaming Reaches New Heights",
      excerpt:
        "Advanced camera systems and real-time analytics are revolutionizing how fans experience pool tournaments.",
      content:
        "The integration of cutting-edge technology in pool tournaments is transforming the viewing experience for fans worldwide...",
      category: "technology",
      author: "David Wilson",
      publishedAt: "2025-01-08",
      readTime: "6 min read",
      views: 743,
      image: "https://images.unsplash.com/photo-1627257060697-acfbecf5d9a2",
      featured: false,
    },
    {
      id: 5,
      title: "Women's Pool Championship Sees Record Participation",
      excerpt: "The upcoming Women's Championship has attracted the largest field in the tournament's history.",
      content:
        "The Women's Pool Championship continues to grow in popularity and prestige, with this year's tournament featuring the largest field of competitors in its history...",
      category: "tournaments",
      author: "Lisa Martinez",
      publishedAt: "2025-01-05",
      readTime: "4 min read",
      views: 1089,
      image: "https://images.pexels.com/photos/2017868/pexels-photo-2017868.jpeg",
      featured: false,
    },
    {
      id: 6,
      title: "New Training Facilities Open Across Major Cities",
      excerpt:
        "State-of-the-art training centers are being established to support the next generation of professional players.",
      content:
        "A network of world-class training facilities is being established across major cities to provide aspiring professional pool players with the resources they need to excel...",
      category: "announcements",
      author: "Robert Taylor",
      publishedAt: "2025-01-03",
      readTime: "3 min read",
      views: 567,
      image: "https://images.pexels.com/photos/6253986/pexels-photo-6253986.jpeg",
      featured: false,
    },
  ]

  const categories = [
    { id: "all", name: "All News" },
    { id: "tournaments", name: "Tournaments" },
    { id: "players", name: "Players" },
    { id: "announcements", name: "Announcements" },
    { id: "technology", name: "Technology" },
  ]

  const filteredArticles =
    selectedCategory === "all" ? newsArticles : newsArticles.filter((article) => article.category === selectedCategory)

  const featuredArticles = newsArticles.filter((article) => article.featured)
  const regularArticles = filteredArticles.filter((article) => !article.featured)

  const NewsCard = ({ article, index, featured = false }) => (
    <motion.div
      className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer group ${featured ? "md:col-span-2" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      onClick={() => setSelectedArticle(article)}
    >
      <div className="relative">
        <img
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            featured ? "h-64" : "h-48"
          }`}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className={`text-white font-semibold mb-3 line-clamp-2 ${featured ? "text-2xl" : "text-lg"}`}>
          {article.title}
        </h3>
        <p className="text-gray-400 mb-4 line-clamp-3">{article.excerpt}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(article.publishedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {article.readTime}
            </div>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {article.views}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const ArticleModal = ({ article, onClose }) => {
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === "Escape") onClose()
      }
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"

      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "unset"
      }
    }, [onClose])

    return (
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-64 object-cover" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                {article.category}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>

            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {article.readTime}
                </div>
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  {article.views} views
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed">{article.content}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">LATEST NEWS</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stay updated with the latest news, tournament results, and player stories from the world of professional
              pool.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Featured Articles */}
          {selectedCategory === "all" && featuredArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Featured Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredArticles.map((article, index) => (
                  <NewsCard key={article.id} article={article} index={index} featured />
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory === "all" ? "All News" : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </div>

          {/* Article Modal */}
          {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
        </motion.div>
      </div>
    </div>
  )
}

export default News
