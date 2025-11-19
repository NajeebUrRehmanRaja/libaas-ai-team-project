"use client";

import { useState } from "react";
import Link from "next/link";

export default function GetStartedPage() {
  const [selectedFeature, setSelectedFeature] = useState("wardrobe");
  const [selectedCameraWork, setSelectedCameraWork] = useState("standard");
  const [extraPrompt, setExtraPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const features = [
    {
      id: "wardrobe",
      name: "Smart Wardrobe Upload",
      description: "Upload and catalog your wardrobe items with AI recognition",
      icon: "📦",
      badge: "Featured",
    },
    {
      id: "outfit",
      name: "Outfit Generator",
      description: "AI-powered outfit suggestions for any occasion",
      icon: "✨",
      badge: null,
    },
    {
      id: "matching",
      name: "Product Matching",
      description: "Find wardrobe items that match with new products",
      icon: "🎯",
      badge: null,
    },
    {
      id: "style",
      name: "Style Analysis",
      description: "Personalized style recommendations based on your profile",
      icon: "🎨",
      badge: "New",
    },
  ];

  const cameraWorkOptions = [
    "Standard view",
    "Close-up detail",
    "Full outfit view",
    "Multiple angles",
    "Accessory focus",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-white">
                LibassAI Playground
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-lg bg-slate-700/50 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors">
                Save
              </button>
              <button className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-sm font-medium text-white hover:from-emerald-500 hover:to-emerald-400 transition-all">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Feature Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button className="px-4 py-2 text-sm font-semibold text-white border-b-2 border-emerald-400">
              Featured
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Wardrobe
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Outfit
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Style
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Matching
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`relative rounded-xl p-5 text-left transition-all ${
                  selectedFeature === feature.id
                    ? "bg-gradient-to-br from-emerald-600/20 to-yellow-500/20 border-2 border-emerald-500"
                    : "bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                }`}
              >
                {feature.badge && (
                  <span className="absolute top-3 right-3 rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-slate-900">
                    {feature.badge}
                  </span>
                )}
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  {feature.name}
                </h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-emerald-600/20 p-2">
                  <svg
                    className="h-5 w-5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Input Image
                </h2>
              </div>

              <div className="relative">
                {!uploadedImage ? (
                  <label className="flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 transition-all hover:border-emerald-500 hover:bg-slate-900">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-slate-600 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-lg font-medium text-white mb-2">
                        Drop Image Here
                      </p>
                      <p className="text-sm text-slate-400 mb-4">- or -</p>
                      <span className="inline-block rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
                        Click to Upload
                      </span>
                    </div>
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-[400px] object-cover rounded-xl"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-3 right-3 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-900 transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
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
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button className="rounded-lg bg-slate-700/50 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </button>
                <button className="rounded-lg bg-slate-700/50 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <button className="rounded-lg bg-slate-700/50 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6">
              {/* Camera Work */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-lg bg-yellow-500/20 p-2">
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <label className="text-sm font-semibold text-white">
                    Camera Work
                  </label>
                </div>
                <select
                  value={selectedCameraWork}
                  onChange={(e) => setSelectedCameraWork(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {cameraWorkOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Extra Prompt */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-600/20 p-2">
                    <svg
                      className="h-4 w-4 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <label className="text-sm font-semibold text-white">
                    Extra Prompt
                    <span className="ml-2 text-xs text-slate-400">
                      (optional, appended at end)
                    </span>
                  </label>
                </div>
                <textarea
                  value={extraPrompt}
                  onChange={(e) => setExtraPrompt(e.target.value)}
                  placeholder="e.g., Focus on colors, Include accessories, Formal occasion"
                  rows={4}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
              </div>

              {/* Advanced Settings */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Advanced Settings
                </summary>
                <div className="mt-4 space-y-4 pl-6">
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">
                      AI Confidence Level
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="75"
                      className="w-full"
                    />
                  </div>
                </div>
              </details>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-4 text-lg font-semibold text-white hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Generating...
                </span>
              ) : (
                "Generate"
              )}
            </button>
          </div>

          {/* Right Panel - Output */}
          <div className="space-y-6">
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-yellow-500/20 p-2">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Output Image
                </h2>
              </div>

              <div className="flex min-h-[600px] items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50">
                {!uploadedImage ? (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-16 w-16 text-slate-700 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-slate-500">
                      Upload an image and click Generate to see results
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-emerald-400 animate-pulse"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-white font-medium mb-2">Ready to Process</p>
                    <p className="text-slate-400 text-sm">
                      Click the Generate button to analyze your wardrobe item
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-slate-700 p-2">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Status</h3>
              </div>
              <div className="mt-3 rounded-lg bg-slate-900 p-3">
                <p className="text-sm text-slate-400 font-mono">
                  {isGenerating
                    ? "Processing your image..."
                    : uploadedImage
                    ? "Image uploaded successfully. Ready to generate."
                    : "Waiting for image upload..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

