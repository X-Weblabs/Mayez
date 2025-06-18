<!-- Collections Overview -->
📁 users/
📁 tournaments/
📁 matches/
📁 news/
📁 liveStreams/
  📁 {streamId}/messages/
📁 tournamentResults/
📁 analytics/

<!-- Users Collection (`users`) -->
// Document ID: Firebase Auth UID
{
  // Personal Information
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@email.com",
  phone: "+1-555-123-4567",
  dateOfBirth: "1990-05-15",
  
  // Profile & Settings
  profileImage: "https://...", // Optional
  skillLevel: "professional", // beginner, intermediate, advanced, professional
  isAdmin: false,
  
  // Statistics
  wins: 45,
  losses: 12,
  totalGames: 57,
  winRate: 79, // Calculated field
  
  // Tournament History
  tournaments: [
    {
      tournamentId: "tournament_id",
      tournamentName: "Mayez Championship 2025",
      registeredAt: Timestamp,
      status: "registered", // registered, completed, withdrawn
      paymentMethod: "card",
      amountPaid: 525.50,
      finalPosition: null, // Set after tournament completion
      prize: 0 // Prize money won
    }
  ],
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}

<!-- Tournaments Collection (`tournaments`) -->
// Document ID: Auto-generated
{
  // Basic Information
  title: "Mayez Championship 2025",
  type: "Championship", // Championship, Masters, Pro Series, Women's Pro, Seniors, Youth, Open, Qualifier
  description: "The premier championship event of the year featuring the world's best pool players.",
  
  // Schedule & Location
  date: "June 15-18, 2025",
  startDate: Timestamp,
  endDate: Timestamp,
  location: "Las Vegas, NV",
  venue: "MGM Grand Conference Center",
  
  // Financial
  prize: "$50,000",
  prizePool: 50000, // Numeric for calculations
  entryFee: 500,
  
  // Participation
  maxParticipants: 128,
  participants: [
    {
      userId: "user_uid",
      userName: "John Smith",
      skillLevel: "professional",
      registeredAt: Timestamp,
      paymentStatus: "completed", // pending, completed, failed
      paymentMethod: "card",
      amountPaid: 525.50,
      checkedIn: false,
      finalPosition: null,
      prize: 0
    }
  ],
  
  // Tournament Structure
  format: "single_elimination", // single_elimination, double_elimination, round_robin
  gameType: "9-ball", // 8-ball, 9-ball, straight_pool
  
  // Status & Media
  status: "registration", // upcoming, registration, live, completed, cancelled
  image: "https://images.pexels.com/photos/16074/pexels-photo.jpg",
  color: "from-red-600 to-red-800", // For UI theming
  
  // Matches (References to matches collection)
  matches: ["match_id_1", "match_id_2"],
  
  // Live Streaming
  liveStreamId: "stream_id", // Optional
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}

<!-- Matches Collection (`matches`) -->
// Document ID: Auto-generated
{
  // Tournament Reference
  tournamentId: "tournament_id",
  tournamentName: "Mayez Championship 2025",
  
  // Match Details
  round: "semifinals", // qualifiers, round_1, quarterfinals, semifinals, finals
  matchNumber: 1,
  table: "Table 1",
  
  // Players
  player1: {
    userId: "user_uid_1",
    name: "John Smith",
    skillLevel: "professional",
    score: 3
  },
  player2: {
    userId: "user_uid_2", 
    name: "Mike Johnson",
    skillLevel: "advanced",
    score: 2
  },
  
  // Match Status
  status: "live", // upcoming, live, paused, completed
  winner: null, // Set to userId when completed
  
  // Timing
  scheduledTime: Timestamp,
  startTime: Timestamp,
  endTime: Timestamp,
  lastUpdated: Timestamp,
  
  // Live Data
  currentGame: 1,
  totalGames: 5, // Race to X format
  
  // Streaming
  liveStreamId: "stream_id", // Optional
  viewerCount: 1247,
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}

<!-- News Collection (`news`) -->
// Document ID: Auto-generated
{
  // Content
  title: "Mayez Championship 2025 Breaks Registration Records",
  excerpt: "The upcoming Mayez Championship has already attracted over 500 registrations...",
  content: "Full article content here...",
  
  // Categorization
  category: "tournaments", // tournaments, players, announcements, technology
  tags: ["championship", "registration", "records"],
  
  // Author & Publishing
  author: "Sarah Johnson",
  authorId: "author_user_id", // Optional
  publishedAt: Timestamp,
  
  // Engagement
  views: 1247,
  readTime: "3 min read",
  featured: true,
  
  // Media
  image: "https://images.pexels.com/photos/16074/pexels-photo.jpg",
  
  // Status
  status: "published", // draft, published, archived
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}

<!-- Live Streams Collection (`liveStreams`) -->
// Document ID: Auto-generated
{
  // Stream Information
  title: "Mayez Championship Finals - Table 1",
  description: "Live coverage of the championship finals",
  
  // Players/Match
  player1: "John Smith",
  player2: "Mike Johnson",
  matchId: "match_id", // Reference to matches collection
  tournamentId: "tournament_id",
  
  // Streaming Details
  youtubeId: "dQw4w9WgXcQ",
  streamUrl: "https://youtube.com/watch?v=...",
  platform: "youtube", // youtube, twitch, custom
  
  // Status & Metrics
  status: "live", // scheduled, live, ended
  viewers: 1247,
  maxViewers: 1500,
  
  // Score (Live Updates)
  score: {
    player1: 3,
    player2: 2
  },
  
  // Timing
  scheduledStart: Timestamp,
  actualStart: Timestamp,
  endTime: Timestamp,
  
  // Thumbnails & Media
  thumbnail: "https://...",
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}

<!-- Tournament Results Collection (`tournamentResults`) -->
// Document ID: Auto-generated (or use tournamentId)
{
  // Tournament Reference
  tournamentId: "tournament_id",
  title: "Mayez Championship 2024",
  year: 2024,
  type: "Championship",
  
  // Results
  winner: {
    userId: "user_uid",
    name: "John Smith",
    prize: 25000
  },
  runnerUp: {
    userId: "user_uid_2", 
    name: "Mike Johnson",
    prize: 12500
  },
  
  // Tournament Stats
  totalParticipants: 128,
  totalPrizePool: 50000,
  location: "Las Vegas, NV",
  date: "June 15-18, 2024",
  
  // Highlights
  highlights: [
    "Record-breaking 128 participants",
    "First championship to be streamed live globally",
    "Youngest winner in tournament history at age 24"
  ],
  
  // Media
  image: "https://...",
  
  // Final Standings (Top 8)
  finalStandings: [
    {
      position: 1,
      userId: "user_uid",
      name: "John Smith",
      prize: 25000
    },
    {
      position: 2,
      userId: "user_uid_2",
      name: "Mike Johnson", 
      prize: 12500
    },
    {
      position: 3,
      userId: "user_uid_3",
      name: "Sarah Wilson",
      prize: 7500
    }
    // ... more positions
  ],
  
  // Timestamps
  completedAt: Timestamp,
  createdAt: Timestamp
}

<!-- Chat Messages Subcollection (`liveStreams/{streamId}/messages`) -->
// Document ID: Auto-generated
{
  userId: "user_uid",
  userName: "PoolFan123",
  message: "Great shot by John!",
  timestamp: Timestamp,
  
  // Moderation
  flagged: false,
  deleted: false
}

// <!-- Analytics Collection (`analytics`) -->
// Document ID: Date-based (e.g., "2025-01-15")
{
  date: "2025-01-15",
  
  // Daily Metrics
  newRegistrations: 15,
  totalUsers: 10247,
  activeTournaments: 3,
  completedMatches: 12,
  
  // Revenue
  dailyRevenue: 7500,
  totalRevenue: 2150000,
  
  // Engagement
  liveViewers: 3500,
  newsViews: 8900,
  
  // Popular Content
  topTournament: "Mayez Championship 2025",
  topNews: "Championship Registration Opens",
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}

