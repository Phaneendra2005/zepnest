import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/requests';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    else if (!/\d/.test(form.password)) e.password = 'Password must contain at least one number.';
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.register(form);
      login(data.data.token, data.data.user);
      toast.success(`Welcome to Zepnest, ${data.data.user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !form.name || !form.email || !form.password;

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-zinc-500">Book home services in minutes</p>
        </div>

        <div className="card border-zinc-800">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div>
              <label className="label" htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                className={`input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="label" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={`input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters with a number"
                value={form.password}
                onChange={handleChange}
                className={`input ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
              {/* Password strength visual */}
              {form.password && (
                <div className="mt-2 flex gap-1">
                  {[8, 12, 16].map((threshold, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        form.password.length >= threshold && /\d/.test(form.password)
                          ? ['bg-red-500', 'bg-amber-400', 'bg-brand-400'][i]
                          : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={isDisabled} className="btn-primary w-full mt-1">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
