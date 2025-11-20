"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-4 sm:px-0">
            Start your personalized styling journey with LibaasAI
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl sm:rounded-2xl bg-white p-5 sm:p-6 lg:p-8 shadow-sm border border-gray-200"
        >
          {/* Full Name */}
          <div className="mb-5 sm:mb-6">
            <label
              htmlFor="fullName"
              className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Email Address */}
          <div className="mb-5 sm:mb-6">
            <label
              htmlFor="email"
              className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Password */}
          <div className="mb-5 sm:mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Gender */}
          <div className="mb-5 sm:mb-6">
            <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {genderOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setGender(option.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-lg border-2 p-3 sm:p-4 transition-all ${
                    gender === option.id
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="scale-75 sm:scale-100">
                    {option.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
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
            className="mb-5 sm:mb-6 w-full flex items-center justify-between rounded-lg bg-yellow-50 p-3 sm:p-4 text-left transition-all hover:bg-yellow-100"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">✨</span>
              <div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {showOptionalDetails ? "Hide" : "Show"} Optional Details
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Get better AI recommendations
                </p>
              </div>
            </div>
            <svg
              className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-600 transition-transform ${
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
            <div className="mb-5 sm:mb-6 space-y-4 sm:space-y-6 rounded-lg bg-gray-50 p-4 sm:p-6">
              {/* Height */}
              <div>
                <label
                  htmlFor="height"
                  className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900"
                >
                  Height (Optional)
                </label>
                <input
                  type="text"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter your height in cm"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900"
                >
                  Country (Optional)
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Body Shape */}
              <div>
                <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                  Body Shape (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
                  {bodyShapes.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setBodyShape(shape.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-lg border-2 p-2.5 sm:p-3 transition-all ${
                        bodyShape === shape.id
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="scale-90 sm:scale-100">
                        {shape.icon}
                      </div>
                      <span className="text-xs font-medium text-gray-900 text-center leading-tight">
                        {shape.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                  Skin Tone (Optional)
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-5">
                  {skinTones.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setSkinTone(tone.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-lg border-2 p-2.5 sm:p-3 transition-all ${
                        skinTone === tone.id
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: tone.color }}
                      ></div>
                      <span className="text-xs font-medium text-gray-900">
                        {tone.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Photos */}
              <div>
                <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                  Upload Your Photos (Optional)
                </label>
                <label className="flex min-h-[120px] sm:min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 sm:p-6 transition-all hover:border-emerald-400 hover:bg-gray-50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <svg
                    className="mb-2 sm:mb-3 h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
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
                  <p className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                    Click to upload or drag and drop
                  </p>
                  {uploadedPhotos.length > 0 && (
                    <p className="mt-2 text-xs text-emerald-600">
                      {uploadedPhotos.length} photo(s) selected
                    </p>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="mb-5 sm:mb-6">
            <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-0.5 sm:mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs sm:text-sm text-gray-700">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!agreeToTerms || !fullName || !email || !password || !gender}
            className="mb-3 sm:mb-4 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-yellow-500 py-2.5 sm:py-3 text-base sm:text-lg font-semibold text-white hover:from-emerald-500 hover:to-yellow-400 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="text-center text-xs sm:text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Login here
            </Link>
          </p>
        </form>

        {/* Footer Note */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600"
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
            Secure & Private
          </p>
        </div>
      </div>
    </div>
  );
}

