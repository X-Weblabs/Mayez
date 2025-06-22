  "use client"

  import { useState, useEffect } from "react"
  import { motion } from "framer-motion"
  import {
    Plus,
    Edit,
    Trash2,
    Users,
    Trophy,
    Calendar,
    DollarSign,
    Play,
    Pause,
    Shuffle,
    Target,
    Crown,
    Zap,
    BarChart3,
    Clock,
    Grid,
    List,
    Search,
    User,
    RefreshCw,
    Database,
    CheckCircle,
  } from "lucide-react"
  import { collection, addDoc, updateDoc, doc, onSnapshot, getDocs, writeBatch } from "firebase/firestore"
  import { db } from "../firebase/config"
  import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets"

  const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("tournaments")
    const [tournaments, setTournaments] = useState([])
    const [matches, setMatches] = useState([])
    const [users, setUsers] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    // Advanced tournament management states
    const [selectedTournament, setSelectedTournament] = useState(null)
    const [showBracketModal, setShowBracketModal] = useState(false)
    const [bracketType, setBracketType] = useState("single-elimination")
    const [tournamentBracket, setTournamentBracket] = useState([])
    const [liveMatches, setLiveMatches] = useState([])
    const [showDataMigration, setShowDataMigration] = useState(false)
    const [tournamentSettings, setTournamentSettings] = useState({
      autoAdvance: true,
      allowTies: false,
      matchFormat: "race-to-7",
      seedingMethod: "random",
      checkInRequired: false,
      streamingEnabled: false,
    })

    // Real-time listeners
    useEffect(() => {
      const unsubscribeTournaments = onSnapshot(collection(db, "tournaments"), (snapshot) => {
        const tournamentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setTournaments(tournamentsData)
      })

      const unsubscribeMatches = onSnapshot(collection(db, "matches"), (snapshot) => {
        const matchesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setMatches(matchesData)
        setLiveMatches(matchesData.filter((match) => match.status === "live"))
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
      { id: "brackets", name: "Bracket Manager", icon: Target },
      { id: "live", name: "Live Control", icon: Zap },
      { id: "matches", name: "Match Center", icon: Play },
      { id: "users", name: "Users", icon: Users },
      { id: "analytics", name: "Analytics", icon: BarChart3 },
      // { id: "migration", name: "Data Migration", icon: Database },
    ]

    // Convert tournament bracket data to react-brackets format
    const convertToReactBracketsFormat = (tournamentBracket, tournamentMatches) => {
      if (!tournamentBracket || tournamentBracket.length === 0) return []

      return tournamentBracket.map((round) => ({
        title: round.name,
        seeds: round.matches.map((match) => {
          const firestoreMatch = tournamentMatches.find((m) => m.customId === match.id)
          return {
            id: match.id,
            date: firestoreMatch?.startTime?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString(),
            teams: [
              {
                name: match.player1?.name || "TBD",
                score: firestoreMatch?.score?.player1 || match.score?.player1 || 0,
              },
              {
                name: match.player2?.name || "TBD",
                score: firestoreMatch?.score?.player2 || match.score?.player2 || 0,
              },
            ],
            winner: firestoreMatch?.winner || match.winner,
            status: firestoreMatch?.status || match.status || "pending",
            firestoreId: firestoreMatch?.id,
          }
        }),
      }))
    }

    // Custom Seed component for react-brackets
    const CustomSeed = ({ seed, breakpoint, roundIndex, seedIndex }) => {
      const isWinner = (teamIndex) => {
        if (!seed.winner) return false
        return seed.teams[teamIndex]?.name === seed.winner?.name
      }

      const getStatusColor = () => {
        switch (seed.status) {
          case "live":
            return "border-red-500 bg-red-500/10"
          case "completed":
            return "border-green-500 bg-green-500/10"
          case "ready":
            return "border-blue-500 bg-blue-500/10"
          default:
            return "border-gray-600 bg-gray-800"
        }
      }

      const updateMatchScore = async (firestoreId, scoreData) => {
        try {
          await updateDoc(doc(db, "matches", firestoreId), {
            ...scoreData,
            lastUpdated: new Date(),
          })
        } catch (error) {
          console.error("Error updating match:", error)
          alert("Failed to update match: " + error.message)
        }
      }

      return (
        <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
          <SeedItem>
            <div className={`p-3 rounded-lg border-2 ${getStatusColor()} min-w-[200px]`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Match {seed.id}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    seed.status === "live"
                      ? "bg-red-600"
                      : seed.status === "completed"
                        ? "bg-green-600"
                        : seed.status === "ready"
                          ? "bg-blue-600"
                          : "bg-gray-600"
                  } text-white`}
                >
                  {seed.status?.toUpperCase() || "PENDING"}
                </span>
              </div>

              <div className="space-y-1">
                {seed.teams.map((team, teamIndex) => (
                  <SeedTeam key={teamIndex} style={{ fontSize: 11 }}>
                    <div
                      className={`flex justify-between items-center p-2 rounded ${
                        isWinner(teamIndex) ? "bg-green-600/20 border border-green-500" : "bg-gray-700"
                      }`}
                    >
                      <span className="text-white font-medium">{team.name}</span>
                      <span className="text-white font-bold">{team.score}</span>
                    </div>
                  </SeedTeam>
                ))}
              </div>

              {seed.status === "live" && seed.firestoreId && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  <button
                    onClick={() =>
                      updateMatchScore(seed.firestoreId, {
                        score: {
                          player1: (seed.teams[0]?.score || 0) + 1,
                          player2: seed.teams[1]?.score || 0,
                        },
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
                  >
                    +1 {seed.teams[0]?.name}
                  </button>
                  <button
                    onClick={() =>
                      updateMatchScore(seed.firestoreId, {
                        score: {
                          player1: seed.teams[0]?.score || 0,
                          player2: (seed.teams[1]?.score || 0) + 1,
                        },
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
                  >
                    +1 {seed.teams[1]?.name}
                  </button>
                </div>
              )}

              {seed.teams[0]?.name !== "TBD" && seed.teams[1]?.name !== "TBD" && seed.firestoreId && (
                <div className="mt-2 flex space-x-1">
                  {seed.status === "ready" && (
                    <button
                      onClick={() => updateMatchScore(seed.firestoreId, { status: "live", startTime: new Date() })}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded text-xs"
                    >
                      Start
                    </button>
                  )}

                  {seed.status === "live" && (
                    <>
                      <button
                        onClick={() => updateMatchScore(seed.firestoreId, { status: "paused" })}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-1 rounded text-xs"
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => {
                          const winner =
                            (seed.teams[0]?.score || 0) > (seed.teams[1]?.score || 0) ? seed.teams[0] : seed.teams[1]
                          updateMatchScore(seed.firestoreId, {
                            status: "completed",
                            winner: { name: winner.name },
                            endTime: new Date(),
                          })
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-xs"
                      >
                        Finish
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </SeedItem>
        </Seed>
      )
    }

    // Data Migration Helper with improved sample data
    const DataMigration = () => {
      const [migrationStatus, setMigrationStatus] = useState("")
      const [isLoading, setIsLoading] = useState(false)

      const addSampleData = async () => {
        setIsLoading(true)
        setMigrationStatus("Adding sample data...")

        try {
          const batch = writeBatch(db)

          // Add sample users with proper structure
          const sampleUsers = [
            {
              firstName: "Steven",
              lastName: "Paswani",
              email: "steven@example.com",
              skillLevel: "proffesional",
              ranking: 950,
              wins: 12,
              losses: 3,
              profileImage: null,
              createdAt: new Date(),
              isAdmin: false,
            },
            {
              firstName: "Clemence",
              lastName: "Gutsa",
              email: "guta@example.com",
              skillLevel: "intermediate",
              ranking: 750,
              wins: 10,
              losses: 5,
              profileImage: null,
              createdAt: new Date(),
              isAdmin: false,
            },
            {
              firstName: "Stanley",
              lastName: "Ngwenya",
              email: "stanley@example.com",
              skillLevel: "intermediate",
              ranking: 650,
              wins: 10,
              losses: 7,
              profileImage: null,
              createdAt: new Date(),
              isAdmin: false,
            },
            {
              firstName: "Lindani",
              lastName: "Gumbo",
              email: "lindani@example.com",
              skillLevel: "intermediate",
              ranking: 550,
              wins: 11,
              losses: 9,
              profileImage: null,
              createdAt: new Date(),
              isAdmin: false,
            },
            {
              firstName: "Craig",
              lastName: "Nkala",
              email: "craig@example.com",
              skillLevel: "intermediate",
              ranking: 550,
              wins: 11,
              losses: 9,
              profileImage: null,
              createdAt: new Date(),
              isAdmin: false,
            },
            {
              firstName: "Norman",
              lastName: "Moyo",
              email: "norman@example.com",
              skillLevel: "intermediate",
              ranking: 550,
              wins: 11,
              losses: 9,
              profileImage: null,
              createdAt: new Date(),
              isAdmin: false,
            },
            // {
            //   firstName: "Admin",
            //   lastName: "User",
            //   email: "admin@gmail.com",
            //   skillLevel: "proffesional",
            //   ranking: 550,
            //   wins: 11,
            //   losses: 9,
            //   profileImage: null,
            //   createdAt: new Date(),
            //   isAdmin: true,
            // },
          ]

          // Add users to batch
          const userRefs = []
          for (const user of sampleUsers) {
            const userRef = doc(collection(db, "users"))
            batch.set(userRef, user)
            userRefs.push({ id: userRef.id, ...user })
          }

          // Create sample tournament with participants - READY FOR BRACKET GENERATION
          const sampleTournament = {
            title: "Spring Championship 2024",
            type: "Championship",
            date: "2024-03-15",
            location: "Bulawayo Pool Hall",
            prize: "1000",
            entryFee: "25",
            maxParticipants: "16",
            description: "Annual spring championship tournament featuring the best players in the region.",
            status: "upcoming", // Changed from "registration" to "upcoming" so bracket can be generated
            image: "",
            bracketType: "double-elimination",
            checkInDeadline: "2024-03-15T09:00",
            streamUrl: "",
            rules: "Standard 8-ball rules apply. Race to 5 format.",
            createdAt: new Date(),
            participants: userRefs.slice(0, 5).map((user, index) => ({
              userId: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              profileImage: user.profileImage,
              registeredAt: new Date(),
              seed: index + 1,
              ranking: user.ranking,
              skillLevel: user.skillLevel,
            })),
            bracket: [],
            bracketGenerated: false,
            settings: tournamentSettings,
          }

          const tournamentRef = doc(collection(db, "tournaments"))
          batch.set(tournamentRef, sampleTournament)

          await batch.commit()
          setMigrationStatus("✅ Sample data added successfully! Go to Tournament Management to generate brackets.")
        } catch (error) {
          console.error("Error adding sample data:", error)
          setMigrationStatus("❌ Error adding sample data: " + error.message)
        } finally {
          setIsLoading(false)
        }
      }

      const clearAllData = async () => {
        if (!window.confirm("Are you sure you want to clear ALL data? This cannot be undone!")) {
          return
        }

        setIsLoading(true)
        setMigrationStatus("Clearing all data...")

        try {
          const batch = writeBatch(db)

          // Get all documents
          const [tournamentsSnapshot, matchesSnapshot, usersSnapshot] = await Promise.all([
            getDocs(collection(db, "tournaments")),
            getDocs(collection(db, "matches")),
            // getDocs(collection(db, "users")),
          ])

          // Add deletions to batch
          tournamentsSnapshot.docs.forEach((doc) => batch.delete(doc.ref))
          matchesSnapshot.docs.forEach((doc) => batch.delete(doc.ref))
          // usersSnapshot.docs.forEach((doc) => batch.delete(doc.ref))

          await batch.commit()
          setMigrationStatus("✅ All data cleared successfully!")
        } catch (error) {
          console.error("Error clearing data:", error)
          setMigrationStatus("❌ Error clearing data: " + error.message)
        } finally {
          setIsLoading(false)
        }
      }

      const fixExistingData = async () => {
        setIsLoading(true)
        setMigrationStatus("Fixing existing tournament data...")

        try {
          const batch = writeBatch(db)

          tournaments.forEach((tournament) => {
            const tournamentRef = doc(db, "tournaments", tournament.id)
            const updates = {
              bracketGenerated: tournament.bracketGenerated || false,
              bracket: tournament.bracket || [],
              settings: tournament.settings || tournamentSettings,
              participants: tournament.participants || [],
            }

            // Fix participants structure if needed
            if (tournament.participants && tournament.participants.length > 0) {
              updates.participants = tournament.participants.map((participant, index) => ({
                userId: participant.userId || participant.id || `user-${index}`,
                name: participant.name || `${participant.firstName || "Player"} ${participant.lastName || index + 1}`,
                email: participant.email || `player${index + 1}@example.com`,
                profileImage: participant.profileImage || participant.avatar || null,
                registeredAt: participant.registeredAt || new Date(),
                seed: participant.seed || index + 1,
                ranking: participant.ranking || 1000,
                skillLevel: participant.skillLevel || "beginner",
              }))
            }

            batch.update(tournamentRef, updates)
          })

          await batch.commit()
          setMigrationStatus("✅ Existing data fixed successfully!")
        } catch (error) {
          console.error("Error fixing data:", error)
          setMigrationStatus("❌ Error fixing data: " + error.message)
        } finally {
          setIsLoading(false)
        }
      }

      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Data Migration & Setup</h2>

          <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <h3 className="text-blue-400 font-medium">How the Tournament System Works</h3>
                <div className="text-blue-300 text-sm mt-1 space-y-1">
                  <p>
                    1. <strong>Add Sample Data</strong> → Creates tournaments with participants
                  </p>
                  <p>
                    2. <strong>Go to Tournament Management</strong> → Click "Bracket" button on tournament
                  </p>
                  <p>
                    3. <strong>Generate Bracket</strong> → Creates matches and enables bracket manager
                  </p>
                  <p>
                    4. <strong>Start Tournament</strong> → Makes it live for match management
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Add Sample Data</h3>
              <p className="text-gray-400 text-sm mb-4">
                Add sample tournaments, users, and matches to test the advanced features.
              </p>
              <button
                onClick={addSampleData}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Sample Data
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Fix Existing Data</h3>
              <p className="text-gray-400 text-sm mb-4">
                Update existing tournaments to work with the new bracket system.
              </p>
              <button
                onClick={fixExistingData}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Fix Existing Data
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Clear All Data</h3>
              <p className="text-gray-400 text-sm mb-4">Remove all tournaments, matches, and users from the database.</p>
              <button
                onClick={clearAllData}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Clear All Data
              </button>
            </div>
          </div>

          {migrationStatus && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Migration Status:</h4>
              <p className="text-gray-300">{migrationStatus}</p>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Current Database Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Tournaments:</span>
                <span className="text-white ml-2">{tournaments.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Users:</span>
                <span className="text-white ml-2">{users.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Matches:</span>
                <span className="text-white ml-2">{matches.length}</span>
              </div>
              <div>
                <span className="text-gray-400">With Brackets:</span>
                <span className="text-white ml-2 font-bold text-green-400">
                  {tournaments.filter((t) => t.bracketGenerated).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Enhanced Bracket Generation with better error handling and logging
    const generateBracket = async (tournament, type = "single-elimination") => {
      if (!tournament.participants || tournament.participants.length < 2) {
        alert("Need at least 2 participants to generate bracket")
        return
      }

      console.log("🎯 Generating bracket for:", tournament.title)
      console.log("📊 Participants:", tournament.participants.length)
      console.log("🏆 Bracket type:", type)

      try {
        let bracket = []
        const participants = [...tournament.participants]

        // Seeding logic
        if (tournamentSettings.seedingMethod === "random") {
          participants.sort(() => Math.random() - 0.5)
        } else if (tournamentSettings.seedingMethod === "ranking") {
          participants.sort((a, b) => (a.ranking || 1000) - (b.ranking || 1000))
        }

        if (type === "single-elimination") {
          bracket = generateSingleElimination(participants)
        } else if (type === "double-elimination") {
          bracket = generateDoubleElimination(participants)
        } else if (type === "round-robin") {
          bracket = generateRoundRobin(participants)
        }

        console.log("🔧 Generated bracket structure:", bracket)

        // Create actual match documents in Firestore
        const batch = writeBatch(db)
        const allMatches = bracket.flatMap((round) => round.matches)
        const matchDocuments = [] // Store the actual Firestore document references

        console.log("📝 Creating", allMatches.length, "match documents...")

        for (const match of allMatches) {
          const matchRef = doc(collection(db, "matches"))
          const matchData = {
            customId: match.id, // Store the custom ID separately
            player1: match.player1,
            player2: match.player2,
            winner: match.winner,
            score: match.score,
            status: match.status,
            round: match.round,
            table: match.table,
            startTime: match.startTime,
            endTime: match.endTime,
            tournamentId: tournament.id,
            tournamentTitle: tournament.title,
            createdAt: new Date(),
            lastUpdated: new Date(),
          }
          batch.set(matchRef, matchData)

          // Update the match object with the Firestore document ID
          match.firestoreId = matchRef.id
          matchDocuments.push({ ...match, firestoreId: matchRef.id })

          console.log("➕ Adding match:", match.id, "with Firestore ID:", matchRef.id)
        }

        // Update tournament with bracket
        const tournamentRef = doc(db, "tournaments", tournament.id)
        batch.update(tournamentRef, {
          bracket: bracket,
          bracketType: type,
          bracketGenerated: true,
          bracketGeneratedAt: new Date(),
          status: "upcoming", // Keep as upcoming until manually started
          settings: tournamentSettings,
        })

        await batch.commit()
        setTournamentBracket(bracket)

        console.log("✅ Bracket generated successfully!")
        console.log("🎮 Tournament updated with bracket data")

        alert(
          `✅ Bracket generated successfully!\n\n📊 Created ${allMatches.length} matches\n🏆 Tournament: ${tournament.title}\n\n➡️ Go to Bracket Manager to view\n➡️ Click "Start" to make tournament live`,
        )
      } catch (error) {
        console.error("❌ Error generating bracket:", error)
        alert("Failed to generate bracket: " + error.message)
      }
    }

    const generateSingleElimination = (participants) => {
      const rounds = []
      let currentPlayers = [...participants]
      let roundNumber = 1

      // Ensure power of 2 by adding byes
      while (currentPlayers.length & (currentPlayers.length - 1)) {
        currentPlayers.push({ id: `bye-${Date.now()}`, name: "BYE", isBye: true })
      }

      while (currentPlayers.length > 1) {
        const matches = []
        for (let i = 0; i < currentPlayers.length; i += 2) {
          const match = {
            id: `r${roundNumber}-m${Math.floor(i / 2) + 1}`,
            player1: currentPlayers[i],
            player2: currentPlayers[i + 1],
            winner: null,
            score: { player1: 0, player2: 0 },
            status: roundNumber === 1 ? "ready" : "pending",
            round: roundNumber,
            table: null,
            startTime: null,
            endTime: null,
          }

          // Auto-advance BYE matches
          if (match.player1?.isBye) {
            match.winner = match.player2
            match.status = "completed"
          } else if (match.player2?.isBye) {
            match.winner = match.player1
            match.status = "completed"
          }

          matches.push(match)
        }

        rounds.push({
          round: roundNumber,
          name: getRoundName(roundNumber, Math.log2(currentPlayers.length)),
          matches,
          status: roundNumber === 1 ? "active" : "pending",
        })

        currentPlayers = matches.map((match) => match.winner).filter(Boolean)
        roundNumber++
      }

      return rounds
    }

    const generateDoubleElimination = (participants) => {
      // Winner's bracket
      const winnersBracket = generateSingleElimination(participants)

      // Loser's bracket (simplified)
      const losersBracket = []
      const losersRounds = Math.ceil(Math.log2(participants.length)) * 2 - 1

      for (let i = 1; i <= losersRounds; i++) {
        losersBracket.push({
          round: i,
          name: `Loser's Round ${i}`,
          matches: [],
          status: "pending",
          bracket: "losers",
        })
      }

      return [
        ...winnersBracket.map((round) => ({ ...round, bracket: "winners" })),
        ...losersBracket,
        {
          round: winnersBracket.length + losersBracket.length + 1,
          name: "Grand Finals",
          matches: [
            {
              id: "grand-final",
              player1: null,
              player2: null,
              winner: null,
              score: { player1: 0, player2: 0 },
              status: "pending",
            },
          ],
          status: "pending",
          bracket: "finals",
        },
      ]
    }

    const generateRoundRobin = (participants) => {
      const rounds = []
      const players = [...participants]
      const totalRounds = players.length - 1

      for (let round = 1; round <= totalRounds; round++) {
        const matches = []

        for (let i = 0; i < Math.floor(players.length / 2); i++) {
          const player1 = players[i]
          const player2 = players[players.length - 1 - i]

          if (player1 && player2 && player1.id !== player2.id) {
            matches.push({
              id: `rr-r${round}-m${i + 1}`,
              player1,
              player2,
              winner: null,
              score: { player1: 0, player2: 0 },
              status: "ready",
              round,
            })
          }
        }

        rounds.push({
          round,
          name: `Round ${round}`,
          matches,
          status: round === 1 ? "active" : "pending",
        })

        // Rotate players
        if (round < totalRounds) {
          const last = players.pop()
          players.splice(1, 0, last)
        }
      }

      return rounds
    }

    const getRoundName = (round, totalRounds) => {
      const remaining = totalRounds - round + 1
      if (remaining === 1) return "Finals"
      if (remaining === 2) return "Semi-Finals"
      if (remaining === 3) return "Quarter-Finals"
      if (remaining === 4) return "Round of 16"
      return `Round ${round}`
    }

    // Enhanced Tournament Manager with better status indicators
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
        bracketType: "single-elimination",
        checkInDeadline: "",
        streamUrl: "",
        rules: "",
      })

      const [viewMode, setViewMode] = useState("grid")
      const [filterStatus, setFilterStatus] = useState("all")
      const [searchTerm, setSearchTerm] = useState("")

      const filteredTournaments = tournaments.filter((tournament) => {
        const matchesSearch =
          tournament.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tournament.location?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === "all" || tournament.status === filterStatus
        return matchesSearch && matchesFilter
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
              bracket: [],
              bracketGenerated: false,
              settings: tournamentSettings,
            })
          }
          setShowCreateModal(false)
          setEditingItem(null)
          resetForm()
        } catch (error) {
          console.error("Error saving tournament:", error)
        }
      }

      const resetForm = () => {
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
          bracketType: "single-elimination",
          checkInDeadline: "",
          streamUrl: "",
          rules: "",
        })
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
          bracketType: tournament.bracketType || "single-elimination",
          checkInDeadline: tournament.checkInDeadline || "",
          streamUrl: tournament.streamUrl || "",
          rules: tournament.rules || "",
        })
        setShowCreateModal(true)
      }

      const handleDelete = async (tournamentId) => {
        if (window.confirm("Are you sure you want to delete this tournament?")) {
          try {
            // Also delete associated matches
            const tournamentMatches = matches.filter((match) => match.tournamentId === tournamentId)
            const batch = writeBatch(db)

            // Delete tournament
            batch.delete(doc(db, "tournaments", tournamentId))

            // Delete associated matches
            tournamentMatches.forEach((match) => {
              batch.delete(doc(db, "matches", match.id))
            })

            await batch.commit()
          } catch (error) {
            console.error("Error deleting tournament:", error)
          }
        }
      }

      const startTournament = async (tournament) => {
        if (!tournament.bracketGenerated) {
          if (window.confirm("No bracket generated. Generate bracket and start tournament?")) {
            await generateBracket(tournament, tournament.bracketType || "single-elimination")
          }
        } else {
          await updateDoc(doc(db, "tournaments", tournament.id), {
            status: "live",
            startedAt: new Date(),
          })
          alert("🔴 Tournament is now LIVE! Go to Live Control to manage matches.")
        }
      }

      const addSampleParticipants = async (tournamentId) => {
        const availableUsers = users.filter(
          (user) => !tournaments.find((t) => t.id === tournamentId)?.participants?.some((p) => p.userId === user.id),
        )

        if (availableUsers.length === 0) {
          alert("No available users to add as participants")
          return
        }

        const participantsToAdd = availableUsers.slice(0, 8).map((user, index) => ({
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          profileImage: user.profileImage,
          registeredAt: new Date(),
          seed: index + 1,
          ranking: user.ranking || 1000,
          skillLevel: user.skillLevel || "beginner",
        }))

        try {
          const tournament = tournaments.find((t) => t.id === tournamentId)
          await updateDoc(doc(db, "tournaments", tournamentId), {
            participants: [...(tournament.participants || []), ...participantsToAdd],
          })
          alert(`Added ${participantsToAdd.length} participants to tournament`)
        } catch (error) {
          console.error("Error adding participants:", error)
          alert("Failed to add participants")
        }
      }

      const TournamentCard = ({ tournament }) => (
        <motion.div
          key={tournament.id}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{tournament.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {tournament.date}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {tournament.participants?.length || 0}/{tournament.maxParticipants}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tournament.status === "live"
                    ? "bg-red-600 text-white"
                    : tournament.status === "upcoming"
                      ? "bg-blue-600 text-white"
                      : tournament.status === "registration"
                        ? "bg-green-600 text-white"
                        : "bg-gray-600 text-white"
                }`}
              >
                {tournament.status.toUpperCase()}
              </span>

              {tournament.bracketGenerated && (
                <span className="px-2 py-1 rounded text-xs bg-purple-600 text-white flex items-center">
                  <Target className="h-3 w-3 mr-1" />
                  BRACKET READY
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-300 mb-4">
            <div className="flex justify-between">
              <span>Entry Fee:</span>
              <span className="text-green-400">${tournament.entryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Prize Pool:</span>
              <span className="text-yellow-400">${tournament.prize}</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span>{tournament.bracketType || "Single Elimination"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleEdit(tournament)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>

            {tournament.participants?.length === 0 && (
              <button
                onClick={() => addSampleParticipants(tournament.id)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
              >
                <Users className="h-4 w-4 mr-1" />
                Add Players
              </button>
            )}

            {!tournament.bracketGenerated && tournament.participants?.length >= 2 && (
              <button
                onClick={() => {
                  setSelectedTournament(tournament)
                  setShowBracketModal(true)
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
              >
                <Target className="h-4 w-4 mr-1" />
                Generate Bracket
              </button>
            )}

            {tournament.bracketGenerated && tournament.status !== "live" && (
              <button
                onClick={() => startTournament(tournament)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
              >
                <Play className="h-4 w-4 mr-1" />
                Start Tournament
              </button>
            )}

            {tournament.status === "live" && (
              <button
                onClick={() => {
                  setSelectedTournament(tournament)
                  setActiveTab("live")
                }}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
              >
                <Zap className="h-4 w-4 mr-1" />
                Manage Live
              </button>
            )}

            <button
              onClick={() => handleDelete(tournament.id)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Tournament Management</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-red-600" : "bg-gray-700"}`}
                >
                  <Grid className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-red-600" : "bg-gray-700"}`}
                >
                  <List className="h-4 w-4 text-white" />
                </button>
              </div>

              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Tournament
              </motion.button>
            </div>
          </div>

          {/* Quick Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{tournaments.length}</div>
              <div className="text-gray-400 text-sm">Total Tournaments</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">
                {tournaments.filter((t) => t.bracketGenerated).length}
              </div>
              <div className="text-gray-400 text-sm">With Brackets</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">
                {tournaments.filter((t) => t.status === "live").length}
              </div>
              <div className="text-gray-400 text-sm">Live Now</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{matches.length}</div>
              <div className="text-gray-400 text-sm">Total Matches</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap gap-4 items-center bg-gray-800 p-4 rounded-lg">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="registration">Registration</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Tournament Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>

          {filteredTournaments.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No tournaments found</p>
              {tournaments.length === 0 && (
                <p className="text-gray-500 text-sm mt-2">
                  Create your first tournament or use the Data Migration tab to add sample data
                </p>
              )}
            </div>
          )}

          {/* Create/Edit Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingItem ? "Edit Tournament" : "Create Tournament"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Tournament Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Type (e.g., Championship)"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Prize Pool"
                      value={formData.prize}
                      onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Entry Fee"
                      value={formData.entryFee}
                      onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Max Participants"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={formData.bracketType}
                      onChange={(e) => setFormData({ ...formData, bracketType: e.target.value })}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="single-elimination">Single Elimination</option>
                      <option value="double-elimination">Double Elimination</option>
                      <option value="round-robin">Round Robin</option>
                    </select>

                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="registration">Registration Open</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Tournament Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white h-24"
                    required
                  />

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false)
                        setEditingItem(null)
                        resetForm()
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      {editingItem ? "Update Tournament" : "Create Tournament"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Bracket Generation Modal */}
          {showBracketModal && selectedTournament && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h3 className="text-xl font-bold text-white mb-6">Generate Bracket: {selectedTournament.title}</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bracket Type</label>
                    <select
                      value={bracketType}
                      onChange={(e) => setBracketType(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="single-elimination">Single Elimination</option>
                      <option value="double-elimination">Double Elimination</option>
                      <option value="round-robin">Round Robin</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Seeding Method</label>
                      <select
                        value={tournamentSettings.seedingMethod}
                        onChange={(e) =>
                          setTournamentSettings({
                            ...tournamentSettings,
                            seedingMethod: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      >
                        <option value="random">Random</option>
                        <option value="ranking">By Ranking</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Match Format</label>
                      <select
                        value={tournamentSettings.matchFormat}
                        onChange={(e) =>
                          setTournamentSettings({
                            ...tournamentSettings,
                            matchFormat: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      >
                        <option value="race-to-5">Race to 5</option>
                        <option value="race-to-7">Race to 7</option>
                        <option value="race-to-9">Race to 9</option>
                        <option value="race-to-11">Race to 11</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Tournament Info</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Participants: {selectedTournament.participants?.length || 0}</p>
                      <p>
                        Estimated Matches:{" "}
                        {calculateEstimatedMatches(selectedTournament.participants?.length || 0, bracketType)}
                      </p>
                      <p>
                        Estimated Duration:{" "}
                        {calculateEstimatedDuration(selectedTournament.participants?.length || 0, bracketType)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setShowBracketModal(false)
                        setSelectedTournament(null)
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        generateBracket(selectedTournament, bracketType)
                        setShowBracketModal(false)
                        setSelectedTournament(null)
                      }}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Generate Bracket
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )
    }

    // Helper functions
    const calculateEstimatedMatches = (participants, type) => {
      if (type === "single-elimination") return participants - 1
      if (type === "double-elimination") return (participants - 1) * 2 - 1
      if (type === "round-robin") return (participants * (participants - 1)) / 2
      return participants - 1
    }

    const calculateEstimatedDuration = (participants, type) => {
      const matchDuration = 30 // minutes
      const matches = calculateEstimatedMatches(participants, type)
      const totalMinutes = matches * matchDuration
      const hours = Math.floor(totalMinutes / 60)
      return `${hours}h ${totalMinutes % 60}m`
    }

    // Enhanced Bracket Manager with react-brackets integration
    const BracketManager = () => {
      const [selectedBracketTournament, setSelectedBracketTournament] = useState(null)

      const liveTournaments = (tournaments ?? []).filter((t) => t.bracketGenerated)

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Bracket Manager</h2>
            <select
              value={selectedBracketTournament?.id || ""}
              onChange={(e) => {
                const tournament = liveTournaments.find((t) => t.id === e.target.value)
                setSelectedBracketTournament(tournament)
              }}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="">Select Tournament</option>
              {liveTournaments.map((tournament) => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Overview */}
          <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <h3 className="text-blue-400 font-medium">Visual Bracket Manager</h3>
                <p className="text-blue-300 text-sm mt-1">
                  {liveTournaments.length > 0
                    ? `${liveTournaments.length} tournament(s) with generated brackets available. Interactive bracket view with live scoring.`
                    : "No tournaments with generated brackets found. Generate a bracket in Tournament Management first."}
                </p>
              </div>
            </div>
          </div>

          {selectedBracketTournament ? (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">{selectedBracketTournament.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Participants:</span>
                    <span className="text-white ml-2">{selectedBracketTournament.participants?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white ml-2">{selectedBracketTournament.bracketType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400 ml-2">{selectedBracketTournament.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Matches:</span>
                    <span className="text-white ml-2">
                      {matches.filter((m) => m.tournamentId === selectedBracketTournament.id).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Bracket Display using react-brackets */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-4">Tournament Bracket</h4>
                <div className="overflow-x-auto">
                  <Bracket
                    rounds={convertToReactBracketsFormat(
                      selectedBracketTournament.bracket,
                      matches.filter((m) => m.tournamentId === selectedBracketTournament.id),
                    )}
                    renderSeedComponent={CustomSeed}
                    mobileBreakpoint={768}
                    swipeableProps={{
                      enableMouseEvents: true,
                      animateHeight: true,
                    }}
                  />
                </div>
              </div>

              {/* Tournament Progress */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-4">Tournament Progress</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {
                        matches.filter((m) => m.tournamentId === selectedBracketTournament.id && m.status === "ready")
                          .length
                      }
                    </div>
                    <div className="text-gray-400 text-sm">Ready</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {
                        matches.filter((m) => m.tournamentId === selectedBracketTournament.id && m.status === "live")
                          .length
                      }
                    </div>
                    <div className="text-gray-400 text-sm">Live</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {
                        matches.filter((m) => m.tournamentId === selectedBracketTournament.id && m.status === "completed")
                          .length
                      }
                    </div>
                    <div className="text-gray-400 text-sm">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">
                      {
                        matches.filter((m) => m.tournamentId === selectedBracketTournament.id && m.status === "pending")
                          .length
                      }
                    </div>
                    <div className="text-gray-400 text-sm">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a tournament to view its bracket</p>
              {liveTournaments.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    <strong>No tournaments with generated brackets found.</strong>
                  </p>
                  <p className="text-yellow-300 text-sm mt-2">
                    To see tournaments here:
                    <br />
                    1. Go to Tournament Management
                    <br />
                    2. Click "Generate Bracket" on a tournament
                    <br />
                    3. Return here to manage the bracket
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    // Enhanced Live Control
    const LiveControl = () => {
      const [selectedLiveTournament, setSelectedLiveTournament] = useState(null)
      const [controlView, setControlView] = useState("overview")

      const liveTournaments = tournaments.filter((t) => t.status === "live")

      const TournamentOverview = ({ tournament }) => {
        const tournamentMatches = matches.filter((m) => m.tournamentId === tournament.id)
        const totalMatches = tournamentMatches.length
        const completedMatches = tournamentMatches.filter((m) => m.status === "completed").length
        const liveMatches = tournamentMatches.filter((m) => m.status === "live").length
        const upcomingMatches = tournamentMatches.filter((m) => m.status === "ready").length

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-white">{totalMatches}</div>
                    <div className="text-gray-400 text-sm">Total Matches</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Play className="h-8 w-8 text-red-500" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-white">{liveMatches}</div>
                    <div className="text-gray-400 text-sm">Live Now</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-white">{upcomingMatches}</div>
                    <div className="text-gray-400 text-sm">Upcoming</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Crown className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-white">{completedMatches}</div>
                    <div className="text-gray-400 text-sm">Completed</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Tournament Progress</h4>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-red-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{completedMatches} completed</span>
                <span>{totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0}%</span>
              </div>
            </div>

            {liveMatches > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                  Live Matches
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tournamentMatches
                    .filter((m) => m.status === "live")
                    .map((match) => (
                      <div key={match.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="text-center mb-3">
                          <h5 className="text-white font-medium">
                            {match.player1?.name} vs {match.player2?.name}
                          </h5>
                        </div>
                        <div className="flex justify-center items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{match.score?.player1 || 0}</div>
                          </div>
                          <div className="text-gray-400">-</div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{match.score?.player2 || 0}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )
      }

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Zap className="h-8 w-8 mr-3 text-red-500" />
              Live Tournament Control
            </h2>
            <select
              value={selectedLiveTournament?.id || ""}
              onChange={(e) => {
                const tournament = liveTournaments.find((t) => t.id === e.target.value)
                setSelectedLiveTournament(tournament)
              }}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="">Select Live Tournament</option>
              {liveTournaments.map((tournament) => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Overview */}
          <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-red-400 font-medium">Live Control Status</h3>
                <p className="text-red-300 text-sm mt-1">
                  {liveTournaments.length > 0
                    ? `${liveTournaments.length} live tournament(s) available for management`
                    : "No live tournaments found. Start a tournament in Tournament Management first."}
                </p>
              </div>
            </div>
          </div>

          {selectedLiveTournament ? (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedLiveTournament.title}</h3>
                    <p className="text-gray-400">
                      {selectedLiveTournament.location} • {selectedLiveTournament.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-400 font-semibold">LIVE</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                {["overview", "bracket", "participants"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setControlView(view)}
                    className={`px-4 py-2 rounded-md transition-colors capitalize ${
                      controlView === view ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>

              {controlView === "overview" && <TournamentOverview tournament={selectedLiveTournament} />}

              {controlView === "bracket" && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Live Bracket</h4>
                  <div className="overflow-x-auto">
                    <Bracket
                      rounds={convertToReactBracketsFormat(
                        selectedLiveTournament.bracket,
                        matches.filter((m) => m.tournamentId === selectedLiveTournament.id),
                      )}
                      renderSeedComponent={CustomSeed}
                      mobileBreakpoint={768}
                      swipeableProps={{
                        enableMouseEvents: true,
                        animateHeight: true,
                      }}
                    />
                  </div>
                </div>
              )}

              {controlView === "participants" && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Participants</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedLiveTournament.participants?.map((participant, index) => (
                      <div key={participant.userId} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center">
                          {participant.profileImage ? (
                            <img
                              src={participant.profileImage || "/placeholder.svg"}
                              alt={participant.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-white font-medium">{participant.name}</div>
                            <div className="text-gray-400 text-sm">
                              Seed #{participant.seed} • {participant.skillLevel}
                            </div>
                            {participant.ranking && (
                              <div className="text-gray-500 text-xs">Ranking: {participant.ranking}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Zap className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No live tournaments at the moment</p>
              {liveTournaments.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    <strong>No live tournaments found.</strong>
                  </p>
                  <p className="text-yellow-300 text-sm mt-2">
                    To see tournaments here:
                    <br />
                    1. Go to Tournament Management
                    <br />
                    2. Generate a bracket for a tournament
                    <br />
                    3. Click "Start Tournament" to make it live
                    <br />
                    4. Return here to manage live matches
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    // Enhanced Match Manager (removed "New Match" button as requested)
    const MatchManager = () => {
      const [matchFilter, setMatchFilter] = useState("all")
      const [selectedTournamentFilter, setSelectedTournamentFilter] = useState("all")

      const filteredMatches = matches.filter((match) => {
        const statusMatch = matchFilter === "all" || match.status === matchFilter
        const tournamentMatch = selectedTournamentFilter === "all" || match.tournamentId === selectedTournamentFilter
        return statusMatch && tournamentMatch
      })

      const updateMatchScore = async (firestoreId, scoreData) => {
        try {
          await updateDoc(doc(db, "matches", firestoreId), {
            ...scoreData,
            lastUpdated: new Date(),
          })
        } catch (error) {
          console.error("Error updating match:", error)
          alert("Failed to update match: " + error.message)
        }
      }

      const LiveMatchCard = ({ match }) => (
        <motion.div
          className={`bg-gray-800 rounded-lg p-6 border-l-4 ${
            match.status === "live"
              ? "border-red-500"
              : match.status === "completed"
                ? "border-green-500"
                : match.status === "ready"
                  ? "border-blue-500"
                  : "border-gray-600"
          }`}
          whileHover={{ y: -2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {match.player1?.name || "Player 1"} vs {match.player2?.name || "Player 2"}
              </h3>
              <p className="text-gray-400 text-sm">{match.tournamentTitle || "Tournament Match"}</p>
            </div>
            <div className="flex items-center space-x-2">
              {match.status === "live" && (
                <div className="flex items-center text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
                  <span className="text-xs font-semibold">LIVE</span>
                </div>
              )}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  match.status === "live"
                    ? "bg-red-600 text-white"
                    : match.status === "completed"
                      ? "bg-green-600 text-white"
                      : match.status === "ready"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white"
                }`}
              >
                {match.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{match.score?.player1 || 0}</div>
              <div className="text-sm text-gray-400">{match.player1?.name || "Player 1"}</div>
            </div>
            <div className="text-gray-400 text-xl">VS</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{match.score?.player2 || 0}</div>
              <div className="text-sm text-gray-400">{match.player2?.name || "Player 2"}</div>
            </div>
          </div>

          {match.status === "live" && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() =>
                  updateMatchScore(match.id, {
                    score: { ...match.score, player1: (match.score?.player1 || 0) + 1 },
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
              >
                +1 {match.player1?.name || "Player 1"}
              </button>
              <button
                onClick={() =>
                  updateMatchScore(match.id, {
                    score: { ...match.score, player2: (match.score?.player2 || 0) + 1 },
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
              >
                +1 {match.player2?.name || "Player 2"}
              </button>
            </div>
          )}

          <div className="flex justify-between space-x-2">
            {match.status === "ready" && (
              <button
                onClick={() =>
                  updateMatchScore(match.id, {
                    status: "live",
                    startTime: new Date(),
                  })
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm flex items-center justify-center"
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </button>
            )}

            {match.status === "live" && (
              <>
                <button
                  onClick={() => updateMatchScore(match.id, { status: "paused" })}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded text-sm flex items-center justify-center"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </button>
                <button
                  onClick={() => {
                    const winner =
                      (match.score?.player1 || 0) > (match.score?.player2 || 0) ? match.player1 : match.player2
                    updateMatchScore(match.id, {
                      status: "completed",
                      winner,
                      endTime: new Date(),
                    })
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm flex items-center justify-center"
                >
                  <Trophy className="h-4 w-4 mr-1" />
                  End Match
                </button>
              </>
            )}

            {match.status === "paused" && (
              <button
                onClick={() => updateMatchScore(match.id, { status: "live" })}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm flex items-center justify-center"
              >
                <Play className="h-4 w-4 mr-1" />
                Resume
              </button>
            )}
          </div>

          {match.table && <div className="mt-3 text-xs text-gray-400 text-center">Table {match.table}</div>}
        </motion.div>
      )

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Match Center</h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTournamentFilter}
                onChange={(e) => setSelectedTournamentFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="all">All Tournaments</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.title}
                  </option>
                ))}
              </select>

              <select
                value={matchFilter}
                onChange={(e) => setMatchFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="all">All Matches</option>
                <option value="live">Live</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
            <div className="flex items-center">
              <Play className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <h3 className="text-green-400 font-medium">Match Center Status</h3>
                <p className="text-green-300 text-sm mt-1">
                  {matches.length > 0
                    ? `${matches.length} total matches found (${matches.filter((m) => m.status === "live").length} live, ${matches.filter((m) => m.status === "ready").length} ready). Matches are created through bracket generation.`
                    : "No matches found. Generate tournament brackets to create matches."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </div>

          {filteredMatches.length === 0 && (
            <div className="text-center py-12">
              <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No matches found for the selected filter</p>
              <div className="mt-4 p-4 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  <strong>To see matches here:</strong>
                </p>
                <p className="text-yellow-300 text-sm mt-2">
                  Go to Tournament Management and generate a bracket for a tournament.
                  <br />
                  Matches are automatically created when brackets are generated.
                </p>
              </div>
            </div>
          )}
        </div>
      )
    }

    // Enhanced Analytics Dashboard
    const Analytics = () => {
      const totalRevenue = tournaments.reduce((sum, t) => sum + (t.entryFee || 0) * (t.participants?.length || 0), 0)
      const totalPlayers = users.length
      const activeTournaments = tournaments.filter((t) => t.status === "live" || t.status === "registration").length
      const completedTournaments = tournaments.filter((t) => t.status === "completed").length

      const recentRegistrations = users
        .sort((a, b) => (b.createdAt?.toDate?.() || new Date()) - (a.createdAt?.toDate?.() || new Date()))
        .slice(0, 10)

      const topTournaments = tournaments
        .sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0))
        .slice(0, 5)

      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
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

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Registrations</h3>
              <div className="space-y-3">
                {recentRegistrations.map((user) => (
                  <div key={user.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage || "/placeholder.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {user.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Tournaments</h3>
              <div className="space-y-3">
                {topTournaments.map((tournament, index) => (
                  <div key={tournament.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-orange-500"
                                : "bg-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">{tournament.title}</div>
                        <div className="text-gray-400 text-sm">{tournament.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{tournament.participants?.length || 0} players</div>
                      <div className="text-gray-400 text-sm">${tournament.entryFee || 0} entry</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tournament Status Overview */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Tournament Status Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {tournaments.filter((t) => t.status === "upcoming").length}
                </div>
                <div className="text-gray-400 text-sm">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {tournaments.filter((t) => t.status === "registration").length}
                </div>
                <div className="text-gray-400 text-sm">Registration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {tournaments.filter((t) => t.status === "live").length}
                </div>
                <div className="text-gray-400 text-sm">Live</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{completedTournaments}</div>
                <div className="text-gray-400 text-sm">Completed</div>
              </div>
            </div>
          </div>

          {/* Live Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Live Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{liveMatches.length}</div>
                <div className="text-gray-400">Live Matches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {matches.filter((m) => m.status === "ready").length}
                </div>
                <div className="text-gray-400">Matches Ready</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {matches.filter((m) => m.status === "completed").length}
                </div>
                <div className="text-gray-400">Matches Completed</div>
              </div>
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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-white">Admin Control Center</h1>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Live Tournaments</div>
                  <div className="text-2xl font-bold text-red-400">
                    {tournaments.filter((t) => t.status === "live").length}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Active Matches</div>
                  <div className="text-2xl font-bold text-green-400">{liveMatches.length}</div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors whitespace-nowrap ${
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
              {activeTab === "brackets" && <BracketManager />}
              {activeTab === "live" && <LiveControl />}
              {activeTab === "matches" && <MatchManager />}
              {activeTab === "migration" && <DataMigration />}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">User Management</h2>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-white">Profile</th>
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
                          <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                            <td className="px-6 py-4">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage || "/placeholder.svg"}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </td>
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
                            <td className="px-6 py-4 text-gray-300 capitalize">{user.skillLevel || "Beginner"}</td>
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
