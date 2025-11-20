"use client";

import { useState } from "react";
import Link from "next/link";

export default function GetStartedPage() {
  const [selectedEvent, setSelectedEvent] = useState("wedding");
  const [numberOfLooks, setNumberOfLooks] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLook, setSelectedLook] = useState<typeof generatedLooks[0] | null>(null);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [moveForward, setMoveForward] = useState(0);
  const [verticalAngle, setVerticalAngle] = useState(0);
  const [wideAngleLens, setWideAngleLens] = useState(false);

  const eventTypes = [
    {
      id: "wedding",
      name: "Wedding / Shadi",
      icon: "💍",
    },
    {
      id: "mehndi",
      name: "Mehndi",
      icon: "🎨",
    },
    {
      id: "cultural",
      name: "Cultural Event",
      icon: "🎭",
    },
    {
      id: "office",
      name: "Office / Professional",
      icon: "💼",
    },
    {
      id: "casual",
      name: "Casual Outing",
      icon: "👕",
    },
    {
      id: "party",
      name: "Party / Celebration",
      icon: "🎉",
    },
    {
      id: "formal",
      name: "Formal Dinner",
      icon: "🍽️",
    },
  ];

  const generatedLooks = [
    {
      id: 1,
      match: 87,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop",
      description:
        "Perfect for a wedding celebration. This ensemble balances traditional elegance with your hourglass silhouette, featuring rich colors that complement your warm skin tone.",
      items: [
        { name: "Emerald Green Dress", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop" },
        { name: "White Dupatta", image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=100&h=100&fit=crop" },
        { name: "Gold Jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop" }
      ],
    },
    {
      id: 2,
      match: 90,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=600&fit=crop",
      description:
        "Perfect for a wedding celebration. This ensemble balances traditional elegance with your hourglass silhouette, featuring rich colors that complement your warm skin tone.",
      items: [
        { name: "Red Lehenga", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=100&h=100&fit=crop" },
        { name: "Gold Blouse", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop" },
        { name: "Statement Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop" }
      ],
    },
    {
      id: 3,
      match: 85,
      image: "https://images.unsplash.com/photo-1610030469320-3e2fa0b1c1b5?w=400&h=600&fit=crop",
      description:
        "Perfect for a wedding celebration. This ensemble balances traditional elegance with your hourglass silhouette, featuring rich colors that complement your warm skin tone.",
      items: [
        { name: "Royal Blue Sari", image: "https://images.unsplash.com/photo-1583391733941-8b1e7e1c3c9a?w=100&h=100&fit=crop" },
        { name: "Silver Jewelry", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&h=100&fit=crop" },
        { name: "Matching Clutch", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=100&h=100&fit=crop" }
      ],
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
    }, 2000);
  };

  const handleLookClick = (look: typeof generatedLooks[0]) => {
    setSelectedLook(look);
    setRotateAngle(0);
    setMoveForward(0);
    setVerticalAngle(0);
    setWideAngleLens(false);
  };

  const handleCloseModal = () => {
    setSelectedLook(null);
  };

  const resetAngles = () => {
    setRotateAngle(0);
    setMoveForward(0);
    setVerticalAngle(0);
    setWideAngleLens(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
          <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Generate Your Perfect Look
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4 sm:px-0">
            AI-powered outfit suggestions based on your wardrobe and profile
          </p>
        </div>

        {/* Event Type Selection */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h2 className="mb-3 sm:mb-4 text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
            Select Event Type
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {eventTypes.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl p-3 sm:p-4 text-left transition-all ${
                  selectedEvent === event.id
                    ? "bg-emerald-50 border-2 border-emerald-600"
                    : "bg-white border border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-xl sm:text-2xl">{event.icon}</span>
                <span
                  className={`text-sm sm:text-base font-medium ${
                    selectedEvent === event.id
                      ? "text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  {event.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Number of Looks Selection */}
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-3 sm:mb-4 text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
            Number of Looks
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[3, 5, 7].map((num) => (
              <button
                key={num}
                onClick={() => setNumberOfLooks(num)}
                className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center text-sm sm:text-base font-semibold transition-all ${
                  numberOfLooks === num
                    ? "bg-emerald-50 border-2 border-emerald-600 text-gray-900"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {num} Looks
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="mb-8 sm:mb-10 lg:mb-12 w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-yellow-500 py-3 sm:py-3.5 lg:py-4 text-base sm:text-lg font-semibold text-white hover:from-emerald-500 hover:to-yellow-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm sm:text-base lg:text-lg">Generating Your Looks...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span className="text-sm sm:text-base lg:text-lg">Generate My Look</span>
            </>
          )}
        </button>

        {/* Generated Looks Section */}
        {showResults && (
          <div className="mt-10 sm:mt-12 lg:mt-16">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Your Generated Looks
              </h2>
              <button
                onClick={handleGenerate}
                className="flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Regenerate
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {generatedLooks.map((look) => (
                <div
                  key={look.id}
                  className="rounded-lg sm:rounded-xl bg-white border border-gray-200 p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleLookClick(look)}
                >
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-5 lg:gap-6">
                    {/* Look Image */}
                    <div className="relative w-full md:w-40 lg:w-48 h-56 sm:h-60 md:h-64 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={look.image}
                        alt={`Look ${look.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.classList.add('bg-gradient-to-br', 'from-emerald-100', 'to-yellow-100', 'flex', 'items-center', 'justify-center');
                            parent.innerHTML += '<svg class="h-16 w-16 sm:h-20 sm:w-20 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>';
                          }
                        }}
                      />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white rounded-full px-2.5 py-1 sm:px-3 text-[10px] sm:text-xs font-semibold text-emerald-600 border border-emerald-200 shadow-sm">
                        {look.match}% Match
                      </div>
                    </div>

                    {/* Look Details */}
                    <div className="flex-1">
                      <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-gray-900">
                        Look {look.id}
                      </h3>
                      <p className="mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                        {look.description}
                      </p>

                      {/* Items Used */}
                      <div className="mb-3 sm:mb-4">
                        <p className="mb-2 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Items Used
                        </p>
                        <div className="flex gap-1.5 sm:gap-2">
                          {look.items.map((item, index) => (
                            <div
                              key={index}
                              className="group relative h-10 w-10 sm:h-12 sm:w-12 rounded-md sm:rounded-lg overflow-hidden border border-gray-200 hover:border-emerald-400 transition-all cursor-pointer"
                              title={item.name}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.classList.add('bg-gradient-to-br', 'from-emerald-200', 'to-yellow-200', 'flex', 'items-center', 'justify-center');
                                    parent.innerHTML += `<span class="text-xs font-medium text-gray-700">${item.name.charAt(0)}</span>`;
                                  }
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button className="flex-1 rounded-lg bg-gray-100 px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                          Save Look
                        </button>
                        <button className="flex-1 sm:flex-initial rounded-lg bg-white border border-gray-200 px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          Try Accessory
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Look Details */}
      {selectedLook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 rounded-full bg-white/90 p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Look Title */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Look {selectedLook.id}
                </h2>
                <div className="inline-block bg-emerald-100 text-emerald-700 px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-semibold">
                  {selectedLook.match}% Match
                </div>
              </div>

              {/* Image Preview */}
              <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
                <img
                  src={selectedLook.image}
                  alt={`Look ${selectedLook.id}`}
                  className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] object-contain"
                  style={{
                    transform: `rotate(${rotateAngle}deg) scale(${1 + moveForward / 50}) perspective(${wideAngleLens ? '500px' : '1000px'}) rotateX(${verticalAngle}deg)`,
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>

              {/* Angle Controls */}
              <div className="mb-4 sm:mb-6 space-y-4 sm:space-y-6 rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4 lg:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Adjust View Angles
                </h3>

                {/* Rotate Right-Left */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      Rotate Right-Left (degrees °)
                    </label>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <input
                        type="number"
                        value={rotateAngle}
                        onChange={(e) => setRotateAngle(Number(e.target.value))}
                        className="w-12 sm:w-16 rounded border border-gray-300 px-1 sm:px-2 py-1 text-xs sm:text-sm text-center focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <button
                        onClick={resetAngles}
                        className="rounded p-1 hover:bg-gray-200 transition-colors"
                        title="Reset"
                      >
                        <svg
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs text-gray-500">-90</span>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={rotateAngle}
                      onChange={(e) => setRotateAngle(Number(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-yellow-500 via-gray-200 to-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      style={{
                        background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((rotateAngle + 90) / 180) * 100}%, #e5e7eb ${((rotateAngle + 90) / 180) * 100}%, #e5e7eb 100%)`,
                      }}
                    />
                    <span className="text-[10px] sm:text-xs text-gray-500">90</span>
                  </div>
                </div>

                {/* Move Forward - Close-Up */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      Move Forward ← Close-Up
                    </label>
                    <input
                      type="number"
                      value={moveForward}
                      onChange={(e) => setMoveForward(Number(e.target.value))}
                      className="w-12 sm:w-16 rounded border border-gray-300 px-1 sm:px-2 py-1 text-xs sm:text-sm text-center focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs text-gray-500">0</span>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={moveForward}
                      onChange={(e) => setMoveForward(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <span className="text-[10px] sm:text-xs text-gray-500">10</span>
                  </div>
                </div>

                {/* Vertical Angle */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      Vertical Angle (Bird ← Worm)
                    </label>
                    <input
                      type="number"
                      value={verticalAngle}
                      onChange={(e) => setVerticalAngle(Number(e.target.value))}
                      className="w-12 sm:w-16 rounded border border-gray-300 px-1 sm:px-2 py-1 text-xs sm:text-sm text-center focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs text-gray-500">-1</span>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      value={verticalAngle}
                      onChange={(e) => setVerticalAngle(Number(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-yellow-500 via-gray-200 to-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      style={{
                        background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((verticalAngle + 45) / 90) * 100}%, #e5e7eb ${((verticalAngle + 45) / 90) * 100}%, #e5e7eb 100%)`,
                      }}
                    />
                    <span className="text-[10px] sm:text-xs text-gray-500">1</span>
                  </div>
                </div>

                {/* Wide-Angle Lens */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    id="wideAngle"
                    checked={wideAngleLens}
                    onChange={(e) => setWideAngleLens(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="wideAngle"
                    className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Wide-Angle Lens
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                  {selectedLook.description}
                </p>
              </div>

              {/* Items Used */}
              <div className="mb-5 sm:mb-6">
                <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Items Used
                </p>
                <div className="flex gap-2 sm:gap-3">
                  {selectedLook.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-1 sm:gap-2"
                    >
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-md sm:rounded-lg overflow-hidden border-2 border-gray-200 hover:border-emerald-400 transition-all">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-600 text-center max-w-[56px] sm:max-w-[64px]">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:from-emerald-500 hover:to-emerald-400 transition-all">
                  Try Accessories
                </button>
                <button className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                  Save Look
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



