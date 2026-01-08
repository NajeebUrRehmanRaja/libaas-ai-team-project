'use client';

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import pic1 from '../../assets/pic-1.jpeg';
import pic2 from '../../assets/pic-2.jpeg';
import pic3 from '../../assets/pic-3.jpeg';
import pic4 from '../../assets/Najeeb - ur - Rehman - Raja.png';

// Marquee Component - Continuous scrolling from left to right
interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
}

const Marquee = ({ children, direction = 'right', speed = 30, pauseOnHover = true }: MarqueeProps) => {
  return (
    <>
      <div 
        className="overflow-hidden w-full"
      >
        <div 
          className="flex w-max"
          style={{
            animation: `marquee-${direction} ${speed}s linear infinite`,
            animationPlayState: 'running',
          }}
          onMouseEnter={(e) => {
            if (pauseOnHover) {
              e.currentTarget.style.animationPlayState = 'paused';
            }
          }}
          onMouseLeave={(e) => {
            if (pauseOnHover) {
              e.currentTarget.style.animationPlayState = 'running';
            }
          }}
        >
          {/* First set of images */}
          <div className="flex flex-shrink-0">
            {children}
          </div>
          {/* Duplicate for seamless continuous loop */}
          <div className="flex flex-shrink-0">
            {children}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
};

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
  autoPlayInterval = 2000,
}: SliderProps) {
  const imagePairs = createImagePairs(images);
  // Track flip state for each image individually
  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    new Array(imagePairs.length).fill(false)
  );

  const handleFlip = (index: number, isFlipped: boolean) => {
    setFlippedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = isFlipped;
      return newStates;
    });
  };

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
        <div className="w-full bg-gray-200 px-2 py-2 rounded-lg overflow-hidden">
          <Marquee direction="right" speed={10} pauseOnHover={true}>
            {imagePairs.map((pair, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[300px] h-[550px] mx-4"
                style={{ perspective: '1000px' }}
              >
                {/* Flip Card Container */}
                <div
                  className="relative w-full h-full cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.7s',
                    transform: flippedStates[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                  onMouseEnter={() => handleFlip(index, true)}
                  onMouseLeave={() => handleFlip(index, false)}
                >
                  {/* Front Side (Before) */}
                  <div
                    className="absolute inset-0 rounded-lg overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <Image
                      src={pair.front.src}
                      alt={pair.front.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      draggable={false}
                    />
                    {/* Before Tag */}
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-r-full text-xs font-bold shadow-lg">
                      Before
                    </div>
                  </div>

                  {/* Back Side (After) */}
                  <div
                    className="absolute inset-0 rounded-lg overflow-hidden"
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
                      className="object-cover"
                      draggable={false}
                    />
                    {/* After Tag */}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-l-full text-xs font-bold shadow-lg">
                      After
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
