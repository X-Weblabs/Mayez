"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Book, ChevronDown, ChevronRight, AlertCircle, CheckCircle } from "lucide-react"

const Rules = () => {
  const [expandedSection, setExpandedSection] = useState(null)

  const rulesSections = [
    {
      id: "general",
      title: "General Tournament Rules",
      icon: Book,
      rules: [
        "All players must register and pay entry fees before the tournament begins",
        "Players must arrive 30 minutes before their scheduled match time",
        "Proper attire is required: collared shirt, dress pants, and closed-toe shoes",
        "No alcohol or illegal substances are permitted during tournament play",
        "Unsportsmanlike conduct will result in immediate disqualification",
        "All decisions by tournament officials are final",
        "Players are responsible for their own equipment, though house cues are available",
      ],
    },
    {
      id: "8ball",
      title: "8-Ball Rules",
      icon: CheckCircle,
      rules: [
        "The game is played with 15 numbered balls (1-15) and a cue ball",
        "Players must call their group (solids 1-7 or stripes 9-15) after the break",
        "Players must pocket all balls in their group before attempting the 8-ball",
        "The 8-ball must be called (pocket and ball) before shooting",
        "Scratching while shooting the 8-ball results in an automatic loss",
        "Pocketing the 8-ball on the break wins the game instantly",
        "Jump shots and masse shots are allowed unless house rules prohibit them",
      ],
    },
    {
      id: "9ball",
      title: "9-Ball Rules",
      icon: CheckCircle,
      rules: [
        "The game is played with balls numbered 1-9 and a cue ball",
        "Players must hit the lowest numbered ball first on each shot",
        "Balls can be pocketed in any order as long as the lowest ball is hit first",
        "The player who pockets the 9-ball wins the game",
        "If the 9-ball is pocketed on the break, the player wins instantly",
        "Push-out rule applies after the break shot",
        "Three consecutive fouls result in an automatic loss",
      ],
    },
    {
      id: "straight",
      title: "Straight Pool Rules",
      icon: CheckCircle,
      rules: [
        "Games are played to a predetermined number of points (usually 150)",
        "Each ball pocketed legally counts as one point",
        "Players must call the ball and pocket for each shot",
        "When only one ball remains, 14 balls are re-racked",
        "The break shot must drive at least two balls to the rails",
        "Consecutive fouls result in point deductions",
        "Safety play is an important strategic element",
      ],
    },
    {
      id: "fouls",
      title: "Fouls and Penalties",
      icon: AlertCircle,
      rules: [
        "Scratching (cue ball in pocket) - opponent gets ball in hand",
        "Failure to hit any ball - opponent gets ball in hand",
        "Hitting the wrong ball first - opponent gets ball in hand",
        "Failure to drive a ball to a rail after contact - opponent gets ball in hand",
        "Double hit or push shot - opponent gets ball in hand",
        "Balls jumping off the table - opponent gets ball in hand",
        "Touching any ball with hands, clothing, or cue - opponent gets ball in hand",
      ],
    },
    {
      id: "equipment",
      title: "Equipment Standards",
      icon: Book,
      rules: [
        "Tables must be 9-foot regulation size with 6 pockets",
        "Balls must be regulation size and weight (2.25 inches diameter)",
        "Cues must be between 40-60 inches in length",
        "Chalk and mechanical bridges are provided",
        "Players may use their own cues and accessories",
        "Jump cues and break cues are permitted",
        "Electronic devices are prohibited during play",
      ],
    },
    {
      id: "conduct",
      title: "Player Conduct",
      icon: AlertCircle,
      rules: [
        "Respect opponents, officials, and spectators at all times",
        "No coaching or advice from spectators during matches",
        "Cell phones must be turned off or on silent mode",
        "Smoking is prohibited in the tournament area",
        "Players must shake hands before and after each match",
        "Disputes should be resolved through tournament officials",
        "Excessive celebration or taunting is not permitted",
      ],
    },
    {
      id: "scoring",
      title: "Scoring and Format",
      icon: CheckCircle,
      rules: [
        "Tournament format varies by event (single elimination, double elimination, round robin)",
        "Match length is predetermined (race to 7, race to 9, etc.)",
        "Lag for break determines who breaks first",
        "Alternating breaks in subsequent games unless otherwise specified",
        "Time limits may be enforced for shot selection",
        "Scorekeeping is the responsibility of both players",
        "Official scorers will be present for championship matches",
      ],
    },
  ]

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const RuleSection = ({ section, index }) => {
    const Icon = section.icon
    const isExpanded = expandedSection === section.id

    return (
      <motion.div
        className="bg-gray-800 rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center">
            <Icon
              className={`h-6 w-6 mr-4 ${
                section.id === "fouls" || section.id === "conduct" ? "text-red-500" : "text-blue-500"
              }`}
            />
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <div className="space-y-3">
              {section.rules.map((rule, ruleIndex) => (
                <motion.div
                  key={ruleIndex}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ruleIndex * 0.1 }}
                >
                  <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-300 leading-relaxed">{rule}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">TOURNAMENT RULES</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Official rules and regulations for all Mayez Tournament events. Please read carefully before
              participating.
            </p>
          </div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-red-600/20 border border-red-600 rounded-lg p-6 mb-8"
          >
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-semibold mb-2">Important Notice</h3>
                <p className="text-red-300">
                  All players are required to read and understand these rules before participating in any tournament.
                  Ignorance of the rules is not an acceptable excuse for violations. Tournament directors have the final
                  authority on all rule interpretations and decisions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Rules Sections */}
          <div className="space-y-4">
            {rulesSections.map((section, index) => (
              <RuleSection key={section.id} section={section} index={index} />
            ))}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900 rounded-lg p-8 mt-12 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Questions About the Rules?</h3>
            <p className="text-gray-400 mb-6">
              If you have any questions about tournament rules or need clarification on specific situations, please
              contact our tournament officials.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div>
                <h4 className="text-white font-semibold">Tournament Director</h4>
                <p className="text-gray-400">director@mayeztournament.com</p>
              </div>
              <div>
                <h4 className="text-white font-semibold">Rules Committee</h4>
                <p className="text-gray-400">rules@mayeztournament.com</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Rules
