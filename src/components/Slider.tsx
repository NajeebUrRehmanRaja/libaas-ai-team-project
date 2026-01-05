'use client';

import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import pic1 from '../../assets/pic-1.jpeg';
import pic2 from '../../assets/pic-2.jpeg';
import pic3 from '../../assets/pic-3.jpeg';
import pic4 from '../../assets/Najeeb - ur - Rehman - Raja.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderImage {
  src: string | StaticImageData;
  alt: string;
  title?: string;
  description?: string;
}

interface ImagePair {
  front: SliderImage;
  back: SliderImage;
}

interface SliderProps {
  images?: SliderImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const defaultImages: SliderImage[] = [
  {
    src: pic4,
    alt: 'Traditional Ethnic Wear',
  },
  {
    src: pic1,
    alt: 'Traditional Ethnic Wear',
  },
  {
    src: pic2,
    alt: 'Casual Street Style',
  },
  {
    src: pic3,
    alt: 'Smart Casual Professional',
  },
];

// Create pairs of images for flip effect
const createImagePairs = (images: SliderImage[]): ImagePair[] => {
  const pairs: ImagePair[] = [];
  for (let i = 0; i < images.length; i += 2) {
    pairs.push({
      front: images[i],
      back: images[i + 1] || images[0], // If odd number, loop back to first
    });
  }
  return pairs;
};

export default function Slider({
  images = defaultImages,
  autoPlay = true,
  autoPlayInterval = 2000, // Changed to 2 seconds
}: SliderProps) {
  const imagePairs = createImagePairs(images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsFlipped(false); // Reset flip on navigation
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagePairs.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsFlipped(false); // Reset flip on navigation
    setCurrentIndex((prevIndex) =>
      prevIndex === imagePairs.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsFlipped(false); // Reset flip on navigation
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-play effect - slides automatically every 2 seconds
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval]);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Style Transformations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover versatile fashion styles powered by AI. Hover to see the transformation!
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Slider Container */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* Images with Flip Effect */}
            <div className="relative w-full h-[500px]" style={{ perspective: '1000px' }}>
              {imagePairs.map((pair, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentIndex
                      ? 'opacity-100 translate-x-0'
                      : index < currentIndex
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                  }`}
                >
                  {/* Flip Card Container */}
                  <div
                    className="relative w-full h-full cursor-pointer"
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.7s',
                      transform: isFlipped && index === currentIndex ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                    onMouseEnter={() => index === currentIndex && setIsFlipped(true)}
                    onMouseLeave={() => index === currentIndex && setIsFlipped(false)}
                  >
                    {/* Front Side (Before) */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <Image
                        src={pair.front.src}
                        alt={pair.front.alt}
                        fill
                        className="object-contain"
                        priority={index === 0}
                        draggable={false}
                      />
                      {/* Before Tag */}
                      <div className="absolute top-6 left-6 bg-orange-500 text-white px-5 py-2 rounded-full text-lg font-bold shadow-lg">
                        Before
                      </div>
                    </div>

                    {/* Back Side (After) */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <Image
                        src={pair.back.src}
                        alt={pair.back.alt}
                        fill
                        className="object-contain"
                        draggable={false}
                      />
                      {/* After Tag */}
                      <div className="absolute top-6 left-6 bg-green-500 text-white px-5 py-2 rounded-full text-lg font-bold shadow-lg">
                        After
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Counter */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm z-10">
              {currentIndex + 1} / {imagePairs.length}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {imagePairs.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'bg-purple-600 w-12 h-3'
                    : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
