import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    label: 'Request Tracking',
    desc: 'Monitor every request from submission to completion in real time.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Photo Uploads',
    desc: 'Attach photos to help professionals understand the job before they arrive.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    label: 'Secure & Private',
    desc: 'JWT-protected accounts so only you can see your service history.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: '5 Service Types',
    desc: 'Plumbing, Electrical, Cleaning, Carpentry, and more — all in one place.',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-36">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center animate-slide-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-display font-semibold text-brand-400 tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            Home services, simplified
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-tight text-white sm:text-7xl">
            Your home,{' '}
            <span className="text-brand-400">cared for</span>
            <br />on your terms.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400 leading-relaxed">
            Zepnest connects homeowners with trusted professionals for plumbing, electrical,
            cleaning, carpentry, and more — all tracked in one clean dashboard.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary px-8 py-3 text-base">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary px-8 py-3 text-base">
                  Get started free
                </Link>
                <Link to="/login" className="btn-secondary px-8 py-3 text-base">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-800/60 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-3 text-zinc-500">Powerful features built for homeowners and property managers.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="card flex flex-col gap-3 hover:border-zinc-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition-all duration-200"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                  {f.icon}
                </div>
                <div>
                  <p className="font-display font-semibold text-white text-sm">{f.label}</p>
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/60 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-3 text-zinc-500">Create your free account and submit your first request in under 2 minutes.</p>
          <Link to="/register" className="btn-primary mt-8 px-10 py-3 text-base inline-flex">
            Create free account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
