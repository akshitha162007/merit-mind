export default function Navbar({ user, openLogin, openSignUp, logout }) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-purple-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#EC4899] to-[#7C3AED] bg-clip-text text-transparent">
          MeritMind
        </h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700">Welcome, {user.name} 👋</span>
              <button
                onClick={logout}
                className="px-6 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="px-6 py-2 border-2 border-[#7C3AED] text-[#7C3AED] font-semibold rounded-lg hover:bg-[#7C3AED] hover:text-white transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={openSignUp}
                className="px-6 py-2 bg-gradient-to-r from-[#EC4899] to-[#7C3AED] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
