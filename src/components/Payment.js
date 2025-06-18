"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import {
  CreditCard,
  Lock,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Smartphone,
  Wallet,
  DollarSign,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useTournament } from "../contexts/TournamentContext"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "../firebase/config"

const Payment = () => {
  const { tournamentId } = useParams()
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const { tournaments } = useTournament()

  const [tournament, setTournament] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [paymentStep, setPaymentStep] = useState(1) // 1: method selection, 2: details, 3: confirmation

  // Payment form data for different methods
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "US",
  })

  const [mobileMoneyData, setMobileMoneyData] = useState({
    phoneNumber: "",
    pin: "",
    provider: "",
  })

  const [walletData, setWalletData] = useState({
    walletId: "",
    pin: "",
  })

  // Payment methods configuration
  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay with Visa, Mastercard, or American Express",
      fees: "2.9% + $0.30",
      color: "bg-blue-600",
    },
    {
      id: "ecocash",
      name: "EcoCash",
      icon: Smartphone,
      description: "Pay with your EcoCash mobile wallet",
      fees: "1.5%",
      color: "bg-green-600",
    },
    {
      id: "onemoney",
      name: "OneMoney",
      icon: Smartphone,
      description: "Pay with your OneMoney mobile wallet",
      fees: "1.5%",
      color: "bg-red-600",
    },
    {
      id: "paynow",
      name: "Paynow",
      icon: Wallet,
      description: "Pay with Paynow instant payments",
      fees: "2.0%",
      color: "bg-purple-600",
    },
    {
      id: "innbucks",
      name: "InnBucks",
      icon: DollarSign,
      description: "Pay with your InnBucks wallet",
      fees: "1.8%",
      color: "bg-orange-600",
    },
  ]

  useEffect(() => {
    const foundTournament = tournaments.find((t) => t.id === tournamentId)
    if (foundTournament) {
      setTournament(foundTournament)
    }
  }, [tournamentId, tournaments])

  const calculateFees = () => {
    if (!tournament) return 0
    const method = paymentMethods.find((m) => m.id === selectedPaymentMethod)
    const baseAmount = tournament.entryFee

    switch (selectedPaymentMethod) {
      case "card":
        return Math.round((baseAmount * 0.029 + 0.3) * 100) / 100
      case "ecocash":
        return Math.round(baseAmount * 0.015 * 100) / 100
      case "onemoney":
        return Math.round(baseAmount * 0.015 * 100) / 100
      case "paynow":
        return Math.round(baseAmount * 0.02 * 100) / 100
      case "innbucks":
        return Math.round(baseAmount * 0.018 * 100) / 100
      default:
        return 5.0
    }
  }

  const getTotalAmount = () => {
    if (!tournament) return 0
    return tournament.entryFee + calculateFees()
  }

  const handleCardInputChange = (e) => {
    const { name, value } = e.target
    setCardData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMobileMoneyChange = (e) => {
    const { name, value } = e.target
    setMobileMoneyData((prev) => ({ ...prev, [name]: value }))
  }

  const handleWalletChange = (e) => {
    const { name, value } = e.target
    setWalletData((prev) => ({ ...prev, [name]: value }))
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const formatPhoneNumber = (value) => {
    const v = value.replace(/\D/g, "")
    if (v.length <= 10) {
      return v.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
    }
    return v
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setCardData((prev) => ({ ...prev, cardNumber: formatted }))
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value)
    setCardData((prev) => ({ ...prev, expiryDate: formatted }))
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setMobileMoneyData((prev) => ({ ...prev, phoneNumber: formatted }))
  }

  const processPayment = async () => {
    setLoading(true)

    try {
      // Simulate payment processing based on method
      let processingTime = 2000

      switch (selectedPaymentMethod) {
        case "ecocash":
        case "onemoney":
          processingTime = 3000 // Mobile money takes a bit longer
          break
        case "paynow":
          processingTime = 1500 // Paynow is faster
          break
        case "innbucks":
          processingTime = 2500
          break
        default:
          processingTime = 2000
      }

      await new Promise((resolve) => setTimeout(resolve, processingTime))

      // Update tournament participants
      const tournamentRef = doc(db, "tournaments", tournamentId)
      await updateDoc(tournamentRef, {
        participants: arrayUnion({
          userId: currentUser.uid,
          userName: userProfile.firstName + " " + userProfile.lastName,
          registeredAt: new Date(),
          paymentStatus: "completed",
          paymentMethod: selectedPaymentMethod,
          amountPaid: getTotalAmount(),
        }),
      })

      // Update user's tournaments
      const userRef = doc(db, "users", currentUser.uid)
      await updateDoc(userRef, {
        tournaments: arrayUnion({
          tournamentId: tournamentId,
          tournamentName: tournament.title,
          registeredAt: new Date(),
          status: "registered",
          paymentMethod: selectedPaymentMethod,
          amountPaid: getTotalAmount(),
        }),
      })

      // Success - redirect to dashboard
      navigate("/dashboard?success=payment")
    } catch (error) {
      console.error("Payment failed:", error)
      alert("Payment failed. Please try again.")
    }
    setLoading(false)
  }

  const renderPaymentMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6">Choose Payment Method</h3>
      {paymentMethods.map((method) => {
        const Icon = method.icon
        return (
          <motion.div
            key={method.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedPaymentMethod === method.id
                ? "border-red-500 bg-red-500/10"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            }`}
            onClick={() => setSelectedPaymentMethod(method.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${method.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{method.name}</h4>
                  <p className="text-gray-400 text-sm">{method.description}</p>
                  <p className="text-gray-500 text-xs">Processing fee: {method.fees}</p>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedPaymentMethod === method.id ? "border-red-500 bg-red-500" : "border-gray-600"
                }`}
              >
                {selectedPaymentMethod === method.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}

      <button
        onClick={() => setPaymentStep(2)}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors mt-6"
      >
        Continue
      </button>
    </div>
  )

  const renderCardForm = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-blue-500 mr-2" />
        <h3 className="text-xl font-bold text-white">Card Payment</h3>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Cardholder Name</label>
        <input
          type="text"
          name="cardholderName"
          value={cardData.cardholderName}
          onChange={handleCardInputChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Card Number</label>
        <input
          type="text"
          value={cardData.cardNumber}
          onChange={handleCardNumberChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Expiry Date</label>
          <input
            type="text"
            value={cardData.expiryDate}
            onChange={handleExpiryChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            placeholder="MM/YY"
            maxLength="5"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">CVV</label>
          <input
            type="text"
            name="cvv"
            value={cardData.cvv}
            onChange={handleCardInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            placeholder="123"
            maxLength="4"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Billing Address</label>
        <input
          type="text"
          name="billingAddress"
          value={cardData.billingAddress}
          onChange={handleCardInputChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
          placeholder="123 Main Street"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">City</label>
          <input
            type="text"
            name="city"
            value={cardData.city}
            onChange={handleCardInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            placeholder="New York"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">ZIP Code</label>
          <input
            type="text"
            name="zipCode"
            value={cardData.zipCode}
            onChange={handleCardInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            placeholder="10001"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderMobileMoneyForm = () => {
    const methodName = paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name
    const Icon = paymentMethods.find((m) => m.id === selectedPaymentMethod)?.icon

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Icon className="h-6 w-6 text-green-500 mr-2" />
          <h3 className="text-xl font-bold text-white">{methodName} Payment</h3>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={mobileMoneyData.phoneNumber}
            onChange={handlePhoneChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            placeholder="077 123 4567"
            required
          />
          <p className="text-gray-500 text-sm mt-1">Enter your {methodName} registered phone number</p>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">{methodName} PIN</label>
          <input
            type="password"
            name="pin"
            value={mobileMoneyData.pin}
            onChange={handleMobileMoneyChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            placeholder="Enter your PIN"
            maxLength="4"
            required
          />
        </div>

        <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-blue-400 font-medium">Payment Instructions</h4>
              <p className="text-blue-300 text-sm mt-1">
                You will receive a payment prompt on your phone. Please approve the transaction to complete your
                registration.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderWalletForm = () => {
    const methodName = paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name
    const Icon = paymentMethods.find((m) => m.id === selectedPaymentMethod)?.icon

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Icon className="h-6 w-6 text-purple-500 mr-2" />
          <h3 className="text-xl font-bold text-white">{methodName} Payment</h3>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            {selectedPaymentMethod === "paynow" ? "Paynow Email/Phone" : "Wallet ID"}
          </label>
          <input
            type="text"
            name="walletId"
            value={walletData.walletId}
            onChange={handleWalletChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            placeholder={
              selectedPaymentMethod === "paynow" ? "email@example.com or 077 123 4567" : "Enter your wallet ID"
            }
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">PIN</label>
          <input
            type="password"
            name="pin"
            value={walletData.pin}
            onChange={handleWalletChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            placeholder="Enter your PIN"
            maxLength="6"
            required
          />
        </div>

        <div className="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-purple-400 font-medium">Secure Payment</h4>
              <p className="text-purple-300 text-sm mt-1">
                Your payment will be processed securely through {methodName}'s encrypted payment gateway.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case "card":
        return renderCardForm()
      case "ecocash":
      case "onemoney":
        return renderMobileMoneyForm()
      case "paynow":
      case "innbucks":
        return renderWalletForm()
      default:
        return renderCardForm()
    }
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading tournament details...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Tournament Details */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Tournament Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{tournament.title}</h3>
                <p className="text-gray-400">{tournament.type}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{tournament.date}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{tournament.location}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Trophy className="h-5 w-5 mr-2" />
                  <span>{tournament.prize}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="h-5 w-5 mr-2" />
                <span className="text-sm">
                  {Array.isArray(tournament.participants)
                    ? tournament.participants.length
                    : tournament.participants || 0}
                  /{tournament.maxParticipants} Players
                </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-300">Entry Fee:</span>
                  <span className="text-white font-bold">${tournament.entryFee}</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-2">
                  <span className="text-gray-300">Processing Fee:</span>
                  <span className="text-white">${calculateFees()}</span>
                </div>
                <div className="border-t border-gray-700 mt-4 pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-red-500">${getTotalAmount()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Lock className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-2xl font-bold text-white">Secure Payment</h2>
            </div>

            {/* Payment Steps Indicator */}
            <div className="flex items-center mb-8">
              <div className={`flex items-center ${paymentStep >= 1 ? "text-red-500" : "text-gray-500"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    paymentStep >= 1 ? "border-red-500 bg-red-500 text-white" : "border-gray-500"
                  }`}
                >
                  {paymentStep > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
                </div>
                <span className="ml-2 font-medium">Method</span>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${paymentStep >= 2 ? "bg-red-500" : "bg-gray-600"}`}></div>
              <div className={`flex items-center ${paymentStep >= 2 ? "text-red-500" : "text-gray-500"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    paymentStep >= 2 ? "border-red-500 bg-red-500 text-white" : "border-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 font-medium">Details</span>
              </div>
            </div>

            {paymentStep === 1 && renderPaymentMethodSelection()}

            {paymentStep === 2 && (
              <div>
                {renderPaymentForm()}

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={() => setPaymentStep(1)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <motion.button
                    onClick={processPayment}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? "Processing..." : `Pay $${getTotalAmount()}`}
                  </motion.button>
                </div>
              </div>
            )}

            <div className="text-center text-sm text-gray-400 mt-6">
              <Lock className="inline h-4 w-4 mr-1" />
              Your payment information is secure and encrypted
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Payment
