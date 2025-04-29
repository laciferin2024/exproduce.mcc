export default function Dashboard() {
  return (
    <div className="p-4 space-y-6">
      {/* Contract Stats */}
      <div className="stats shadow bg-base-100 w-full">
        <div className="stat">
          <div className="stat-title text-primary">Active Contracts</div>
          <div className="stat-value text-secondary">89</div>
          <div className="stat-desc">Rice • Wheat • Soybean</div>
        </div>
      </div>

      {/* Price Comparison Chart */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-base-content">
            MSP vs Market Prices
          </h2>
          <div className="h-48 bg-neutral/10 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="btm-nav btm-nav-md bg-base-200 md:hidden">
        <button className="active">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}