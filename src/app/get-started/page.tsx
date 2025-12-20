"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface OutfitSection {
  item: string;
  details: string[];
  wardrobe_match?: {
    id: string;
    name: string;
    image_url: string;
    category: string;
    color: string;
  };
}

interface OutfitSections {
  top?: OutfitSection;
  layer?: OutfitSection;
  bottom?: OutfitSection;
  footwear?: OutfitSection;
  accessories?: {
    items: string[];
  };
}

interface OutfitRecommendation {
  id: number;
  title: string;
  description: string;
  sections: OutfitSections;
  full_text_prompt: string;
}

export default function GetStartedPage() {
  const [form, setForm] = useState({
    eventType: "wedding",
    eventVenue: "",
    eventTime: "evening",
    weather: "warm",
    theme: "desi",
    numberOfOutfits: 3,
  });

  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState<OutfitRecommendation[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitRecommendation | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Calculate wardrobe match percentage
  const calculateMatchPercentage = (sections: OutfitSections) => {
    const parts = ['top', 'layer', 'bottom', 'footwear'] as const;
    // Note: Accessories are explicitly excluded from match percentage calculation
    // "Total Sections" refers only to the core outfit parts present (top, layer, bottom, footwear)
    let total = 0;
    let matches = 0;

    parts.forEach(part => {
      const section = sections[part];
      // Check if section exists (not undefined)
      if (section) {
        total++;
        // Check if wardrobe_match exists
        if (section.wardrobe_match) {
          matches++;
        }
      }
    });

    if (total === 0) return 0;
    return Math.round((matches / total) * 100);
  };

  const handleCardClick = (outfit: OutfitRecommendation) => {
    setSelectedOutfit(outfit);
    setShowDetailModal(true);
  };

  // Get user ID from localStorage or sessionStorage
  useEffect(() => {
    let storedUser = localStorage.getItem("user");
    let storageType = "localStorage";

    if (!storedUser) {
      storedUser = sessionStorage.getItem("user");
      storageType = "sessionStorage";
    }

    console.log(`Checking ${storageType} for user data...`);

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("✅ User ID:", userData.id);
        setUserId(userData.id);
      } catch (e) {
        console.error("❌ Error parsing user data:", e);
        setError("Invalid user data. Please sign in again.");
      }
    } else {
      console.warn("⚠️ No user found");
      setError("Please sign in to generate looks");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateOutfits = async () => {
    if (!userId) {
      setError("Please sign in to generate looks");
      return;
    }

    setLoading(true);
    setOutfits([]);
    setSelectedOutfit(null);
    setGeneratedImage(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("event_type", form.eventType);
      formData.append("event_venue", form.eventVenue);
      formData.append("event_time", form.eventTime);
      formData.append("weather", form.weather);
      formData.append("theme", form.theme);
      formData.append("num_looks", form.numberOfOutfits.toString());

      const response = await fetch("http://127.0.0.1:8000/wardrobe/generate-outfit-recommendations", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate outfit recommendations");
      }

      const data = await response.json();

      if (data.success && data.recommendations) {
        setOutfits(data.recommendations);
      } else {
        throw new Error("No recommendations generated");
      }
    } catch (err: any) {
      console.error("Error generating outfits:", err);
      setError(err.message || "Failed to generate outfit recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateLookImage = async () => {
    if (!selectedOutfit) return;

    setLoading(true);
    setError("");

    // Placeholder for nano-banana integration
    // Will be implemented in Phase 2
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedImage("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop");

    setLoading(false);
  };

  const handleCopyPrompt = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    navigator.clipboard.writeText(prompt);
    alert("Prompt copied to clipboard! 📋\n\nYou can now paste this into an image generator.");
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('top') || cat.includes('shirt') || cat.includes('blouse') || cat.includes('kurta')) {
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h8a2 2 0 002-2v-5a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      );
    }
    if (cat.includes('bottom') || cat.includes('pant') || cat.includes('pajama') || cat.includes('trouser') || cat.includes('shalwar')) {
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    }
    if (cat.includes('shoe') || cat.includes('footwear') || cat.includes('khussa')) {
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    }
    if (cat.includes('access') || cat.includes('jewelry') || cat.includes('watch')) {
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  // Circular progress component
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const getColor = (percent: number) => {
      if (percent >= 80) return '#10b981'; // emerald-500
      if (percent >= 60) return '#f59e0b'; // amber-500
      return '#ef4444'; // red-500
    };

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={getColor(percentage)}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
          <span className="text-xs text-gray-500">match</span>
        </div>
      </div>
    );
  };

  const eventTypes = [
    { id: "wedding", name: "Wedding / Shadi", icon: "💍" },
    { id: "mehndi", name: "Mehndi", icon: "🎨" },
    { id: "cultural", name: "Cultural Event", icon: "🎭" },
    { id: "office", name: "Office / Professional", icon: "💼" },
    { id: "casual", name: "Casual Outing", icon: "👕" },
    { id: "party", name: "Party / Celebration", icon: "🎉" },
    { id: "formal", name: "Formal Dinner", icon: "🍽️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-yellow-50/20">
      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            AI Look Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Generate personalized outfit ideas based on your event details
          </p>
          {/* User Status */}
          {userId ? (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Ready to generate looks</span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
              <span className="text-sm text-amber-700 font-medium">
                Please <Link href="/signin" className="underline hover:text-amber-900">sign in</Link> first
              </span>
            </div>
          )}
        </div>

        {/* Event Form */}
        <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Event Type</label>
              <select
                name="eventType"
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-600 focus:outline-none"
                onChange={handleChange}
                value={form.eventType}
              >
                {eventTypes.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.icon} {event.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Event Venue</label>
              <input
                name="eventVenue"
                placeholder="e.g., Garden, Hotel, Restaurant"
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-600 focus:outline-none"
                onChange={handleChange}
                value={form.eventVenue}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Event Time</label>
              <select
                name="eventTime"
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-600 focus:outline-none"
                onChange={handleChange}
                value={form.eventTime}
              >
                <option value="morning">🌅 Morning</option>
                <option value="afternoon">☀️ Afternoon</option>
                <option value="evening">🌆 Evening</option>
                <option value="night">🌙 Night</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Weather/Season</label>
              <input
                name="weather"
                placeholder="e.g., Summer, Winter, Rainy"
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-600 focus:outline-none"
                onChange={handleChange}
                value={form.weather}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Theme</label>
              <input
                name="theme"
                placeholder="e.g., Desi, Formal, Elite, Casual"
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-600 focus:outline-none"
                onChange={handleChange}
                value={form.theme}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Number of Outfits</label>
              <select
                name="numberOfOutfits"
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-600 focus:outline-none"
                onChange={handleChange}
                value={form.numberOfOutfits}
              >
                <option value={3}>3 Outfits</option>
                <option value={5}>5 Outfits</option>
                <option value={7}>7 Outfits</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={generateOutfits}
            disabled={loading || !userId}
            className="mt-6 w-full md:w-auto rounded-xl bg-gradient-to-r from-emerald-600 to-yellow-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              "✨ Generate Outfit Ideas"
            )}
          </button>
        </div>

        {/* Compact Outfit Cards */}
        {outfits.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Outfit Suggestions
              </h2>
              <span className="text-sm text-gray-500">Sorted by wardrobe match</span>
            </div>
            <div className="space-y-4">
              {outfits.map((outfit, index) => {
                const percentage = calculateMatchPercentage(outfit.sections);
                return (
                  <div
                    key={outfit.id}
                    onClick={() => handleCardClick(outfit)}
                    className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 hover:border-emerald-400 cursor-pointer transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4 p-5">
                      {/* Left: Number Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>

                      {/* Middle: Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                          {outfit.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {outfit.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {percentage >= 80 ? 'Highly Available' : percentage >= 50 ? 'Mostly Available' : 'Partially Available'}
                          </span>
                          <span className="text-xs text-gray-500">Click to view details</span>
                        </div>
                      </div>

                      {/* Right: Circular Progress */}
                      <div className="flex-shrink-0">
                        <CircularProgress percentage={percentage} />
                      </div>

                      {/* Chevron Icon */}
                      <div className="flex-shrink-0 text-gray-400 group-hover:text-emerald-600 transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-1 w-0 bg-gradient-to-r from-emerald-500 to-yellow-500 transition-all duration-300 group-hover:w-full" />
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* Detail Modal */}
        {showDetailModal && selectedOutfit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowDetailModal(false)}>
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-t-2xl z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedOutfit.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {calculateMatchPercentage(selectedOutfit.sections)}% Wardrobe Match
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mt-2">{selectedOutfit.description}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-shrink-0 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {Object.entries(selectedOutfit.sections).map(([key, section]) => {
                  if (!section) return null;

                  // Handle different section structures (Accessories vs others)
                  let items: string[] = [];
                  let headerItem = "";
                  let wardrobeMatch: OutfitSection['wardrobe_match'] = undefined;

                  if ('items' in section) {
                    items = section.items;
                  } else if ('item' in section && 'details' in section) {
                    headerItem = section.item;
                    items = section.details;
                    wardrobeMatch = section.wardrobe_match;
                  }

                  return (
                    <div key={key} className="group/section">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                          {getCategoryIcon(key)}
                        </div>
                        <h4 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                          {key}
                        </h4>
                      </div>

                      <div className="ml-12 space-y-2">
                        {headerItem && (
                          <div className="font-medium text-gray-900 mb-1">{headerItem}</div>
                        )}

                        {items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                            <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{item}</span>
                          </div>
                        ))}

                        {/* Wardrobe Match Badge */}
                        {wardrobeMatch && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 flex items-center gap-4 group-hover/section:border-emerald-200 transition-colors">
                            <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm relative">
                              <img
                                src={wardrobeMatch.image_url}
                                alt={wardrobeMatch.name}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-lg"></div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ring-1 ring-emerald-600/20">
                                  Match Found
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                Use your: {wardrobeMatch.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {wardrobeMatch.category} • {wardrobeMatch.color}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-100 z-10">
                <button
                  onClick={(e) => handleCopyPrompt(selectedOutfit.full_text_prompt, e)}
                  className="w-full flex items-center justify-center gap-2 py-4 px-8 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Image Prompt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Image Modal */}
        {generatedImage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setGeneratedImage(null)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Generated Look</h2>
                <button
                  onClick={() => setGeneratedImage(null)}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <img
                src={generatedImage}
                alt="Generated Look"
                className="w-full rounded-xl shadow-lg mb-4"
              />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage;
                  link.download = 'libaasai-look.png';
                  link.click();
                }}
                className="w-full rounded-lg border-2 border-emerald-600 px-6 py-3 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Download Image
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {
          outfits.length === 0 && !loading && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-16 text-center">
              <div className="text-6xl mb-6">✨</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Ready to Generate Your Perfect Look?
              </h3>
              <p className="text-gray-600">
                Fill in the event details above and click Generate to get AI-powered outfit suggestions
              </p>
            </div>
          )
        }
      </main >
    </div >
  );
}
