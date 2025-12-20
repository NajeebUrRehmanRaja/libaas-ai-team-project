"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isViewingPhoto, setIsViewingPhoto] = useState(false);

  // Backend state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");

  // User profile data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [country, setCountry] = useState("");
  const [height, setHeight] = useState("");
  const [bodyShape, setBodyShape] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [clipInsights, setClipInsights] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  // Fetch user profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Get userId from URL params or storage
        let userIdFromUrl = searchParams.get("userId");
        let userIdFromStorage =
          localStorage.getItem("userId") ||
          sessionStorage.getItem("userId");

        const currentUserId = userIdFromUrl || userIdFromStorage;

        if (!currentUserId) {
          setError("No user ID found. Please log in again.");
          router.push("/signin");
          return;
        }

        setUserId(currentUserId);

        // Fetch profile data from backend
        const response = await fetch(`http://127.0.0.1:8000/auth/profile/${currentUserId}`, {
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();

        // Update state with fetched data
        setFullName(data.name || "");
        setEmail(data.email || "");
        setGender(data.gender || "male");
        setCountry(data.country || "");
        setHeight(data.height || "");
        setBodyShape(data.body_shape || "");
        setSkinTone(data.skin_tone || "");
        setProfileImage(data.image_url || "");
        setClipInsights(data.clip_insights || null);
        setRecommendations(data.recommendations || null);

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [searchParams, router]);

  // Handle image load error
  const handleImageError = () => {
    console.error("Failed to load profile image:", profileImage);
    // You might want to show a toast here, or just let it fall back 
    // For now we'll keep the profileImage state but maybe show an error indicator?
    // Or clear it so it shows placeholder? 
    // Let's NOT clear it to avoid flickering loops if URL is persistently bad
    // Instead, we can rely on the rendering logic below or add a state 'imageLoadError'
  };

  // Wardrobe summary data (reset - no dummy data)
  const wardrobeSummary = [
    { count: 0, label: "Tops", color: "bg-emerald-100 text-emerald-700" },
    { count: 0, label: "Bottoms", color: "bg-yellow-100 text-yellow-700" },
    { count: 0, label: "Shoes", color: "bg-purple-100 text-purple-700" },
    { count: 0, label: "Dresses", color: "bg-pink-100 text-pink-700" },
    { count: 0, label: "Total Items", color: "bg-blue-100 text-blue-700" },
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

  // Parse AI insights from CLIP data
  const aiInsights = clipInsights && clipInsights.all_predictions?.length > 0 ? {
    // Top 5 predictions as style recommendations
    topPredictions: clipInsights.all_predictions
      .slice(0, 5)
      .map((p: any) => ({
        label: p.label,
        score: (p.score * 100).toFixed(1)
      })),
    // Top prediction
    topLabel: clipInsights.top_label || "No analysis available",
    topConfidence: clipInsights.top_confidence
      ? (clipInsights.top_confidence * 100).toFixed(1)
      : "0",
    // For display in sections
    colors: clipInsights.all_predictions.slice(0, 3).map((p: any) => p.label),
    fits: clipInsights.all_predictions.slice(3, 5).map((p: any) => p.label),
    patterns: clipInsights.all_predictions.slice(5, 7).map((p: any) => p.label),
  } : {
    topPredictions: [],
    topLabel: "No analysis available",
    topConfidence: "0",
    colors: ["Upload photo during signup for AI insights"],
    fits: ["Upload photo during signup for AI insights"],
    patterns: ["Upload photo during signup for AI insights"],
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

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "personal-info", label: "Personal Info", icon: "📝" },
    { id: "privacy", label: "Privacy & Settings", icon: "🔒" },
    { id: "ai-insights", label: "AI Style Insights", icon: "🤖" },
    { id: "quick-actions", label: "Quick Actions", icon: "⚡" },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !userId) return;

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('user_id', userId);

      const response = await fetch('http://127.0.0.1:8000/auth/update-profile-photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      setProfileImage(data.image_url);
      setPhotoFile(null);
      alert('Profile photo updated successfully!');
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      alert(err.message || 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("userId");

      // Notify Navbar to update
      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/signin"
            className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-yellow-500 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-yellow-400 transition-all"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 rounded-lg bg-white/95 backdrop-blur-sm p-3 shadow-xl border border-white/20"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-0 left-0 h-screen lg:h-auto
            w-64 lg:w-72 flex-shrink-0
            bg-white/95 backdrop-blur-sm rounded-none lg:rounded-2xl
            shadow-xl border border-white/20
            transition-transform duration-300 ease-in-out z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}>
            <div className="p-6">
              {/* Profile Header in Sidebar */}
              <div className="mb-6 text-center pb-6 border-b border-gray-200">
                <div className="relative mb-4 mx-auto w-24 h-24">
                  {/* Profile Image (Click to View) */}
                  <div
                    className={`h-full w-full rounded-full overflow-hidden shadow-lg border-4 border-white ${profileImage ? 'cursor-zoom-in hover:opacity-90' : ''} transition-all`}
                    onClick={() => profileImage && setIsViewingPhoto(true)}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log("Image load failed, reverting to placeholder");
                          setProfileImage(""); // Revert to initials placeholder
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-emerald-700 to-yellow-400 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {fullName ? fullName.split(" ").map(n => n[0]).join("") : "?"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Edit Badge (Click to Upload) */}
                  <label
                    htmlFor="profile-photo-input"
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors group"
                    title="Change Profile Photo"
                  >
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                  <input
                    id="profile-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                {photoFile && (
                  <button
                    onClick={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="mb-2 px-3 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-full disabled:opacity-50 transition-colors"
                  >
                    {isUploadingPhoto ? 'Uploading...' : 'Save Photo'}
                  </button>
                )}
                <h2 className="text-lg font-bold text-gray-900">{fullName || "Guest User"}</h2>
                <p className="text-sm text-gray-600">{email || "No email"}</p>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSection === item.id
                      ? "bg-gradient-to-r from-emerald-700 to-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Sign Out Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-medium text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Full Screen Image Modal */}
          {isViewingPhoto && profileImage && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsViewingPhoto(false)}>
              <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <button
                  onClick={() => setIsViewingPhoto(false)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={profileImage}
                  alt={fullName}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm p-5 sm:p-6 lg:p-8 shadow-xl border border-white/20">
                <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900">Profile Overview</h2>

                {/* Wardrobe Summary */}
                <div className="mb-6">
                  <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Wardrobe Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
                    {wardrobeSummary.map((item, index) => (
                      <div
                        key={index}
                        className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center ${item.color}`}
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">{item.count}</div>
                        <div className="text-xs sm:text-sm font-medium">{item.label}</div>
                      </div>
                    ))}
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
            )}

            {/* Privacy & Settings Section */}
            {activeSection === "privacy" && (
              <div className="rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm p-5 sm:p-6 lg:p-8 shadow-xl border border-white/20">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Privacy & Settings
                </h2>

                {/* Image Processing Toggle */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">Image Processing</h3>
                    <p className="text-sm text-gray-600">
                      Allow AI to analyze photos for recommendations
                    </p>
                  </div>
                  <button
                    onClick={() => setImageProcessing(!imageProcessing)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${imageProcessing ? "bg-gradient-to-r from-emerald-700 to-emerald-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${imageProcessing ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Sign Out
                  </button>
                  <button className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Personal Info Section */}
            {activeSection === "personal-info" && (
              <div className="rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm p-5 sm:p-6 lg:p-8 shadow-xl border border-white/20">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Personal Information
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
                    <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                      Full Name
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    ) : (
                      <div className="rounded-lg bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900">
                        {fullName}
                      </div>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                      Email Address
                    </label>
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900">
                      {email}
                    </div>
                  </div>

                  {/* Gender */}
                  {isEditingProfile && (
                    <div>
                      <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                        Gender
                      </label>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {genderOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setGender(option.id)}
                            className={`rounded-lg border-2 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all ${gender === option.id
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
                      <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                        Country
                      </label>
                      <select
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
                  )}

                  {/* Height */}
                  {isEditingProfile && (
                    <div>
                      <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                        Height (cm)
                      </label>
                      <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  )}

                  {/* Body Shape */}
                  {isEditingProfile && (
                    <div>
                      <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                        Body Shape
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
                        {bodyShapeOptions.map((shape) => (
                          <button
                            key={shape.id}
                            type="button"
                            onClick={() => setBodyShape(shape.id)}
                            className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-lg border-2 p-2.5 sm:p-3 transition-all ${bodyShape === shape.id
                              ? "border-emerald-700 bg-gradient-to-r from-emerald-700/10 to-yellow-400/10"
                              : "border-gray-200 bg-white hover:border-emerald-600"
                              }`}
                          >
                            <span className="text-xl sm:text-2xl">{shape.icon}</span>
                            <span className="text-xs font-medium text-gray-900 text-center leading-tight">
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
                      <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                        Skin Tone
                      </label>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-5">
                        {skinToneOptions.map((tone) => (
                          <button
                            key={tone.id}
                            type="button"
                            onClick={() => setSkinTone(tone.id)}
                            className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-lg border-2 p-2.5 sm:p-3 transition-all ${skinTone === tone.id
                              ? "border-yellow-400 bg-gradient-to-r from-yellow-400/10 to-emerald-700/10"
                              : "border-gray-200 bg-white hover:border-yellow-400"
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
                  )}

                  {/* Save Button */}
                  {isEditingProfile && (
                    <button className="w-full rounded-lg bg-gradient-to-r from-emerald-700 to-yellow-400 py-3 text-sm font-semibold text-white hover:from-emerald-600 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg">
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* AI Style Insights Section */}
            {activeSection === "ai-insights" && (
              <div className="rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm p-5 sm:p-6 lg:p-8 shadow-xl border border-white/20">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                  {/* User Profile Attributes */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Your Profile Details
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        These details help our AI generate personalized looks for you
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Gender */}
                      <div className="rounded-lg bg-white p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Gender</p>
                            <p className="text-sm font-bold text-gray-900 capitalize">{gender || "Not specified"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Height */}
                      {height && (
                        <div className="rounded-lg bg-white p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Height</p>
                              <p className="text-sm font-bold text-gray-900">{height} cm</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Body Shape */}
                      {bodyShape && (
                        <div className="rounded-lg bg-white p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                              <span className="text-lg">⏳</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Body Shape</p>
                              <p className="text-sm font-bold text-gray-900 capitalize">{bodyShape}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Skin Tone */}
                      {skinTone && (
                        <div className="rounded-lg bg-white p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Skin Tone</p>
                              <p className="text-sm font-bold text-gray-900 capitalize">{skinTone}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Country */}
                      {country && (
                        <div className="rounded-lg bg-white p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Country</p>
                              <p className="text-sm font-bold text-gray-900">{country}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personalized Recommendations */}
                  {recommendations && (
                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        🎯 Personalized Style Recommendations
                      </h3>

                      {/* Summary */}
                      {recommendations.summary && (
                        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-yellow-50 border border-emerald-200">
                          <p className="text-sm text-gray-700 italic">
                            {recommendations.summary}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Best Fits */}
                        {recommendations.best_fits?.length > 0 && (
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                              <span>✨</span> Best Fits for You
                            </h4>
                            <ul className="space-y-2">
                              {recommendations.best_fits.map((fit: string, idx: number) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-emerald-600">•</span>
                                  {fit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Best Colors */}
                        {recommendations.best_colors?.length > 0 && (
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <h4 className="text-sm font-bold text-yellow-700 mb-3 flex items-center gap-2">
                              <span>🎨</span> Your Perfect Colors
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {recommendations.best_colors.map((color: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Complementary Colors */}
                        {recommendations.complementary_colors?.length > 0 && (
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <h4 className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
                              <span>💎</span> Complementary Shades
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {recommendations.complementary_colors.map((color: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Jewelry Metals */}
                        {recommendations.jewelry_metals && (
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <h4 className="text-sm font-bold text-pink-700 mb-3 flex items-center gap-2">
                              <span>💍</span> Jewelry Metals
                            </h4>
                            <p className="text-sm text-gray-700">{recommendations.jewelry_metals}</p>
                          </div>
                        )}
                      </div>

                      {/* Pro Tips */}
                      {recommendations.pro_tips?.length > 0 && (
                        <div className="mt-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200">
                          <h4 className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
                            <span>💡</span> Pro Styling Tips
                          </h4>
                          {recommendations.pro_tips.map((tip: string, idx: number) => (
                            <p key={idx} className="text-sm text-gray-700 mb-2 last:mb-0">
                              {tip}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Avoid */}
                      {recommendations.avoid?.length > 0 && (
                        <div className="mt-4 rounded-lg bg-red-50 p-4 border border-red-200">
                          <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                            <span>⚠️</span> Styles to Avoid
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {recommendations.avoid.slice(0, 6).map((item: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Top Prediction */}
                  {clipInsights && (
                    <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-yellow-50 p-6 border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          AI Image Analysis
                        </h3>
                        <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-full">
                          {aiInsights.topConfidence}% Confidence
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 capitalize">
                        {aiInsights.topLabel}
                      </p>
                    </div>
                  )}

                  {/* All Predictions */}
                  {clipInsights && aiInsights.topPredictions.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        AI Style Predictions
                      </h3>
                      <div className="space-y-3">
                        {aiInsights.topPredictions.map((pred: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                            <span className="text-sm font-medium text-gray-900 capitalize flex-1">
                              {pred.label}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-emerald-600 to-yellow-500 h-2 rounded-full"
                                  style={{ width: `${pred.score}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                                {pred.score}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No insights message */}
                  {!clipInsights && (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No AI Insights Available</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload a photo during signup to get personalized AI style insights
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions Section */}
            {activeSection === "quick-actions" && (
              <div className="rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm p-5 sm:p-6 lg:p-8 shadow-xl border border-white/20">
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
                    <span className="text-sm text-gray-600">Total Items:</span>
                    <span className="text-2xl font-bold text-gray-900">42</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Last upload:</span> Gold Dupatta
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading your profile...</p>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}

