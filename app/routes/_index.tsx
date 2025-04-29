import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Exproduce - Agricultural Options Trading Platform" },
    { name: "description", content: "Trade agricultural options with confidence on Exproduce's decentralized platform" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-16">
          <div className="mb-8">
            <img
              src="/logo.png"
              alt="Exproduce"
              className="h-26 mx-auto block dark:hidden"
            />
            {/* <img
              src="/logo-light.jpeg"
              alt="Exproduce"
              className="h-16 mx-auto hidden dark:block"
            /> */}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Agricultural Options Trading
            <span className="block text-green-600 dark:text-green-400">Reimagined</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Trade agricultural commodities with confidence on our decentralized platform.
            Hedge your risks and maximize your opportunities in the agricultural market.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">For Farmers</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">Hedge against price fluctuations and secure your future revenue with our options contracts.</p>
            <a href="/farmer/create" className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline">
              Start Trading →
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">For Traders</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">Access unique agricultural options and participate in a growing decentralized market.</p>
            <a href="/markets" className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline">
              View Markets →
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">For Institutions</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">Provide liquidity and earn rewards while supporting the agricultural ecosystem.</p>
            <a href="/institutions" className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline">
              Learn More →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile optimization highlights:
// - Adjusted grid gaps for mobile (gap-4 → md:gap-8)
// - Responsive typography scaling (text-lg → md:text-xl)
// - Conditional padding for cards (p-4 → md:p-6)