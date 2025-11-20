"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(true);
  
  // User profile data
  const [fullName, setFullName] = useState("Ayesha Khan");
  const [email, setEmail] = useState("ayesha@example.com");
  const [gender, setGender] = useState("female");
  const [country, setCountry] = useState("Pakistan");
  const [height, setHeight] = useState("165");
  const [bodyShape, setBodyShape] = useState("hourglass");
  const [skinTone, setSkinTone] = useState("warm");

  // Wardrobe summary data
  const wardrobeSummary = [
    { count: 12, label: "Tops", color: "bg-emerald-100 text-emerald-700" },
    { count: 8, label: "Bottoms", color: "bg-yellow-100 text-yellow-700" },
    { count: 6, label: "Shoes", color: "bg-purple-100 text-purple-700" },
    { count: 4, label: "Dresses", color: "bg-pink-100 text-pink-700" },
    { count: 18, label: "Items", color: "bg-blue-100 text-blue-700" },
  ];

  const genderOptions = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
    { id: "other", name: "Other" },
  ];

  const bodyShapeOptions = [
    { id: "hourglass", name: "Hourglass", icon: "⏳" },
    { id: "pear", name: "Pear", icon: "🍐" },
    { id: "rectangle", name: "Rectangle", icon: "▭" },
    { id: "inverted", name: "Inverted Triangle", icon: "🔻" },
    { id: "round", name: "Round", icon: "⭕" },
  ];

  const skinToneOptions = [
    { id: "fair", name: "Fair", color: "#FFD7B5" },
    { id: "warm", name: "Warm", color: "#D4A574" },
    { id: "olive", name: "Olive", color: "#C9A86A" },
    { id: "tan", name: "Tan", color: "#B38355" },
    { id: "deep", name: "Deep", color: "#6B4423" },
  ];

  const aiInsights = {
    colors: ["Emerald", "Maroon", "Cream"],
    fits: ["A-line", "Defined waist"],
    patterns: ["Floral", "Minimal prints"],
  };

  const countries = [
    "Pakistan",
    "India",
    "Bangladesh",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Profile Header */}
        <div className="mb-8 rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center text-center mb-6">
            {/* Avatar */}
            <div className="mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-700 to-yellow-400 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">
                {fullName.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            
            {/* Name and Email */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{fullName}</h1>
            <p className="text-gray-600">{email}</p>
          </div>

          {/* Wardrobe Summary */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Wardrobe Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {wardrobeSummary.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 text-center ${item.color}`}
                >
                  <div className="text-2xl font-bold mb-1">{item.count}</div>
                  <div className="text-sm font-medium">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold">Latest:</span> Gold Dupatta
            </div>
          </div>

          {/* Go to Wardrobe Button */}
          <Link
            href="/my-wardrobe"
            className="w-full block rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-600 py-3 text-center text-sm font-semibold text-white hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-md hover:shadow-lg"
          >
            Go to Wardrobe
          </Link>
        </div>

        {/* Privacy & Settings */}
        <div className="mb-8 rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Privacy & Settings
          </h2>

          {/* Image Processing Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Image Processing</h3>
              <p className="text-sm text-gray-600">
                Allow AI to analyze photos for recommendations
              </p>
            </div>
            <button
              onClick={() => setImageProcessing(!imageProcessing)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                imageProcessing ? "bg-gradient-to-r from-emerald-700 to-emerald-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  imageProcessing ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Change Password
            </button>
            <button className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mb-8 rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Information
              </h2>
              <p className="text-sm text-gray-600">
                Edit your personal info and style preferences
              </p>
            </div>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {isEditingProfile ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Full Name
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              ) : (
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900">
                  {fullName}
                </div>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Email Address
              </label>
              <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900">
                {email}
              </div>
            </div>

            {/* Gender */}
            {isEditingProfile && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {genderOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setGender(option.id)}
                      className={`rounded-lg border-2 py-3 text-sm font-medium transition-all ${
                        gender === option.id
                          ? "border-emerald-700 bg-gradient-to-r from-emerald-700/10 to-yellow-400/10 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-600"
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Country */}
            {isEditingProfile && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Height */}
            {isEditingProfile && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Height (cm)
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            )}

            {/* Body Shape */}
            {isEditingProfile && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Body Shape
                </label>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {bodyShapeOptions.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setBodyShape(shape.id)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                        bodyShape === shape.id
                          ? "border-emerald-700 bg-gradient-to-r from-emerald-700/10 to-yellow-400/10"
                          : "border-gray-200 bg-white hover:border-emerald-600"
                      }`}
                    >
                      <span className="text-2xl">{shape.icon}</span>
                      <span className="text-xs font-medium text-gray-900 text-center">
                        {shape.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Skin Tone */}
            {isEditingProfile && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Skin Tone
                </label>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {skinToneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setSkinTone(tone.id)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                        skinTone === tone.id
                          ? "border-yellow-400 bg-gradient-to-r from-yellow-400/10 to-emerald-700/10"
                          : "border-gray-200 bg-white hover:border-yellow-400"
                      }`}
                    >
                      <div
                        className="h-8 w-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: tone.color }}
                      ></div>
                      <span className="text-xs font-medium text-gray-900">
                        {tone.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            {isEditingProfile && (
              <button className="w-full rounded-lg bg-gradient-to-r from-emerald-700 to-yellow-400 py-3 text-sm font-semibold text-white hover:from-emerald-600 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg">
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* AI Style Insights */}
        <div className="mb-8 rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                AI Style Insights
              </h2>
              <p className="text-sm text-gray-600">
                Personalized recommendations based on your wardrobe
              </p>
            </div>
            <button className="rounded-lg bg-gradient-to-r from-emerald-700 to-yellow-400 px-4 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg">
              Re-Analyze
            </button>
          </div>

          <div className="space-y-6">
            {/* Recommended Colors */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Recommended Colors
              </h3>
              <div className="flex flex-wrap gap-2">
                {aiInsights.colors.map((color, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Fits */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Recommended Fits
              </h3>
              <div className="flex flex-wrap gap-2">
                {aiInsights.fits.map((fit, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700"
                  >
                    {fit}
                  </span>
                ))}
              </div>
            </div>

            {/* Patterns */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Patterns
              </h3>
              <div className="flex flex-wrap gap-2">
                {aiInsights.patterns.map((pattern, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <div className="space-y-3 mb-6">
            <Link
              href="/my-wardrobe"
              className="block w-full rounded-lg border border-gray-300 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Open Wardrobe
            </Link>
            <Link
              href="/get-started"
              className="block w-full rounded-lg border border-gray-300 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Generate Look
            </Link>
            <button className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Download Profile
            </button>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Items:</span>
              <span className="text-2xl font-bold text-gray-900">42</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Last upload:</span> Gold Dupatta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

