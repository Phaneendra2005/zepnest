import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestsApi } from '../api/requests';

const CATEGORIES = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Other'];

const CreateRequest = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    preferred_time: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.category) e.category = 'Please select a category.';
    if (!form.address.trim()) e.address = 'Address is required.';
    if (!form.preferred_time) e.preferred_time = 'Preferred date/time is required.';
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP, and GIF files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
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
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      await requestsApi.create(formData);
      toast.success('Service request created!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create request.';
      const apiErrors = err.response?.data?.errors || [];
      if (apiErrors.length) {
        const mapped = {};
        apiErrors.forEach((e) => { mapped[e.field] = e.message; });
        setErrors(mapped);
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !form.title || !form.description || !form.category || !form.address || !form.preferred_time;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link to="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-zinc-300">New Request</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">New Service Request</h1>
        <p className="mt-1 text-sm text-zinc-500">Fill in the details and we'll match you with a professional.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate encType="multipart/form-data">
        {/* Title */}
        <div className="card">
          <h2 className="mb-4 font-display font-semibold text-white text-sm uppercase tracking-widest">Basic Info</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="title">Request title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Fix leaking kitchen sink"
                value={form.title}
                onChange={handleChange}
                className={`input ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.title && <p className="mt-1.5 text-xs text-red-400">{errors.title}</p>}
            </div>

            <div>
              <label className="label" htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`input ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="mt-1.5 text-xs text-red-400">{errors.category}</p>}
            </div>

            <div>
              <label className="label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe the issue in detail…"
                value={form.description}
                onChange={handleChange}
                className={`input resize-none ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="mt-1.5 text-xs text-red-400">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Location & Time */}
        <div className="card">
          <h2 className="mb-4 font-display font-semibold text-white text-sm uppercase tracking-widest">Location & Schedule</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="address">Service address</label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="123 Main St, City, State ZIP"
                value={form.address}
                onChange={handleChange}
                className={`input ${errors.address ? 'border-red-500' : ''}`}
              />
              {errors.address && <p className="mt-1.5 text-xs text-red-400">{errors.address}</p>}
            </div>

            <div>
              <label className="label" htmlFor="preferred_time">Preferred date & time</label>
              <input
                id="preferred_time"
                name="preferred_time"
                type="datetime-local"
                value={form.preferred_time}
                onChange={handleChange}
                className={`input ${errors.preferred_time ? 'border-red-500' : ''}`}
              />
              {errors.preferred_time && <p className="mt-1.5 text-xs text-red-400">{errors.preferred_time}</p>}
            </div>
          </div>
        </div>

        {/* Image upload */}
        <div className="card">
          <h2 className="mb-4 font-display font-semibold text-white text-sm uppercase tracking-widest">Photo (Optional)</h2>
          {imagePreview ? (
            <div className="relative w-full overflow-hidden rounded-xl">
              <img src={imagePreview} alt="Preview" className="h-48 w-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 backdrop-blur-sm hover:bg-red-600 hover:text-white transition-all"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-800 p-10 text-center transition-colors hover:border-zinc-700 hover:bg-zinc-800/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-display font-semibold text-zinc-300">Upload a photo</p>
                <p className="mt-0.5 text-xs text-zinc-600">JPEG, PNG, WebP or GIF · max 5 MB</p>
              </div>
              <input id="image" name="image" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
            </label>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Link to="/dashboard" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={isDisabled} className="btn-primary">
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting…
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;
