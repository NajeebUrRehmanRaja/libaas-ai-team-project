import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "How It Works", href: "/how-it-works" },
    ],
    company: [
      { name: "My Wardrobe", href: "/my-wardrobe" },
      { name: "Generate Look", href: "/get-started" },
      { name: "Profile", href: "/profile" },
    ],
  };

  return (
    <footer className="w-full bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400">
      <div className="mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-16 lg:py-12">
        <div className=" flex flex-col md:flex-row justify-between px-20">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300"
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
              <Link href="/" className="text-xl sm:text-2xl font-bold text-white">
                LibassAI
              </Link>
            </div>
            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-white/90">
              Your intelligent wardrobe assistant, bringing the perfect blend of
              Pakistani fashion heritage and cutting-edge AI technology.
            </p>
          </div>

          {/* Product Links */}
          {/* <div>
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-white">Product</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Company Links */}
          <div className="">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        {/* <div className="my-6 sm:my-8 h-px bg-white/20"></div> */}

        {/* Copyright */}
        {/* <div className="text-center">
          <p className="text-xs sm:text-sm text-white/80">
            © {currentYear} LibassAI. All rights reserved. Crafted with passion
            for Pakistani fashion.
          </p>
        </div> */}
      </div>
    </footer>
  );
}

