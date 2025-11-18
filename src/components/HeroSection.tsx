"use client";

import Image from "next/image";
import Link from "next/link";
import heroImage from "../../assets/hero-wardrobe.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400 overflow-hidden">
      <div className="mx-auto max-w-7xl px-16 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <h1 className="text-5xl font-bold leading-tight text-white">
                Your Wardrobe,
              </h1>
              <h1 className="text-5xl font-bold leading-tight text-yellow-400">
                Reimagined
              </h1>
            </div>

            <p className="max-w-lg text-lg leading-relaxed text-white/90">
              Transform your style with LibassAI - the intelligent wardrobe
              assistant that understands your personal fashion, Pakistani
              heritage, and creates perfect outfit combinations for every
              occasion.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/get-started"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm px-8 py-3 text-base font-semibold text-white transition-all hover:bg-white/30 hover:scale-105"
              >
                Get Started
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-8 py-3 text-base font-semibold text-gray-900 transition-all hover:bg-yellow-500 hover:scale-105"
              >
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:gap-16">
              <div className="space-y-1">
                <div className="text-4xl font-bold text-white">1000+</div>
                <div className="text-sm text-white/80">Active Users</div>
              </div>
              <div className="h-px w-full bg-white/20 sm:h-auto sm:w-px"></div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-white">50K+</div>
                <div className="text-sm text-white/80">Outfits Created</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:h-[400px]">
            <div className="relative h-full min-h-[400px] overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-50 flex items-center justify-center">
              <img
                src={heroImage.src}
                alt="Beautiful wardrobe with Pakistani traditional clothing"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-emerald-700/30 text-sm">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

