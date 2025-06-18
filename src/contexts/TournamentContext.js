"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { collection, onSnapshot, query, orderBy, where, doc, updateDoc, addDoc } from "firebase/firestore"
import { db } from "../firebase/config"

const TournamentContext = createContext()

export const useTournament = () => {
  return useContext(TournamentContext)
}

export const TournamentProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([])
  const [liveMatches, setLiveMatches] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  // Real-time tournaments listener
  useEffect(() => {
    const q = query(collection(db, "tournaments"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tournamentsData = []
      querySnapshot.forEach((doc) => {
        tournamentsData.push({ id: doc.id, ...doc.data() })
      })
      setTournaments(tournamentsData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Real-time live matches listener
  useEffect(() => {
    const q = query(collection(db, "matches"), where("status", "==", "live"), orderBy("startTime", "desc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const matchesData = []
      querySnapshot.forEach((doc) => {
        matchesData.push({ id: doc.id, ...doc.data() })
      })
      setLiveMatches(matchesData)
    })

    return unsubscribe
  }, [])

  // Real-time news listener
  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("publishedAt", "desc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newsData = []
      querySnapshot.forEach((doc) => {
        newsData.push({ id: doc.id, ...doc.data() })
      })
      setNews(newsData)
    })

    return unsubscribe
  }, [])

  const updateMatchScore = async (matchId, scoreData) => {
    const matchRef = doc(db, "matches", matchId)
    await updateDoc(matchRef, scoreData)
  }

  const createTournament = async (tournamentData) => {
    return await addDoc(collection(db, "tournaments"), {
      ...tournamentData,
      createdAt: new Date(),
      participants: [],
      matches: [],
      status: "upcoming",
    })
  }

  const joinTournament = async (tournamentId, userId) => {
    const tournamentRef = doc(db, "tournaments", tournamentId)
    // This would be implemented with array union
    // await updateDoc(tournamentRef, {
    //   participants: arrayUnion(userId)
    // });
  }

  const value = {
    tournaments,
    liveMatches,
    news,
    loading,
    updateMatchScore,
    createTournament,
    joinTournament,
  }

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>
}
