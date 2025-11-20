"use client";

import { useState } from "react";
import Link from "next/link";

interface WardrobeItem {
  id: string;
  name: string;
  image: string;
  tags: string[];
  category: string;
}

export default function MyWardrobePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStyle, setSelectedStyle] = useState("All Styles");
  const [isDragging, setIsDragging] = useState(false);

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
  ];

  const styles = ["All Styles", "Ethnic", "Western", "Fusion", "Formal", "Casual"];

  const wardrobeItems: WardrobeItem[] = [
    // Tops & Kurtas
    {
      id: "360f3w",
      name: "Emerald Green Kurta",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=400&fit=crop",
      tags: ["top", "ethnic", "emerald"],
      category: "Tops & Kurtas",
    },
    {
      id: "o8ufm1",
      name: "Pink Embroidered Kurta",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop",
      tags: ["top", "ethnic", "pink"],
      category: "Tops & Kurtas",
    },
    {
      id: "grt92k",
      name: "White Cotton Shirt",
      image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=300&h=400&fit=crop",
      tags: ["top", "western", "white"],
      category: "Tops & Kurtas",
    },
    {
      id: "ew4qbi",
      name: "Navy Blue Tunic",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&h=400&fit=crop",
      tags: ["top", "fusion", "navy"],
      category: "Tops & Kurtas",
    },
    {
      id: "kr8m2n",
      name: "Red Silk Kurta",
      image: "https://images.unsplash.com/photo-1610030469851-358f0f3b0a8b?w=300&h=400&fit=crop",
      tags: ["top", "ethnic", "red"],
      category: "Tops & Kurtas",
    },

    // Bottoms & Shalwar
    {
      id: "z7c3lt",
      name: "White Shalwar",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      tags: ["bottom", "ethnic", "white"],
      category: "Bottoms & Shalwar",
    },
    {
      id: "s22exn",
      name: "Black Palazzo Pants",
      image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=300&h=400&fit=crop",
      tags: ["bottom", "fusion", "black"],
      category: "Bottoms & Shalwar",
    },
    {
      id: "g9pjju",
      name: "Beige Straight Pants",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=400&fit=crop",
      tags: ["bottom", "casual", "beige"],
      category: "Bottoms & Shalwar",
    },
    {
      id: "571lyt",
      name: "Blue Denim Jeans",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop",
      tags: ["bottom", "western", "blue"],
      category: "Bottoms & Shalwar",
    },

    // Dresses & Lehengas
    {
      id: "b5qm2r",
      name: "Royal Blue Lehenga",
      image: "https://images.unsplash.com/photo-1583391733941-8b1e7e1c3c9a?w=300&h=400&fit=crop",
      tags: ["dress", "ethnic", "blue"],
      category: "Dresses & Lehengas",
    },
    {
      id: "xmnvxu",
      name: "Red Bridal Lehenga",
      image: "https://images.unsplash.com/photo-1606800052052-d3d643374c6e?w=300&h=400&fit=crop",
      tags: ["dress", "ethnic", "red"],
      category: "Dresses & Lehengas",
    },
    {
      id: "0n2xoo",
      name: "Floral Maxi Dress",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
      tags: ["dress", "western", "multicolor"],
      category: "Dresses & Lehengas",
    },
    {
      id: "0oc47l",
      name: "Black Evening Gown",
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop",
      tags: ["dress", "formal", "black"],
      category: "Dresses & Lehengas",
    },

    // Dupattas & Scarves
    {
      id: "dge6cu",
      name: "Gold Embroidered Dupatta",
      image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=300&h=400&fit=crop",
      tags: ["dupatta", "ethnic", "gold"],
      category: "Dupattas & Scarves",
    },
    {
      id: "8e17yq",
      name: "Maroon Net Dupatta",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop",
      tags: ["dupatta", "ethnic", "maroon"],
      category: "Dupattas & Scarves",
    },
    {
      id: "y7xxur",
      name: "Silk Floral Scarf",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&h=400&fit=crop",
      tags: ["dupatta", "fusion", "multicolor"],
      category: "Dupattas & Scarves",
    },

    // Shoes & Sandals
    {
      id: "0xw9jt",
      name: "Black Heels",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop",
      tags: ["shoe", "formal", "black"],
      category: "Shoes & Sandals",
    },
    {
      id: "koensz",
      name: "Gold Khussa",
      image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=400&fit=crop",
      tags: ["shoe", "ethnic", "gold"],
      category: "Shoes & Sandals",
    },
    {
      id: "vfbfcx",
      name: "White Sneakers",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
      tags: ["shoe", "casual", "white"],
      category: "Shoes & Sandals",
    },
    {
      id: "r6csh6",
      name: "Brown Sandals",
      image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=300&h=400&fit=crop",
      tags: ["shoe", "casual", "brown"],
      category: "Shoes & Sandals",
    },

    // Accessories & Bags
    {
      id: "s9jf3p",
      name: "Leather Handbag",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop",
      tags: ["accessory", "formal", "brown"],
      category: "Accessories & Bags",
    },
    {
      id: "77a6eh",
      name: "Gold Watch",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=400&fit=crop",
      tags: ["accessory", "formal", "gold"],
      category: "Accessories & Bags",
    },
    {
      id: "z7iz4y",
      name: "Black Sunglasses",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=400&fit=crop",
      tags: ["accessory", "casual", "black"],
      category: "Accessories & Bags",
    },
    {
      id: "p2rbea",
      name: "Beige Clutch",
      image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=300&h=400&fit=crop",
      tags: ["accessory", "formal", "beige"],
      category: "Accessories & Bags",
    },

    // Jewelry
    {
      id: "jh4k8m",
      name: "Gold Jhumka Earrings",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=400&fit=crop",
      tags: ["jewelry", "ethnic", "gold"],
      category: "Jewelry",
    },
    {
      id: "pl9w2n",
      name: "Pearl Necklace",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop",
      tags: ["jewelry", "formal", "white"],
      category: "Jewelry",
    },
    {
      id: "sv8x3q",
      name: "Silver Bracelet",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=400&fit=crop",
      tags: ["jewelry", "casual", "silver"],
      category: "Jewelry",
    },
    {
      id: "km5t7r",
      name: "Kundan Maang Tikka",
      image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=300&h=400&fit=crop",
      tags: ["jewelry", "ethnic", "gold"],
      category: "Jewelry",
    },

    // Cultural / Special
    {
      id: "6i2z9o",
      name: "Cream Sherwani",
      image: "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=300&h=400&fit=crop",
      tags: ["cultural", "ethnic", "cream"],
      category: "Cultural / Special",
    },
    {
      id: "8da35j",
      name: "Bridal Red Set",
      image: "https://images.unsplash.com/photo-1598024055266-e772a5f8c128?w=300&h=400&fit=crop",
      tags: ["cultural", "ethnic", "red"],
      category: "Cultural / Special",
    },
  ];

  const filteredItems = wardrobeItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesStyle = selectedStyle === "All Styles" || item.tags.includes(selectedStyle.toLowerCase());
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
    // Handle file upload logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm sm:text-base lg:text-lg">
                LA
              </div>
              <div>
                <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900">LibaasAI</h1>
                <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">Your digital wardrobe</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <button className="rounded-lg bg-emerald-600 px-2.5 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2.5 text-[10px] sm:text-xs lg:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                <span className="hidden sm:inline">Upload Items</span>
                <span className="sm:hidden">Upload</span>
              </button>
              <button className="rounded-lg bg-white border border-gray-300 px-2.5 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2.5 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:py-8">
        {/* Filters Section */}
        <div className="mb-5 sm:mb-6 lg:mb-8 bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Filter by:</h2>
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
              Total: <span className="font-semibold text-emerald-600">{filteredItems.length}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-2 sm:px-3.5 lg:px-4 text-xs sm:text-sm font-medium text-gray-700 hover:border-emerald-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-2 sm:px-3.5 lg:px-4 text-xs sm:text-sm font-medium text-gray-700 hover:border-emerald-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search wardrobe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:flex-1 sm:min-w-[200px] rounded-lg border border-gray-300 px-3 py-2 sm:px-3.5 lg:px-4 text-xs sm:text-sm text-gray-700 placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
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
          <h3 className="mb-2 text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
            Drag & Drop to Upload
          </h3>
          <p className="mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm text-gray-600 px-2 sm:px-4">
            Drop multiple images to add to your wardrobe. Filenames help auto-categorize for POC.
          </p>
          <button className="rounded-lg bg-emerald-600 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
            Select Files
          </button>
        </div>

        {/* Wardrobe Items by Category */}
        {Object.entries(groupedItems).map(([category, items]) => (
          items.length > 0 && (
            <div key={category} className="mb-6 sm:mb-8 lg:mb-12">
              <div className="mb-3 sm:mb-4 lg:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{category}</h2>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                    Curated items in {category.toLowerCase()}
                  </p>
                </div>
                <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-600">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-md sm:rounded-lg lg:rounded-xl bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
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
                      <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 lg:top-2 lg:right-2 flex gap-1 sm:gap-1.5 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="rounded sm:rounded-md lg:rounded-lg bg-white px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-1.5 text-[9px] sm:text-[10px] lg:text-xs font-medium text-gray-700 hover:bg-gray-100 shadow-sm">
                          Edit
                        </button>
                        <button className="rounded sm:rounded-md lg:rounded-lg bg-white px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-1.5 text-[9px] sm:text-[10px] lg:text-xs font-medium text-red-600 hover:bg-red-50 shadow-sm">
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-2 sm:p-3 lg:p-4">
                      <h3 className="mb-0.5 sm:mb-1 font-semibold text-gray-900 text-[11px] sm:text-xs lg:text-sm line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="mb-1.5 sm:mb-2 lg:mb-3 text-[9px] sm:text-[10px] lg:text-xs text-gray-500">ID: {item.id}</p>
                      <div className="flex flex-wrap gap-0.5 sm:gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-0.5 lg:py-1 text-[9px] sm:text-[10px] lg:text-xs font-medium text-gray-700"
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

        {/* Uncategorized Section */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="mb-3 sm:mb-4 lg:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Uncategorized</h2>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                Curated items in uncategorized
              </p>
            </div>
            <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-600">0 items</span>
          </div>
          <div className="rounded-lg sm:rounded-xl bg-white border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
            <p className="text-xs sm:text-sm lg:text-base text-gray-500">No uncategorized items</p>
          </div>
        </div>
      </div>
    </div>
  );
}

