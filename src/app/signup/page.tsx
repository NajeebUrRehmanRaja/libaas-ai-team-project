"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ClipInsights {
  top_label: string;
  top_confidence: number;
  all_predictions: Array<{ label: string; score: number }>;
}

interface SignupResponse {
  message: string;
  user_id: string;
  clip_insights?: ClipInsights;
}

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [height, setHeight] = useState("");
  const [country, setCountry] = useState("");
  const [bodyShape, setBodyShape] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  
  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [clipInsights, setClipInsights] = useState<ClipInsights | null>(null);

  const genderOptions = [
    {
      id: "male",
      name: "Male",
      icon: (
        <svg className="h-8 w-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      id: "female",
      name: "Female",
      icon: (
        <svg className="h-8 w-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          <circle cx="12" cy="5" r="2.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "other",
      name: "Other",
      icon: (
        <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const bodyShapes = [
    {
      id: "hourglass",
      name: "Hourglass",
      icon: (
        <svg className="h-10 w-10 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2h12v4.5c0 2.5-2 4.5-4.5 4.5h-3C8 11 6 9 6 6.5V2zm0 20h12v-4.5c0-2.5-2-4.5-4.5-4.5h-3C8 13 6 15 6 17.5V22zm1-10.5h10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      ),
    },
    {
      id: "pear",
      name: "Pear",
      icon: (
        <svg className="h-10 w-10 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-1 0-2 1-2 3v1c-3 1-5 4-5 7 0 4.4 3.6 8 8 8s8-3.6 8-8c0-3-2-6-5-7V5c0-2-1-3-2-3z" />
        </svg>
      ),
    },
    {
      id: "rectangle",
      name: "Rectangle",
      icon: (
        <svg className="h-10 w-10 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="7" y="4" width="10" height="16" strokeWidth="2" rx="1" />
        </svg>
      ),
    },
    {
      id: "inverted",
      name: "Inverted Triangle",
      icon: (
        <svg className="h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21L4 7h16l-8 14z" />
        </svg>
      ),
    },
    {
      id: "round",
      name: "Round",
      icon: (
        <svg className="h-10 w-10 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      ),
    },
  ];

  const skinTones = [
    { id: "fair", name: "Fair", color: "#FFD7B5" },
    { id: "warm", name: "Warm", color: "#D4A574" },
    { id: "olive", name: "Olive", color: "#C9A86A" },
    { id: "tan", name: "Tan", color: "#B38355" },
    { id: "deep", name: "Deep", color: "#6B4423" },
  ];

  const countries = [
    "Select your country",
    "Pakistan",
    "India",
    "Bangladesh",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Other",
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedPhotos([...uploadedPhotos, ...Array.from(files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setClipInsights(null);

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("gender", gender);
      
      // Optional fields
      if (height) formData.append("height", height);
      if (country && country !== "Select your country") formData.append("country", country);
      if (bodyShape) formData.append("body_shape", bodyShape);
      if (skinTone) formData.append("skin_tone", skinTone);
      
      // Add image if uploaded
      if (uploadedPhotos.length > 0) {
        formData.append("image", uploadedPhotos[0]);
      }

      // Send request to backend
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      // Success!
      const result = data as SignupResponse;
      setSuccessMessage(result.message);
      
      if (result.clip_insights) {
        setClipInsights(result.clip_insights);
      }

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 2000);

    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Unable to connect to server. Please make sure the backend is running on http://localhost:8000");
      } else {
        setError(err instanceof Error ? err.message : "An error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-yellow-50 to-rose-50">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="mx-auto max-w-2xl relative z-10">
        {/* Header with Animation */}
        <div className="mb-6 sm:mb-8 text-center animate-fade-in-down">
          <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-yellow-600 bg-clip-text text-transparent">
            Create Your Account
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-4 sm:px-0">
            Start your personalized styling journey with LibaasAI
          </p>
        </div>

        {/* Form with Glass Morphism */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xl p-5 sm:p-6 lg:p-8 shadow-2xl border border-white/20 animate-fade-in-up"
        >
          {/* Full Name */}
          <div className="mb-5 sm:mb-6 group">
            <label
              htmlFor="fullName"
              className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-emerald-600"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-xl border-2 border-gray-200 pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="mb-5 sm:mb-6 group">
            <label
              htmlFor="email"
              className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-emerald-600"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                className="w-full rounded-xl border-2 border-gray-200 pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5 sm:mb-6 group">
            <label
              htmlFor="password"
              className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-emerald-600"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full rounded-xl border-2 border-gray-200 pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 bg-gray-50/50 hover:bg-white"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="mb-5 sm:mb-6">
            <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {genderOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setGender(option.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 ${
                    gender === option.id
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-yellow-50 shadow-md scale-105"
                      : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  <div className="scale-75 sm:scale-100">
                    {option.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hide Optional Details Toggle */}
          <button
            type="button"
            onClick={() => setShowOptionalDetails(!showOptionalDetails)}
            className="mb-5 sm:mb-6 w-full flex items-center justify-between rounded-xl bg-gradient-to-r from-yellow-50 to-emerald-50 p-3 sm:p-4 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-2 border-yellow-200/50"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-gray-900">
                  {showOptionalDetails ? "Hide" : "Show"} Optional Details
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Get better AI recommendations
                </p>
              </div>
            </div>
            <svg
              className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-700 transition-transform duration-300 ${
                showOptionalDetails ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Optional Details */}
          {showOptionalDetails && (
            <div className="mb-5 sm:mb-6 space-y-4 sm:space-y-6 rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 border-2 border-gray-100 animate-fade-in">
              {/* Height */}
              <div className="group">
                <label
                  htmlFor="height"
                  className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-emerald-600"
                >
                  Height (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Enter your height in cm"
                    className="w-full rounded-xl border-2 border-gray-200 pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 bg-white hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="group">
                <label
                  htmlFor="country"
                  className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-emerald-600"
                >
                  Country (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 bg-white hover:border-gray-300 appearance-none cursor-pointer"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Body Shape */}
              <div>
                <label className="mb-3 block text-xs sm:text-sm font-semibold text-gray-700">
                  Body Shape (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
                  {bodyShapes.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setBodyShape(shape.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl border-2 p-2.5 sm:p-3 transition-all duration-200 ${
                        bodyShape === shape.id
                          ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-yellow-50 shadow-md scale-105"
                          : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-lg hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="scale-90 sm:scale-100">
                        {shape.icon}
                      </div>
                      <span className="text-xs font-semibold text-gray-900 text-center leading-tight">
                        {shape.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <label className="mb-3 block text-xs sm:text-sm font-semibold text-gray-700">
                  Skin Tone (Optional)
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-5">
                  {skinTones.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setSkinTone(tone.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl border-2 p-2.5 sm:p-3 transition-all duration-200 ${
                        skinTone === tone.id
                          ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-yellow-50 shadow-md scale-105"
                          : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-lg hover:-translate-y-0.5"
                      }`}
                    >
                      <div
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-white shadow-md ring-2 ring-gray-200"
                        style={{ backgroundColor: tone.color }}
                      ></div>
                      <span className="text-xs font-semibold text-gray-900">
                        {tone.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Photos */}
              <div>
                <label className="mb-3 block text-xs sm:text-sm font-semibold text-gray-700">
                  Upload Your Photos (Optional)
                </label>
                <label className="group flex min-h-[120px] sm:min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 sm:p-6 transition-all duration-200 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50/50 hover:to-yellow-50/50 hover:shadow-lg">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-yellow-400 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
                    <svg
                      className="relative mb-2 sm:mb-3 h-10 w-10 sm:h-12 sm:w-12 text-gray-400 group-hover:text-emerald-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 text-center group-hover:text-emerald-600 transition-colors">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  {uploadedPhotos.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-xs font-semibold text-emerald-700">
                        {uploadedPhotos.length} photo(s) selected
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="mb-5 sm:mb-6">
            <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-0.5 sm:mt-1 h-4 w-4 rounded-md border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-gray-700">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 p-4 animate-shake">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-5 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 p-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">{successMessage}</p>
                  <p className="mt-1 text-xs text-emerald-600">Redirecting to login...</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights Display */}
          {clipInsights && (
            <div className="mb-5 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 p-4 animate-fade-in">
              <h4 className="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Style Analysis
              </h4>
              <p className="text-xs text-yellow-700">
                Detected: <span className="font-bold capitalize">{clipInsights.top_label}</span>
                <span className="ml-2 text-yellow-600">({Math.round(clipInsights.top_confidence * 100)}% confidence)</span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!agreeToTerms || !fullName || !email || !password || !gender || isLoading}
            className="mb-3 sm:mb-4 w-full relative group rounded-xl py-3 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-300 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-yellow-500 transition-all duration-300 ${!agreeToTerms || !fullName || !email || !password || !gender || isLoading ? 'opacity-40' : 'group-hover:scale-105'}`}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </div>
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-transparent bg-gradient-to-r from-emerald-600 to-yellow-600 bg-clip-text hover:from-emerald-500 hover:to-yellow-500 transition-all"
              >
                Sign In →
              </Link>
            </p>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-6 sm:mt-8 text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap">
            <p className="flex items-center gap-2 text-gray-600">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="font-medium">Secure & Private</span>
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="font-medium">SSL Encrypted</span>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-4px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(4px);
          }
        }
        
        :global(.animate-blob) {
          animation: blob 7s infinite;
        }
        
        :global(.animate-shake) {
          animation: shake 0.5s ease-in-out;
        }
        
        :global(.animation-delay-2000) {
          animation-delay: 2s;
        }
        
        :global(.animation-delay-4000) {
          animation-delay: 4s;
        }
        
        :global(.animate-fade-in-down) {
          animation: fade-in-down 0.6s ease-out;
        }
        
        :global(.animate-fade-in-up) {
          animation: fade-in-up 0.6s ease-out 0.2s both;
        }
        
        :global(.animate-fade-in) {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
}

