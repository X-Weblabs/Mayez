import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { TournamentProvider } from "./contexts/TournamentContext"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Tournaments from "./components/Tournaments"
import Live from "./components/Live"
import Players from "./components/Players"
import News from "./components/News"
import Calendar from "./components/Calendar"
import Rules from "./components/Rules"
import History from "./components/History"
import About from "./components/About"
import Dashboard from "./components/Dashboard"
import Payment from "./components/Payment"
import Profile from "./components/Profile"
import AdminPanel from "./components/AdminPanel"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"
import { useState } from "react"
import { motion } from 'framer-motion';
import { ChevronDown} from 'lucide-react';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  const navItems = [
    'HOME', 'NEWS', 'TOURNAMENTS', 'CALENDAR', 'LIVE', 
    'PLAYERS', 'RULES', 'HISTORY', 'ABOUT'
  ];

  return (
    <nav className="bg-black/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-800 mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex align-items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <motion.div 
              className="text-white font-bold text-xl"
              whileHover={{ scale: 1.05 }}
            >
              MAYEZ<span className="text-red-500">TOURNAMENT</span>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 align-items-center">
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={item.toLowerCase()}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}

              {/* Navbar actions */}
              <div className="navbar-actions">
                {currentUser ? (
                  <>
                    <Link to="/dashboard" className="btn btn-outline btn-sm">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn btn-primary btn-sm">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      LOGIN
                    </Link>
                    <Link to="/register"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      REGISTER
                    </Link>
                  </>
                )}
              </div>

              {/* Login/Register Buttons */}
              <div className="hidden md:flex items-center space-x-4">
              
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
            >
              <ChevronDown className={`h-6 w-6 transform transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={item.toLowerCase()}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  LOGIN
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  REGISTER
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <TournamentProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/live" element={<Live />} />
              <Route path="/players" element={<Players />} />
              <Route path="/news" element={<News />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
              <Route path="/payment/:tournamentId" element={<Payment />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </TournamentProvider>
    </AuthProvider>
  )
}

export default App
