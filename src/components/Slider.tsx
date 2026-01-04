'use client';

import { useState, useEffect, useRef } from 'react';
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

interface SliderProps {
  images?: SliderImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const defaultImages: SliderImage[] = [
     {
    src: pic4,
    alt: 'Traditional Ethnic Wear',
    // title: 'Traditional Style',
    // description: 'Elegant traditional ethnic attire',
  },
  {
    src: pic1,
    alt: 'Traditional Ethnic Wear',
    // title: 'Traditional Style',
    // description: 'Elegant traditional ethnic attire',
  },
  {
    src: pic2,
    alt: 'Casual Street Style',
    // title: 'Casual Look',
    // description: 'Comfortable street style outfit',
  },
  {
    src: pic3,
    alt: 'Smart Casual Professional',
    // title: 'Professional Style',
    // description: 'Refined smart casual ensemble',
  },
];

export default function Slider({
  images = defaultImages,
  autoPlay = true,
  autoPlayInterval = 5000,
}: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Scroll-based navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView && Math.abs(e.deltaY) > 10) {
        e.preventDefault();
        if (e.deltaY > 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (section) {
        section.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex, isTransitioning]);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval]);

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Style Transformations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover versatile fashion styles powered by AI. From casual to professional, we&apos;ve got you covered.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Slider Container */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* Images */}
            <div className="relative w-full h-[500px] ">
              {images.map((image, index) => {
                // Determine if this image is "Before" or "After" based on even/odd index
                const tag = index % 2 === 0 ? 'Before' : 'After';
                const tagColor = index % 2 === 0 ? 'bg-orange-500' : 'bg-green-500';
                
                return (
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
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-contain"
                      priority={index === 0}
                      draggable={false}
                    />
                    
                    {/* Before/After Tag */}
                    <div className={`absolute top-6 left-6 ${tagColor} text-white px-5 rounded-full text-lg font-bold `}>
                      {tag}
                    </div>
                    
                    {/* Image Overlay Info */}
                    {image.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-8">
                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                          {image.title}
                        </h3>
                        {image.description && (
                          <p className="text-white/90 text-sm md:text-base">
                            {image.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {images.map((_, index) => (
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

          {/* Thumbnail Navigation (Optional - Hidden on mobile) */}
          <div className="hidden md:flex justify-center gap-4 mt-8">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`relative w-24 h-32 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-4 ring-purple-600 scale-105'
                    : 'ring-2 ring-gray-300 hover:ring-purple-400 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-contain bg-gray-100"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
