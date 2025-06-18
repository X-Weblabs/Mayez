"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, MapPin, Trophy } from "lucide-react"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // Mock tournament events
  const events = [
    {
      id: 1,
      title: "Mayez Championship 2025",
      date: "2025-06-15",
      time: "09:00 AM",
      location: "Las Vegas, NV",
      type: "Championship",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Elite Pool Masters",
      date: "2025-07-10",
      time: "10:00 AM",
      location: "New York, NY",
      type: "Masters",
      status: "registration",
    },
    {
      id: 3,
      title: "Pro Series Finals",
      date: "2025-08-05",
      time: "08:00 AM",
      location: "Chicago, IL",
      type: "Pro Series",
      status: "upcoming",
    },
  ]

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateString)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

      days.push(
        <motion.div
          key={day}
          className={`h-24 border border-gray-700 p-2 cursor-pointer transition-colors ${
            isToday
              ? "bg-red-600/20 border-red-500"
              : isSelected
                ? "bg-blue-600/20 border-blue-500"
                : "hover:bg-gray-800"
          }`}
          onClick={() => setSelectedDate(date)}
          whileHover={{ scale: 1.02 }}
        >
          <div className={`text-sm font-medium ${isToday ? "text-red-400" : "text-white"}`}>{day}</div>
          {dayEvents.map((event, index) => (
            <div key={event.id} className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded mt-1 truncate">
              {event.title}
            </div>
          ))}
        </motion.div>,
      )
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">TOURNAMENT CALENDAR</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stay up to date with all upcoming tournaments and events. Never miss a competition.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-lg p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-gray-400 font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0 border border-gray-700 rounded-lg overflow-hidden">
                  {renderCalendar()}
                </div>
              </div>
            </div>

            {/* Event Details Sidebar */}
            <div className="space-y-6">
              {/* Selected Date Events */}
              {selectedDate && (
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>

                  {getEventsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-4">
                      {getEventsForDate(selectedDate).map((event) => (
                        <div key={event.id} className="bg-gray-800 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">{event.title}</h4>
                          <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 mr-2" />
                              {event.type}
                            </div>
                          </div>
                          <div className="mt-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                event.status === "registration"
                                  ? "bg-green-600 text-white"
                                  : event.status === "upcoming"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-600 text-white"
                              }`}
                            >
                              {event.status === "registration" ? "Registration Open" : "Upcoming"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No events scheduled for this date.</p>
                  )}
                </div>
              )}

              {/* Upcoming Events */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">{event.title}</h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Calendar
