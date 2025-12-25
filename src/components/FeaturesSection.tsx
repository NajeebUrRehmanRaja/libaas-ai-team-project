export default function FeaturesSection() {
  const features = [
    {
      phase: "Phase 1",
      title: "Smart Wardrobe Management",
      description:
        "Upload your clothes and accessories effortlessly. Our AI catalogs every piece, from traditional shalwar kameez to modern accessories, creating your personalized digital wardrobe.",
      icon: (
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      ),
      iconBg: "bg-emerald-700",
      phaseColor: "text-yellow-500",
    },
    {
      phase: "Phase 1",
      title: "AI Outfit Suggestions",
      description:
        "Tell us the occasion - a wedding, casual meetup, or formal event - and get instant outfit recommendations from your own wardrobe, perfectly matched to the event.",
      icon: (
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
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      iconBg: "bg-orange-500",
      phaseColor: "text-yellow-500",
    },
    {
      phase: "Phase 2",
      title: "Product-to-Wardrobe Matching",
      description:
        "Upload a picture of any dress from your favorite brand or accessory you love. Our AI instantly shows which items from your wardrobe complement it perfectly.",
      icon: (
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      iconBg: "bg-yellow-500",
      phaseColor: "text-yellow-500",
    },
    {
      phase: "Phase 3",
      title: "Personalized Style Intelligence",
      description:
        "Get recommendations tailored to your height, body shape, and skin tone. Our AI understands what works best for you, ensuring every outfit enhances your natural beauty.",
      icon: (
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
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      iconBg: "bg-emerald-700",
      phaseColor: "text-yellow-500",
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-12 px-12">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-12 lg:mb-16 text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            Intelligent Features for Your Style Journey
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600 px-4 sm:px-0">
            From wardrobe management to personalized recommendations, LibassAI
            brings the future of fashion to your fingertips.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              {/* Icon */}
              <div className="mb-4 sm:mb-6 flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl ${feature.iconBg} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${feature.phaseColor} bg-yellow-50 px-2 py-1 rounded-full`}
                >
                  {feature.phase}
                </span>
              </div>

              {/* Content */}
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                {feature.description}
              </p>

              {/* Hover Effect Border */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-600 to-yellow-500 transition-all duration-300 group-hover:w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

