"use client"

import { motion } from "framer-motion"
import { Trophy, Users, Globe, Award, Target, Heart, Star, MapPin } from "lucide-react"

const About = () => {
  const stats = [
    { icon: Trophy, label: "Tournaments Organized", value: "50+" },
    { icon: Users, label: "Players Worldwide", value: "10,000+" },
    { icon: Globe, label: "Countries Represented", value: "45" },
    { icon: Award, label: "Prize Money Distributed", value: "$2M+" },
  ]

  const team = [
    {
      name: "Michael Rodriguez",
      role: "Tournament Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      bio: "20+ years in professional pool tournament organization",
    },
    {
      name: "Sarah Chen",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
      bio: "Expert in event logistics and player relations",
    },
    {
      name: "David Thompson",
      role: "Technical Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      bio: "Innovating tournament technology and live streaming",
    },
    {
      name: "Lisa Martinez",
      role: "Player Development",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      bio: "Former professional player and youth program coordinator",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description:
        "We strive for the highest standards in every tournament we organize, ensuring fair play and professional competition.",
    },
    {
      icon: Heart,
      title: "Passion",
      description:
        "Our love for the game of pool drives everything we do, from grassroots development to championship events.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building a global community of pool players, fans, and enthusiasts who share our passion for the sport.",
    },
    {
      icon: Star,
      title: "Innovation",
      description:
        "Continuously improving the tournament experience through technology, streaming, and player engagement.",
    },
  ]

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">ABOUT MAYEZ TOURNAMENT</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The premier pool tournament organization dedicated to promoting excellence, fair play, and the growth of
              professional pool worldwide.
            </p>
          </div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-lg overflow-hidden mb-16"
          >
            <img
              src="https://images.pexels.com/photos/16074/pexels-photo.jpg"
              alt="Tournament Hall"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-xl text-gray-200 max-w-2xl">
                  To elevate the sport of pool through world-class tournaments, fostering competition, skill
                  development, and global community.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className="bg-gray-900 rounded-lg p-8 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Icon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Founded in 2018, Mayez Tournament Organization began with a simple vision: to create the most
                  professional, fair, and exciting pool tournaments in the world. What started as a small regional
                  competition has grown into a global phenomenon.
                </p>
                <p>
                  Our founders, passionate pool players themselves, recognized the need for tournaments that truly
                  celebrated the skill, strategy, and artistry of the game. They set out to create events that would not
                  only crown champions but also inspire the next generation of players.
                </p>
                <p>
                  Today, we organize tournaments across multiple continents, featuring the world's best players
                  competing for substantial prize pools. Our commitment to excellence has made us the premier choice for
                  professional pool competition.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1599685315659-bc876da49fe5"
                alt="Pool Tournament"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
            </div>
          </motion.div>

          {/* Our Values */}
          <div className="mb-16">
            <motion.h2
              className="text-3xl font-bold text-white text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Values
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    className="bg-gray-800 rounded-lg p-6 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Icon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <motion.h2
              className="text-3xl font-bold text-white text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Meet Our Team
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-red-500 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-lg p-8"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">Get In Touch</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Headquarters</h3>
                <p className="text-gray-400">
                  123 Tournament Avenue
                  <br />
                  Las Vegas, NV 89101
                  <br />
                  United States
                </p>
              </div>

              <div className="text-center">
                <Users className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Contact Us</h3>
                <p className="text-gray-400">
                  Email: info@mayeztournament.com
                  <br />
                  Phone: +1 (555) 123-4567
                  <br />
                  Fax: +1 (555) 123-4568
                </p>
              </div>

              <div className="text-center">
                <Globe className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Follow Us</h3>
                <p className="text-gray-400">
                  @MayezTournament
                  <br />
                  Facebook | Twitter | Instagram
                  <br />
                  YouTube | LinkedIn
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
