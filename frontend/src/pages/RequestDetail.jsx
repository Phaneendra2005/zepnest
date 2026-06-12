import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestsApi } from '../api/requests';
import StatusBadge from '../components/StatusBadge';
import CategoryIcon from '../components/CategoryIcon';

const STATUSES = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await requestsApi.get(id);
        setRequest(data.data.request);
        setSelectedStatus(data.data.request.status);
      } catch (err) {
        const msg = err.response?.status === 404
          ? 'Request not found.'
          : err.response?.status === 403
          ? 'You are not authorized to view this request.'
          : 'Failed to load request.';
        toast.error(msg);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    if (selectedStatus === request.status) return;
    setUpdatingStatus(true);
    try {
      const { data } = await requestsApi.updateStatus(id, selectedStatus);
      setRequest(data.data.request);
      toast.success('Status updated successfully.');
    } catch {
      toast.error('Failed to update status.');
      setSelectedStatus(request.status);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await requestsApi.delete(id);
      toast.success('Request deleted.');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete request.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="card animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-zinc-800" />
          <div className="h-10 w-2/3 rounded bg-zinc-800" />
          <div className="h-32 rounded bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (!request) return null;

  const formattedPreferred = new Date(request.preferred_time).toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const formattedCreated = new Date(request.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link to="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-zinc-300 truncate max-w-xs">{request.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <CategoryIcon category={request.category} />
          <div>
            <h1 className="font-display text-2xl font-bold text-white leading-snug">{request.title}</h1>
            <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-widest">{request.category}</p>
          </div>
        </div>
        <StatusBadge status={request.status} className="shrink-0 self-start" />
      </div>

      {/* Image */}
      {request.image_url && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-zinc-800">
          <img
            src={request.image_url}
            alt={request.title}
            className="h-64 w-full object-cover"
          />
        </div>
      )}

      {/* Detail cards */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="card space-y-1">
          <p className="label">Description</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{request.description}</p>
        </div>

        <div className="card space-y-4">
          <div>
            <p className="label">Address</p>
            <p className="text-sm text-zinc-300">{request.address}</p>
          </div>
          <div>
            <p className="label">Preferred Time</p>
            <p className="text-sm text-zinc-300">{formattedPreferred}</p>
          </div>
          <div>
            <p className="label">Submitted</p>
            <p className="text-sm text-zinc-300">{formattedCreated}</p>
          </div>
          <div>
            <p className="label">Request ID</p>
            <p className="text-xs font-mono text-zinc-600 truncate">{request.id}</p>
          </div>
        </div>
      </div>

      {/* Status update */}
      <div className="card mb-6">
        <h2 className="mb-4 font-display font-semibold text-white text-sm uppercase tracking-widest">Update Status</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input w-auto flex-1 min-w-48"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updatingStatus || selectedStatus === request.status}
            className="btn-primary"
          >
            {updatingStatus ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving…
              </>
            ) : (
              'Save Status'
            )}
          </button>
        </div>
        {selectedStatus !== request.status && (
          <p className="mt-3 text-xs text-brand-400">
            Changing from <strong>{request.status}</strong> → <strong>{selectedStatus}</strong>
          </p>
        )}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-900/40 bg-red-950/10 p-5">
        <h2 className="mb-1 font-display font-semibold text-red-400 text-sm uppercase tracking-widest">Danger Zone</h2>
        <p className="mb-4 text-sm text-zinc-500">Once deleted, this request cannot be recovered.</p>

        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger text-xs">
            Delete Request
          </button>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm text-zinc-300 font-semibold">Are you sure?</p>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger text-xs">
              {deleting ? 'Deleting…' : 'Yes, delete it'}
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary text-xs">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetail;
