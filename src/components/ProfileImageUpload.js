"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "../firebase/config"
import { Camera, Upload, X, User } from "lucide-react"

const ProfileImageUpload = ({ onImageUpload, currentImage, className = "" }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    setError("")

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result)
    }
    reader.readAsDataURL(file)

    // Upload image
    uploadImage(file)
  }

  const uploadImage = async (file) => {
    setUploading(true)
    setError("")

    try {
      // Create a unique filename
      const timestamp = Date.now()
      const filename = `profile-images/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const imageRef = ref(storage, filename)

      // Upload the file
      const snapshot = await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Call the callback with the download URL
      onImageUpload(downloadURL)
      setPreview(null)
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = () => {
    setPreview(null)
    onImageUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-3">Profile Picture</label>

      {/* Current/Preview Image */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-4 border-gray-600 flex items-center justify-center">
            {preview ? (
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            ) : currentImage ? (
              <img src={currentImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>

          {/* Loading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Remove button */}
          {(currentImage || preview) && !uploading && (
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <motion.div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragOver ? "border-red-500 bg-red-500/10" : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-300 mb-2">
          Drag and drop your profile image here, or{" "}
          <span className="text-red-500 hover:text-red-400 underline">click to browse</span>
        </p>
        <p className="text-gray-500 text-sm">Supports: JPG, PNG, GIF (Max 5MB)</p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-red-600/20 border border-red-600/50 rounded-lg"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Upload Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            <Camera className="w-4 h-4 mr-2" />
            Choose Profile Image
          </>
        )}
      </button>

      {/* Tips */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2 text-sm">Tips for a great profile photo:</h4>
        <ul className="text-gray-400 text-xs space-y-1">
          <li>• Use a clear, high-quality image</li>
          <li>• Make sure your face is clearly visible</li>
          <li>• Square images work best (1:1 ratio)</li>
          <li>• Keep file size under 5MB</li>
        </ul>
      </div>
    </div>
  )
}

export default ProfileImageUpload
