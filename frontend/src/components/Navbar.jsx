import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-display font-bold text-sm transition-transform group-hover:scale-105">
            Z
          </span>
          <span className="font-display font-bold text-xl text-white tracking-tight">
            Zep<span className="text-brand-400">nest</span>
          </span>
        </Link>

        {/* Nav links */}
        {isAuthenticated ? (
          <nav className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className={`hidden sm:block text-sm font-display font-medium transition-colors ${
                location.pathname === '/dashboard'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link to="/requests/new" className="btn-primary text-xs px-4 py-2">
              + New Request
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-display font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs text-white font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:block">{user?.name?.split(' ')[0]}</span>
                <svg className="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-zinc-800 bg-zinc-900 py-1 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                <div className="border-b border-zinc-800 px-4 py-2.5">
                  <p className="text-xs font-display font-semibold text-zinc-300">{user?.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <Link to="/login" className="btn-secondary text-xs px-4 py-2">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-xs px-4 py-2">
              Get started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
