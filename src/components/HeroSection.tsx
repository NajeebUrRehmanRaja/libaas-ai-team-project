"use client";

// import Image from "next/image";
import Link from "next/link";
import heroImage from "../../assets/hero-wardrobe.jpg";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400 overflow-hidden">
      <div className="mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Your Wardrobe,
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-yellow-400">
                Reimagined
              </h1>
            </div>

            <p className="max-w-lg text-base sm:text-lg leading-relaxed text-white/90">
              Transform your style with LibassAI - the intelligent wardrobe
              assistant that understands your personal fashion, Pakistani
              heritage, and creates perfect outfit combinations for every
              occasion.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/get-started"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-green-600 hover:gap-4"
              >
                Get Started
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-6 py-3 sm:px-8 text-sm sm:text-base font-semibold text-gray-900 transition-all hover:bg-yellow-500 hover:scale-105"
              >
                Try a demo
              </Link>
            </div>

            {/* Stats */}
            {/* <div className="flex flex-row justify-around gap-4 pt-6">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-bold text-white">1000+</div>
                <div className="text-xs sm:text-sm text-white/80">Active Users</div>
              </div> */}
              {/* <div className="h-px w-full bg-white/20 sm:h-auto sm:w-px"></div> */}
              {/* <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-bold text-white">50K+</div>
                <div className="text-xs sm:text-sm text-white/80">Outfits Created</div>
              </div>
            </div> */}
          </div>

          {/* Right Image */}
          <div className="relative w-full">
            <div className="">
              <img
                src={heroImage.src}
                alt="Beautiful wardrobe with Pakistani traditional clothing"
                className="h-50px w-full rounded-2xl object-cover object-center"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-emerald-700/30 text-sm">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

