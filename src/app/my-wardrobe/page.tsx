"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WardrobeItem {
  id: string;
  name: string;
  image_url: string;
  tags: string[];
  category: string;
  color?: string;
  style?: string;
  pattern?: string;
  sub_category?: string;
}

export default function MyWardrobePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStyle, setSelectedStyle] = useState("All Styles");
  const [isDragging, setIsDragging] = useState(false);
  
  // Backend integration state
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const categories = [
    "All Categories",
    "Tops & Kurtas",
    "Bottoms & Shalwar",
    "Dresses & Lehengas",
    "Dupattas & Scarves",
    "Shoes & Sandals",
    "Accessories & Bags",
    "Jewelry",
    "Cultural / Special",
    "Uncategorized", // Show uncategorized items
  ];

  const styles = ["All Styles", "Ethnic", "Western", "Fusion", "Formal", "Casual"];

  // Fetch wardrobe items from backend
  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        setLoading(true);
        
        // Get userId from localStorage/sessionStorage (stored as JSON object)
        let userIdFromStorage = null;
        
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            userIdFromStorage = userObj.id;
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
        
        if (!userIdFromStorage) {
          setError("Please sign in to view your wardrobe");
          setLoading(false);
          return;
        }
        
        setUserId(userIdFromStorage);
        
        // Fetch wardrobe items
        const response = await fetch(`http://localhost:8000/wardrobe/items/${userIdFromStorage}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch wardrobe items");
        }
        
        const data = await response.json();
        setWardrobeItems(data.items || []);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching wardrobe:", err);
        setError(err.message || "Failed to load wardrobe");
        setLoading(false);
      }
    };
    
    fetchWardrobe();
  }, []);

  // File upload handlers
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !userId) return;
    
    setUploading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", userId);
        
        const response = await fetch("http://localhost:8000/wardrobe/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        
        return await response.json();
      });
      
      const results = await Promise.all(uploadPromises);
      
      // Add new items to wardrobe
      const newItems = results.map(r => r.item);
      setWardrobeItems(prev => [...newItems, ...prev]);
      
      setSuccessMessage(`Successfully uploaded ${files.length} item(s) and auto-categorized!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to upload items");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!userId || !confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/wardrobe/items/${itemId}?user_id=${userId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      
      // Remove from UI
      setWardrobeItems(prev => prev.filter(item => item.id !== itemId));
      setSuccessMessage("Item deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete item");
    }
  };

  const filteredItems = wardrobeItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesStyle = selectedStyle === "All Styles" || item.tags?.includes(selectedStyle.toLowerCase());
    return matchesSearch && matchesCategory && matchesStyle;
  });

  const groupedItems = categories.reduce((acc, category) => {
    if (category !== "All Categories") {
      acc[category] = filteredItems.filter((item) => item.category === category);
    }
    return acc;
  }, {} as Record<string, WardrobeItem[]>);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Show loading state
  if (loading && wardrobeItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your wardrobe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-emerald-800">{successMessage}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-md bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-b-4 border-yellow-400 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-white text-emerald-600 font-bold text-base sm:text-lg lg:text-xl shadow-lg">
                LA
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-white">My Wardrobe</h1>
                <p className="text-[10px] sm:text-xs lg:text-sm text-emerald-100">AI-powered digital closet</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
              <Link
                href="/profile"
                className="rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 text-[10px] sm:text-xs lg:text-sm font-semibold text-white hover:bg-white/30 transition-all"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:py-8">
        {/* Filters Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10 bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 lg:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Filter & Search</h2>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs sm:text-sm font-bold text-emerald-700">{filteredItems.length}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:w-auto min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3 py-2.5 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-auto min-w-[140px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3 py-2.5 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
              >
                {styles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Search</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, color, style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-700 placeholder-gray-400 bg-white hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div
          className={`mb-6 sm:mb-8 lg:mb-12 rounded-lg sm:rounded-xl border-2 border-dashed bg-white p-5 sm:p-6 lg:p-8 xl:p-12 text-center transition-all ${
            isDragging
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-300 hover:border-emerald-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-sm font-semibold text-gray-700">
                Uploading and analyzing with Fashion-CLIP AI...
              </p>
              <p className="text-xs text-gray-500 mt-2">This may take a few moments</p>
            </div>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="mb-2 text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
                Drag & Drop to Upload
              </h3>
              <p className="mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm text-gray-600 px-2 sm:px-4">
                Drop multiple images to add to your wardrobe. Fashion-CLIP AI will auto-categorize them!
              </p>
              <input
                type="file"
                id="wardrobe-file-upload"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label
                htmlFor="wardrobe-file-upload"
                className="inline-block cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <span className="hidden sm:inline">Select Files to Upload</span>
                <span className="sm:hidden">Select Files</span>
              </label>
            </>
          )}
        </div>

        {/* Wardrobe Items by Category */}
        {Object.entries(groupedItems).map(([category, items]) => (
          items.length > 0 && (
            <div key={category} className="mb-8 sm:mb-10 lg:mb-14">
              {/* Category Header */}
              <div className="mb-4 sm:mb-5 lg:mb-6 pb-3 border-b-2 border-emerald-600">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{category}</h2>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                      Curated items in {category.toLowerCase()}
                    </p>
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-lg sm:rounded-xl bg-white border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-500 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.classList.add('bg-gradient-to-br', 'from-emerald-100', 'to-yellow-100', 'flex', 'items-center', 'justify-center');
                            parent.innerHTML += '<svg class="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>';
                          }
                        }}
                      />
                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button 
                          className="rounded-lg bg-white/95 backdrop-blur-sm px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-md hover:shadow-lg transition-all border border-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit functionality - can be added later
                          }}
                        >
                          <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          className="rounded-lg bg-white/95 backdrop-blur-sm px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-semibold text-red-600 hover:bg-red-50 shadow-md hover:shadow-lg transition-all border border-red-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                        >
                          <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-3 sm:p-4 lg:p-5 bg-white">
                      <h3 className="mb-1 sm:mb-1.5 font-bold text-gray-900 text-xs sm:text-sm lg:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                        {item.name}
                      </h3>
                      <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs text-gray-500 font-mono">
                        ID: {item.id.substring(0, 8)}...
                      </p>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {item.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-gradient-to-r from-emerald-50 to-yellow-50 border border-emerald-200 px-2 py-1 text-[9px] sm:text-[10px] lg:text-xs font-semibold text-emerald-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Show message if wardrobe is empty */}
        {wardrobeItems.length === 0 && !loading && (
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-yellow-50 border-2 border-emerald-200 p-8 sm:p-10 lg:p-16 text-center">
              <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-emerald-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your Wardrobe is Empty</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Upload your first clothing item and let Fashion-CLIP AI categorize it automatically!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="font-semibold">Scroll up to upload</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

