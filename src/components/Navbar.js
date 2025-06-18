"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tournaments", path: "/tournaments" },
    { name: "Live", path: "/live" },
    { name: "Players", path: "/players" },
    { name: "News", path: "/news" },
    { name: "Calendar", path: "/calendar" },
    { name: "Rules", path: "/rules" },
    { name: "History", path: "/history" },
    { name: "About", path: "/about" },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          MAYEZ<span>TOURNAMENT</span>
        </Link>

        <ul className={`navbar-nav ${isMenuOpen ? "active" : ""}`}>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

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
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
      </div>
    </nav>
  )
}

export default Navbar
